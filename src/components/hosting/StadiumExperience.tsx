import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import * as THREE from "three";

const IMPACT_TIME = 4.65;
const REVEAL_END = 8.2;
const FAR_WICKET_Z = -11;

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));
const smoothstep = (value: number) => {
  const t = clamp01(value);
  return t * t * (3 - 2 * t);
};
const smootherstep = (value: number) => {
  const t = clamp01(value);
  return t * t * t * (t * (t * 6 - 15) + 10);
};

function useReducedMotion() {
  const reduced = useRef(false);
  useEffect(() => {
    reduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);
  return reduced;
}

function createGrassTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 512;
  const context = canvas.getContext("2d");
  if (!context) return new THREE.CanvasTexture(canvas);

  context.fillStyle = "#285e32";
  context.fillRect(0, 0, 512, 512);
  let seed = 9417;
  const random = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
  for (let y = 0; y < 512; y += 32) {
    context.fillStyle = y % 64 === 0 ? "rgba(102,155,83,.16)" : "rgba(9,61,28,.16)";
    context.fillRect(0, y, 512, 32);
  }
  for (let index = 0; index < 9000; index += 1) {
    const shade = 42 + Math.floor(random() * 48);
    context.fillStyle = `rgba(${18 + Math.floor(random() * 25)},${shade + 42},${24 + Math.floor(random() * 28)},${0.12 + random() * 0.2})`;
    context.fillRect(random() * 512, random() * 512, 1, 2 + random() * 3);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(7, 7);
  texture.anisotropy = 8;
  return texture;
}

function createPitchTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 1024;
  const context = canvas.getContext("2d");
  if (!context) return new THREE.CanvasTexture(canvas);

  const gradient = context.createLinearGradient(0, 0, 256, 0);
  gradient.addColorStop(0, "#937750");
  gradient.addColorStop(0.18, "#b49a6c");
  gradient.addColorStop(0.5, "#c8b17c");
  gradient.addColorStop(0.82, "#aa8c5e");
  gradient.addColorStop(1, "#806541");
  context.fillStyle = gradient;
  context.fillRect(0, 0, 256, 1024);
  let seed = 1709;
  const random = () => {
    seed = (seed * 48271) % 2147483647;
    return seed / 2147483647;
  };
  for (let index = 0; index < 6500; index += 1) {
    const value = 85 + Math.floor(random() * 95);
    context.fillStyle = `rgba(${value},${Math.floor(value * 0.82)},${Math.floor(value * 0.53)},${0.04 + random() * 0.12})`;
    context.fillRect(random() * 256, random() * 1024, 1 + random() * 2, 2 + random() * 8);
  }
  context.strokeStyle = "rgba(255,255,245,.9)";
  context.lineWidth = 7;
  [70, 954].forEach((y) => {
    context.beginPath();
    context.moveTo(0, y);
    context.lineTo(256, y);
    context.stroke();
  });
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
}

function createScoreboardTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 1600;
  canvas.height = 700;
  const context = canvas.getContext("2d");
  if (!context) return new THREE.CanvasTexture(canvas);

  const gradient = context.createLinearGradient(0, 0, 1600, 700);
  gradient.addColorStop(0, "#150203");
  gradient.addColorStop(0.5, "#3b0508");
  gradient.addColorStop(1, "#100102");
  context.fillStyle = gradient;
  context.fillRect(0, 0, 1600, 700);

  context.strokeStyle = "rgba(204,38,48,.18)";
  context.lineWidth = 2;
  for (let x = 0; x < 1600; x += 32) {
    context.beginPath();
    context.moveTo(x, 0);
    context.lineTo(x, 700);
    context.stroke();
  }
  for (let y = 0; y < 700; y += 32) {
    context.beginPath();
    context.moveTo(0, y);
    context.lineTo(1600, y);
    context.stroke();
  }

  context.fillStyle = "#f6eee9";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.font = "700 122px Arial, sans-serif";
  context.shadowColor = "rgba(255,35,48,.9)";
  context.shadowBlur = 36;
  context.fillText("HOSTING PLAN", 800, 285);
  context.fillText("EXPIRED", 800, 435);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
}

function Field() {
  const grass = useMemo(createGrassTexture, []);
  const pitch = useMemo(createPitchTexture, []);
  useEffect(() => () => {
    grass.dispose();
    pitch.dispose();
  }, [grass, pitch]);

  return (
    <>
      <mesh rotation-x={-Math.PI / 2} receiveShadow>
        <circleGeometry args={[50, 128]} />
        <meshStandardMaterial map={grass} roughness={0.94} color="#8cb17f" />
      </mesh>
      <mesh rotation-x={-Math.PI / 2} position={[0, 0.018, 0]} receiveShadow>
        <planeGeometry args={[3.15, 23]} />
        <meshStandardMaterial map={pitch} roughness={0.88} />
      </mesh>
      <mesh rotation-x={-Math.PI / 2} position={[0, 0.028, 0]}>
        <ringGeometry args={[41.8, 42.03, 128]} />
        <meshBasicMaterial color="#efe9dd" transparent opacity={0.62} />
      </mesh>
    </>
  );
}

function Stadium() {
  const crowd = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const colors = useMemo(() => ["#8e151c", "#d8d2c5", "#23303b", "#a78735"], []);

  useEffect(() => {
    if (!crowd.current) return;
    const color = new THREE.Color();
    for (let index = 0; index < 520; index += 1) {
      const angle = (index / 520) * Math.PI * 2;
      const row = index % 7;
      const radius = 48 + row * 1.38;
      dummy.position.set(Math.cos(angle) * radius, 2.3 + row * 1.1, Math.sin(angle) * radius);
      dummy.rotation.y = -angle;
      dummy.scale.set(0.55, 0.65, 0.5);
      dummy.updateMatrix();
      crowd.current.setMatrixAt(index, dummy.matrix);
      color.set(colors[index % colors.length]);
      crowd.current.setColorAt(index, color);
    }
    crowd.current.instanceMatrix.needsUpdate = true;
    if (crowd.current.instanceColor) crowd.current.instanceColor.needsUpdate = true;
  }, [colors, dummy]);

  return (
    <group>
      <mesh position={[0, 7, 0]} receiveShadow>
        <cylinderGeometry args={[65, 48, 18, 128, 4, true]} />
        <meshStandardMaterial color="#4a4d4f" roughness={0.72} side={THREE.BackSide} />
      </mesh>
      {[49, 52.5, 56, 59.5].map((radius, index) => (
        <mesh key={radius} rotation-x={Math.PI / 2} position-y={3.1 + index * 2.25} receiveShadow>
          <torusGeometry args={[radius, 1.45, 4, 128]} />
          <meshStandardMaterial color={index % 2 === 0 ? "#741016" : "#c7c1b6"} roughness={0.68} />
        </mesh>
      ))}
      <instancedMesh ref={crowd} args={[undefined, undefined, 520]}>
        <boxGeometry args={[0.7, 0.8, 0.72]} />
        <meshStandardMaterial roughness={0.9} />
      </instancedMesh>
      <mesh rotation-x={Math.PI / 2} position-y={14.2}>
        <torusGeometry args={[61, 2.8, 6, 128]} />
        <meshStandardMaterial color="#1c2227" metalness={0.55} roughness={0.38} />
      </mesh>
      {[-1, 1].flatMap((xSign) =>
        [-1, 1].map((zSign) => (
          <group key={`${xSign}-${zSign}`} position={[xSign * 38, 0, zSign * 32]}>
            <mesh position-y={12} castShadow>
              <cylinderGeometry args={[0.16, 0.28, 24, 12]} />
              <meshStandardMaterial color="#73777a" metalness={0.8} roughness={0.25} />
            </mesh>
            <mesh position={[0, 24.1, 0]} rotation-x={-0.12 * zSign}>
              <boxGeometry args={[7, 1.7, 0.55]} />
              <meshStandardMaterial color="#f5efe3" emissive="#fff0cf" emissiveIntensity={2.8} />
            </mesh>
          </group>
        )),
      )}
    </group>
  );
}

function Wicket({ position, far = false, animationTime }: { position: [number, number, number]; far?: boolean; animationTime: React.MutableRefObject<number> }) {
  const bailLeft = useRef<THREE.Mesh>(null);
  const bailRight = useRef<THREE.Mesh>(null);
  const middleStump = useRef<THREE.Mesh>(null);
  const sideStump = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (!far) return;
    const elapsed = Math.max(0, animationTime.current - IMPACT_TIME);
    const flight = Math.min(elapsed, 1.6);
    if (bailLeft.current) {
      bailLeft.current.position.set(-0.16 - flight * 1.1, 1.57 + flight * 1.5 - 1.4 * flight * flight, flight * 0.65);
      bailLeft.current.rotation.set(flight * 5.5, flight * 2.4, -flight * 4.4);
    }
    if (bailRight.current) {
      bailRight.current.position.set(0.16 + flight * 0.85, 1.57 + flight * 1.25 - 1.3 * flight * flight, -flight * 0.48);
      bailRight.current.rotation.set(-flight * 4.8, flight * 3.1, flight * 5.2);
    }
    if (middleStump.current) middleStump.current.rotation.x = Math.min(elapsed * 1.7, 0.42);
    if (sideStump.current) sideStump.current.rotation.z = -Math.min(elapsed * 1.25, 0.22);
  });

  return (
    <group position={position}>
      {[-0.28, 0, 0.28].map((x, index) => (
        <mesh
          key={x}
          ref={index === 1 ? middleStump : index === 2 ? sideStump : undefined}
          position={[x, 0.76, 0]}
          castShadow
        >
          <cylinderGeometry args={[0.045, 0.055, 1.52, 18]} />
          <meshStandardMaterial color="#f1dfba" roughness={0.54} />
        </mesh>
      ))}
      <mesh ref={bailLeft} position={[-0.16, 1.57, 0]} rotation-z={Math.PI / 2} castShadow>
        <cylinderGeometry args={[0.031, 0.031, 0.38, 14]} />
        <meshStandardMaterial color="#f1dfba" roughness={0.54} />
      </mesh>
      <mesh ref={bailRight} position={[0.16, 1.57, 0]} rotation-z={Math.PI / 2} castShadow>
        <cylinderGeometry args={[0.031, 0.031, 0.38, 14]} />
        <meshStandardMaterial color="#f1dfba" roughness={0.54} />
      </mesh>
    </group>
  );
}

function Scoreboard({ animationTime }: { animationTime: React.MutableRefObject<number> }) {
  const texture = useMemo(createScoreboardTexture, []);
  const screenMaterial = useRef<THREE.MeshStandardMaterial>(null);
  useEffect(() => () => texture.dispose(), [texture]);

  useFrame(() => {
    if (!screenMaterial.current) return;
    const reveal = smoothstep((animationTime.current - IMPACT_TIME - 0.65) / 1.4);
    screenMaterial.current.emissiveIntensity = reveal * 1.7;
    screenMaterial.current.opacity = 0.18 + reveal * 0.82;
  });

  return (
    <group position={[0, 14.2, -48]}>
      <mesh position={[0, 0, -0.5]} castShadow>
        <boxGeometry args={[24, 11, 1.1]} />
        <meshStandardMaterial color="#151719" metalness={0.82} roughness={0.28} />
      </mesh>
      <mesh position={[0, 0, 0.08]}>
        <planeGeometry args={[22.2, 9.25]} />
        <meshStandardMaterial
          ref={screenMaterial}
          map={texture}
          emissiveMap={texture}
          emissive="#8d1018"
          emissiveIntensity={0}
          transparent
          opacity={0.18}
          toneMapped={false}
        />
      </mesh>
      {[-11.6, 11.6].map((x) => (
        <mesh key={x} position={[x, -8.8, -0.2]}>
          <cylinderGeometry args={[0.42, 0.62, 8.2, 16]} />
          <meshStandardMaterial color="#363a3d" metalness={0.75} roughness={0.34} />
        </mesh>
      ))}
    </group>
  );
}

function DustBurst({ animationTime }: { animationTime: React.MutableRefObject<number> }) {
  const dust = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const vectors = useMemo(
    () => Array.from({ length: 34 }, (_, index) => ({
      x: Math.sin(index * 2.31) * (0.35 + (index % 7) * 0.08),
      y: 0.45 + (index % 5) * 0.18,
      z: Math.cos(index * 1.73) * (0.3 + (index % 6) * 0.09),
      scale: 0.035 + (index % 4) * 0.014,
    })),
    [],
  );

  useFrame(() => {
    if (!dust.current) return;
    const elapsed = animationTime.current - IMPACT_TIME;
    vectors.forEach((velocity, index) => {
      if (elapsed < 0 || elapsed > 1.7) {
        dummy.scale.setScalar(0);
      } else {
        dummy.position.set(
          velocity.x * elapsed,
          0.52 + velocity.y * elapsed - 0.55 * elapsed * elapsed,
          FAR_WICKET_Z + velocity.z * elapsed,
        );
        dummy.scale.setScalar(velocity.scale * (1 - elapsed / 1.7));
      }
      dummy.updateMatrix();
      dust.current?.setMatrixAt(index, dummy.matrix);
    });
    dust.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={dust} args={[undefined, undefined, vectors.length]}>
      <sphereGeometry args={[1, 6, 5]} />
      <meshStandardMaterial color="#c6aa78" transparent opacity={0.72} roughness={1} />
    </instancedMesh>
  );
}

function CricketBall({ animationTime }: { animationTime: React.MutableRefObject<number> }) {
  const ball = useRef<THREE.Group>(null);
  const throwPath = useMemo(
    () => new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.85, 2.7, 40),
      new THREE.Vector3(0.35, 2.25, 30),
      new THREE.Vector3(-0.35, 1.65, 15),
      new THREE.Vector3(0.48, 1.12, 0),
      new THREE.Vector3(0.08, 0.76, FAR_WICKET_Z),
    ]),
    [],
  );

  useFrame((_, rawDelta) => {
    if (!ball.current) return;
    const elapsed = animationTime.current;
    if (elapsed <= IMPACT_TIME) {
      const progress = smootherstep(elapsed / IMPACT_TIME);
      const point = throwPath.getPointAt(progress);
      ball.current.position.copy(point);
      ball.current.rotation.x += Math.min(rawDelta, 0.05) * 15;
      ball.current.rotation.z += Math.min(rawDelta, 0.05) * 4.5;
    } else {
      const after = Math.min(elapsed - IMPACT_TIME, 1.3);
      ball.current.position.set(0.08 - after * 1.2, 0.76 + after * 0.48 - after * after * 0.4, FAR_WICKET_Z - 0.12 + after * 1.35);
      ball.current.rotation.x += Math.min(rawDelta, 0.05) * 8;
    }
  });

  return (
    <group ref={ball}>
      <mesh castShadow>
        <sphereGeometry args={[0.38, 48, 32]} />
        <meshPhysicalMaterial color="#8b0e17" roughness={0.48} clearcoat={0.34} clearcoatRoughness={0.38} />
      </mesh>
      <mesh rotation-x={Math.PI / 2}>
        <torusGeometry args={[0.374, 0.012, 8, 96]} />
        <meshStandardMaterial color="#e6d5bc" roughness={0.7} />
      </mesh>
      <mesh rotation-x={Math.PI / 2} rotation-y={0.09}>
        <torusGeometry args={[0.374, 0.008, 8, 96]} />
        <meshStandardMaterial color="#d5c3aa" roughness={0.72} />
      </mesh>
    </group>
  );
}

function CinematicRig({ animationTime }: { animationTime: React.MutableRefObject<number> }) {
  const { camera } = useThree();
  const reducedMotion = useReducedMotion();
  const lookAt = useRef(new THREE.Vector3(0, 1, 0));
  const desiredPosition = useMemo(() => new THREE.Vector3(), []);
  const desiredLook = useMemo(() => new THREE.Vector3(), []);
  const startCamera = useMemo(() => new THREE.Vector3(0, 3.6, 32), []);
  const impactCamera = useMemo(() => new THREE.Vector3(0.5, 3.3, -1.8), []);
  const finalCamera = useMemo(() => new THREE.Vector3(0, 8.4, -10), []);
  const scoreboardTarget = useMemo(() => new THREE.Vector3(0, 14.2, -48), []);
  const ballPath = useMemo(
    () => new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.85, 2.7, 40),
      new THREE.Vector3(0.35, 2.25, 30),
      new THREE.Vector3(-0.35, 1.65, 15),
      new THREE.Vector3(0.48, 1.12, 0),
      new THREE.Vector3(0.08, 0.76, FAR_WICKET_Z),
    ]),
    [],
  );

  useEffect(() => {
    camera.position.copy(startCamera);
    lookAt.current.set(0, 1.1, 12);
    camera.lookAt(lookAt.current);
  }, [camera, startCamera]);

  useFrame(({ clock }, rawDelta) => {
    const delta = Math.min(rawDelta, 0.05);
    animationTime.current = reducedMotion.current ? REVEAL_END : Math.min(clock.getElapsedTime(), REVEAL_END);
    const elapsed = animationTime.current;

    if (reducedMotion.current) {
      camera.position.copy(finalCamera);
      camera.lookAt(scoreboardTarget);
      return;
    }

    if (elapsed < 0.72) {
      desiredPosition.copy(startCamera);
      desiredLook.set(0, 1.2, 8);
    } else if (elapsed < IMPACT_TIME) {
      const progress = smootherstep(elapsed / IMPACT_TIME);
      const ballPosition = ballPath.getPointAt(progress);
      const chaseBlend = smoothstep((elapsed - 0.72) / 1.05);
      desiredPosition.copy(startCamera).lerp(
        new THREE.Vector3(ballPosition.x * 0.45, ballPosition.y + 2.3, ballPosition.z + 8.4),
        chaseBlend,
      );
      desiredLook.copy(ballPosition).add(new THREE.Vector3(0, 0.08, -1.8));
    } else {
      const rise = smootherstep((elapsed - IMPACT_TIME) / (REVEAL_END - IMPACT_TIME));
      desiredPosition.copy(impactCamera).lerp(finalCamera, rise);
      desiredLook.set(0, 0.8, FAR_WICKET_Z).lerp(scoreboardTarget, smoothstep((rise - 0.08) / 0.82));
    }

    const damping = 1 - Math.exp(-5.2 * delta);
    camera.position.lerp(desiredPosition, damping);
    lookAt.current.lerp(desiredLook, 1 - Math.exp(-6.4 * delta));
    camera.lookAt(lookAt.current);
    const perspective = camera as THREE.PerspectiveCamera;
    const targetFov = elapsed < IMPACT_TIME ? 54 + smoothstep(elapsed / IMPACT_TIME) * 6 : 60 - smoothstep((elapsed - IMPACT_TIME) / 2.5) * 10;
    perspective.fov += (targetFov - perspective.fov) * (1 - Math.exp(-3 * delta));
    perspective.updateProjectionMatrix();
  });

  return null;
}

function StadiumScene() {
  const animationTime = useRef(0);

  return (
    <>
      <color attach="background" args={["#071015"]} />
      <fog attach="fog" args={["#071015", 48, 108]} />
      <hemisphereLight args={["#9cc9df", "#203d22", 1.15]} />
      <directionalLight
        position={[-18, 34, 24]}
        intensity={2.65}
        color="#fff1d5"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-left={-24}
        shadow-camera-right={24}
        shadow-camera-top={28}
        shadow-camera-bottom={-28}
        shadow-camera-near={1}
        shadow-camera-far={80}
      />
      <spotLight position={[-34, 27, 28]} target-position={[0, 0, 0]} intensity={760} distance={100} angle={0.5} penumbra={0.72} color="#d9efff" />
      <spotLight position={[34, 27, 28]} target-position={[0, 0, 0]} intensity={760} distance={100} angle={0.5} penumbra={0.72} color="#fff0d0" />
      <spotLight position={[-34, 27, -30]} target-position={[0, 0, -4]} intensity={670} distance={100} angle={0.52} penumbra={0.72} color="#e4f2ff" />
      <spotLight position={[34, 27, -30]} target-position={[0, 0, -4]} intensity={670} distance={100} angle={0.52} penumbra={0.72} color="#fff1d7" />
      <Environment resolution={128}>
        <Lightformer intensity={2.5} position={[0, 18, 10]} scale={[22, 10, 1]} />
        <Lightformer intensity={1.6} color="#a9d7ee" position={[-20, 8, -8]} rotation-y={Math.PI / 2} scale={[32, 8, 1]} />
        <Lightformer intensity={1.4} color="#ffd7a5" position={[20, 8, -8]} rotation-y={-Math.PI / 2} scale={[32, 8, 1]} />
      </Environment>

      <Field />
      <Stadium />
      <Wicket position={[0, 0, 10.5]} animationTime={animationTime} />
      <Wicket position={[0, 0, FAR_WICKET_Z]} far animationTime={animationTime} />
      <CricketBall animationTime={animationTime} />
      <DustBurst animationTime={animationTime} />
      <Scoreboard animationTime={animationTime} />
      <CinematicRig animationTime={animationTime} />
    </>
  );
}

export default function StadiumExperience() {
  return (
    <div className="fixed inset-0 overflow-hidden bg-foreground" aria-label="Cricket stadium hosting expiry animation">
      <Canvas
        shadows
        dpr={[1, 1.6]}
        camera={{ position: [0, 3.6, 32], fov: 54, near: 0.08, far: 160 }}
        gl={{ antialias: true, powerPreference: "high-performance" }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.05;
          gl.shadowMap.type = THREE.PCFSoftShadowMap;
        }}
      >
        <StadiumScene />
      </Canvas>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_42%,hsl(var(--foreground)/0.42)_100%)]" />
      <h1 className="sr-only">Hosting Plan Expired</h1>
    </div>
  );
}

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer, Sky } from "@react-three/drei";
import * as THREE from "three";

const PITCH_LENGTH = 20.12;
const PITCH_WIDTH = 3.05;
const WICKET_Z = -PITCH_LENGTH / 2;
const BALL_RADIUS = 0.036;
const IMPACT_TIME = 4.7;
const SCREEN_REVEAL_TIME = 6.05;
const SEQUENCE_END = 10.2;

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

function seededRandom(seedValue: number) {
  let seed = seedValue;
  return () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
}

function createGrassTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 1024;
  const context = canvas.getContext("2d");
  if (!context) return new THREE.CanvasTexture(canvas);
  const random = seededRandom(9417);
  const base = context.createLinearGradient(0, 0, 1024, 1024);
  base.addColorStop(0, "#387f3d");
  base.addColorStop(0.5, "#286c33");
  base.addColorStop(1, "#347a39");
  context.fillStyle = base;
  context.fillRect(0, 0, 1024, 1024);
  for (let stripe = 0; stripe < 16; stripe += 1) {
    context.fillStyle = stripe % 2 === 0 ? "rgba(184,218,112,.075)" : "rgba(8,62,22,.07)";
    context.fillRect(0, stripe * 64, 1024, 64);
  }
  for (let index = 0; index < 24000; index += 1) {
    const green = 75 + Math.floor(random() * 85);
    context.fillStyle = `rgba(${20 + Math.floor(random() * 38)},${green},${20 + Math.floor(random() * 42)},${0.14 + random() * 0.22})`;
    const x = random() * 1024;
    const y = random() * 1024;
    context.fillRect(x, y, 1, 2 + random() * 5);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(5, 5);
  texture.anisotropy = 12;
  return texture;
}

function createGrassBumpTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 256;
  const context = canvas.getContext("2d");
  if (!context) return new THREE.CanvasTexture(canvas);
  const random = seededRandom(6211);
  context.fillStyle = "#787878";
  context.fillRect(0, 0, 256, 256);
  for (let index = 0; index < 10000; index += 1) {
    const shade = 75 + Math.floor(random() * 105);
    context.fillStyle = `rgb(${shade},${shade},${shade})`;
    context.fillRect(random() * 256, random() * 256, 1, 1 + random() * 3);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(22, 22);
  return texture;
}

function createPitchTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 2048;
  const context = canvas.getContext("2d");
  if (!context) return new THREE.CanvasTexture(canvas);
  const random = seededRandom(1709);
  const gradient = context.createLinearGradient(0, 0, 512, 0);
  gradient.addColorStop(0, "#95794e");
  gradient.addColorStop(0.16, "#b69c6b");
  gradient.addColorStop(0.5, "#ccb47b");
  gradient.addColorStop(0.84, "#aa8d5d");
  gradient.addColorStop(1, "#80633f");
  context.fillStyle = gradient;
  context.fillRect(0, 0, 512, 2048);
  for (let index = 0; index < 15000; index += 1) {
    const value = 80 + Math.floor(random() * 120);
    context.fillStyle = `rgba(${value},${Math.floor(value * 0.82)},${Math.floor(value * 0.52)},${0.04 + random() * 0.17})`;
    context.fillRect(random() * 512, random() * 2048, 1 + random() * 3, 3 + random() * 13);
  }
  context.strokeStyle = "rgba(255,255,248,.96)";
  context.lineWidth = 10;
  [150, 1898].forEach((y) => {
    context.beginPath();
    context.moveTo(0, y);
    context.lineTo(512, y);
    context.stroke();
  });
  context.lineWidth = 5;
  [112, 1936].forEach((y) => {
    context.beginPath();
    context.moveTo(76, y);
    context.lineTo(436, y);
    context.stroke();
  });
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 12;
  return texture;
}

function createWoodTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 512;
  const context = canvas.getContext("2d");
  if (!context) return new THREE.CanvasTexture(canvas);
  const random = seededRandom(311);
  const gradient = context.createLinearGradient(0, 0, 128, 0);
  gradient.addColorStop(0, "#d6ad64");
  gradient.addColorStop(0.48, "#f0d18f");
  gradient.addColorStop(1, "#bd8b48");
  context.fillStyle = gradient;
  context.fillRect(0, 0, 128, 512);
  for (let index = 0; index < 130; index += 1) {
    context.strokeStyle = `rgba(91,52,20,${0.035 + random() * 0.08})`;
    context.lineWidth = 1 + random() * 2;
    context.beginPath();
    const x = random() * 128;
    context.moveTo(x, 0);
    context.bezierCurveTo(x + random() * 10 - 5, 160, x + random() * 12 - 6, 350, x + random() * 8 - 4, 512);
    context.stroke();
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function createBallTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 512;
  const context = canvas.getContext("2d");
  if (!context) return new THREE.CanvasTexture(canvas);
  const random = seededRandom(713);
  context.fillStyle = "#99151d";
  context.fillRect(0, 0, 512, 512);
  for (let index = 0; index < 12000; index += 1) {
    const tone = 80 + Math.floor(random() * 70);
    context.fillStyle = `rgba(${tone + 50},${18 + Math.floor(random() * 20)},${25 + Math.floor(random() * 18)},${0.04 + random() * 0.12})`;
    context.fillRect(random() * 512, random() * 512, 1, 1);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function createScoreboardTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 2048;
  canvas.height = 960;
  const context = canvas.getContext("2d");
  if (!context) return new THREE.CanvasTexture(canvas);
  const background = context.createLinearGradient(0, 0, 2048, 960);
  background.addColorStop(0, "#090b0e");
  background.addColorStop(0.45, "#380509");
  background.addColorStop(1, "#090a0d");
  context.fillStyle = background;
  context.fillRect(0, 0, 2048, 960);
  context.strokeStyle = "rgba(255,63,68,.14)";
  context.lineWidth = 2;
  for (let x = 0; x < 2048; x += 16) {
    context.beginPath();
    context.moveTo(x, 0);
    context.lineTo(x, 960);
    context.stroke();
  }
  for (let y = 0; y < 960; y += 16) {
    context.beginPath();
    context.moveTo(0, y);
    context.lineTo(2048, y);
    context.stroke();
  }
  context.save();
  context.translate(1024, 480);
  context.strokeStyle = "rgba(233,34,45,.75)";
  context.lineWidth = 12;
  context.beginPath();
  context.arc(0, 0, 350, 0, Math.PI * 2);
  context.stroke();
  context.lineWidth = 3;
  context.beginPath();
  context.arc(0, 0, 390, 0, Math.PI * 2);
  context.stroke();
  context.fillStyle = "rgba(198,16,28,.23)";
  context.beginPath();
  context.moveTo(-1024, -380);
  context.lineTo(-350, -90);
  context.lineTo(-550, 0);
  context.lineTo(-350, 90);
  context.lineTo(-1024, 380);
  context.closePath();
  context.fill();
  context.scale(-1, 1);
  context.fill();
  context.restore();
  context.fillStyle = "#ff2332";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.font = "900 94px Arial, sans-serif";
  context.fillText("OUT", 1024, 190);
  context.shadowColor = "rgba(255,28,42,.9)";
  context.shadowBlur = 34;
  context.fillStyle = "#fff9ef";
  context.font = "800 126px Arial, sans-serif";
  context.fillText("HOSTING PLAN", 1024, 445);
  context.fillText("EXPIRED", 1024, 605);
  context.shadowBlur = 0;
  context.fillStyle = "rgba(255,248,232,.78)";
  context.font = "600 34px Arial, sans-serif";
  context.fillText("DECISION CONFIRMED", 1024, 790);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 12;
  return texture;
}

function Field() {
  const grass = useMemo(createGrassTexture, []);
  const grassBump = useMemo(createGrassBumpTexture, []);
  const pitch = useMemo(createPitchTexture, []);
  useEffect(() => () => {
    grass.dispose();
    grassBump.dispose();
    pitch.dispose();
  }, [grass, grassBump, pitch]);
  return (
    <>
      <mesh rotation-x={-Math.PI / 2} receiveShadow>
        <circleGeometry args={[68, 160]} />
        <meshStandardMaterial map={grass} bumpMap={grassBump} bumpScale={0.055} roughness={0.92} color="#9cc78f" />
      </mesh>
      <mesh rotation-x={-Math.PI / 2} position-y={0.014} receiveShadow>
        <planeGeometry args={[PITCH_WIDTH, PITCH_LENGTH + 2.8, 1, 20]} />
        <meshStandardMaterial map={pitch} roughness={0.86} bumpMap={grassBump} bumpScale={0.018} />
      </mesh>
      <mesh rotation-x={-Math.PI / 2} position-y={0.027}>
        <ringGeometry args={[59.7, 59.84, 160]} />
        <meshStandardMaterial color="#f4eee1" roughness={0.72} />
      </mesh>
    </>
  );
}

function Stadium() {
  const crowd = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const colors = useMemo(() => ["#a51c27", "#f1e8d5", "#164d79", "#e4a92f", "#2d613b", "#242a32"], []);
  useEffect(() => {
    if (!crowd.current) return;
    const color = new THREE.Color();
    const random = seededRandom(8441);
    for (let index = 0; index < 1250; index += 1) {
      const angle = random() * Math.PI * 2;
      const row = Math.floor(random() * 11);
      const radius = 70 + row * 1.75;
      dummy.position.set(Math.cos(angle) * radius, 2.1 + row * 0.86, Math.sin(angle) * radius);
      dummy.rotation.y = -angle;
      dummy.scale.set(0.36 + random() * 0.16, 0.48 + random() * 0.24, 0.32 + random() * 0.14);
      dummy.updateMatrix();
      crowd.current.setMatrixAt(index, dummy.matrix);
      color.set(colors[Math.floor(random() * colors.length)]);
      crowd.current.setColorAt(index, color);
    }
    crowd.current.instanceMatrix.needsUpdate = true;
    if (crowd.current.instanceColor) crowd.current.instanceColor.needsUpdate = true;
  }, [colors, dummy]);
  return (
    <group>
      <mesh position-y={7.5} receiveShadow>
        <cylinderGeometry args={[92, 69, 20, 160, 8, true]} />
        <meshStandardMaterial color="#8a9295" roughness={0.78} side={THREE.BackSide} />
      </mesh>
      {[72, 76, 80, 84, 88].map((radius, index) => (
        <mesh key={radius} rotation-x={Math.PI / 2} position-y={3 + index * 2.25} receiveShadow>
          <torusGeometry args={[radius, 1.25, 4, 160]} />
          <meshStandardMaterial color={index % 2 === 0 ? "#a61e28" : "#d8d4ca"} roughness={0.7} />
        </mesh>
      )))}
      {Array.from({ length: 20 }, (_, index) => {
        const angle = (index / 20) * Math.PI * 2;
        return (
          <mesh key={index} position={[Math.cos(angle) * 79, 7.4, Math.sin(angle) * 79]} rotation-y={-angle}>
            <boxGeometry args={[1.45, 12, 0.35]} />
            <meshStandardMaterial color="#c7c5bf" roughness={0.68} />
          </mesh>
        );
      })}
      <instancedMesh ref={crowd} args={[undefined, undefined, 1250]}>
        <capsuleGeometry args={[0.28, 0.35, 3, 6]} />
        <meshStandardMaterial roughness={0.88} />
      </instancedMesh>
      <mesh rotation-x={Math.PI / 2} position-y={15.6} castShadow>
        <torusGeometry args={[91, 3.5, 8, 160]} />
        <meshStandardMaterial color="#43494e" metalness={0.48} roughness={0.4} />
      </mesh>
      {[-1, 1].flatMap((xSign) => [-1, 1].map((zSign) => (
        <group key={`${xSign}-${zSign}`} position={[xSign * 52, 0, zSign * 46]}>
          <mesh position-y={16} castShadow>
            <cylinderGeometry args={[0.15, 0.34, 32, 12]} />
            <meshStandardMaterial color="#9aa0a3" metalness={0.78} roughness={0.28} />
          </mesh>
          <mesh position={[0, 31.2, 0]}>
            <boxGeometry args={[8.8, 3.4, 0.45]} />
            <meshStandardMaterial color="#e5e9e6" metalness={0.35} roughness={0.4} />
          </mesh>
          {Array.from({ length: 12 }, (_, index) => (
            <mesh key={index} position={[-3.75 + (index % 6) * 1.5, 30.45 + Math.floor(index / 6) * 1.5, -0.28]}>
              <boxGeometry args={[1.18, 1.02, 0.18]} />
              <meshStandardMaterial color="#fff4d2" emissive="#fff0c2" emissiveIntensity={0.32} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}

function Wicket({ position, far = false, animationTime }: { position: [number, number, number]; far?: boolean; animationTime: React.MutableRefObject<number> }) {
  const wood = useMemo(createWoodTexture, []);
  const bails = [useRef<THREE.Mesh>(null), useRef<THREE.Mesh>(null)];
  const stumps = [useRef<THREE.Mesh>(null), useRef<THREE.Mesh>(null), useRef<THREE.Mesh>(null)];
  useEffect(() => () => wood.dispose(), [wood]);
  useFrame(() => {
    if (!far) return;
    const t = Math.max(0, animationTime.current - IMPACT_TIME);
    const gravity = 9.81;
    const bailVelocities = [[-1.05, 2.35, 0.9], [0.78, 2.08, -0.4]];
    bails.forEach((ref, index) => {
      const mesh = ref.current;
      if (!mesh) return;
      if (t <= 0) {
        mesh.position.set(index === 0 ? -0.115 : 0.115, 0.738, 0);
        mesh.rotation.set(0, 0, Math.PI / 2);
        return;
      }
      const flight = Math.min(t, 0.72);
      const velocity = bailVelocities[index];
      mesh.position.set(
        (index === 0 ? -0.115 : 0.115) + velocity[0] * flight,
        Math.max(0.035, 0.738 + velocity[1] * flight - 0.5 * gravity * flight * flight),
        velocity[2] * flight,
      );
      mesh.rotation.set(flight * (index ? -14 : 12), flight * 9, Math.PI / 2 + flight * (index ? 11 : -13));
    });
    stumps.forEach((ref, index) => {
      const mesh = ref.current;
      if (!mesh) return;
      const delay = index * 0.025;
      const response = Math.max(0, t - delay);
      mesh.rotation.x = index === 1 ? Math.min(response * 1.7, 1.1) : Math.min(response * (index ? 0.72 : 0.38), index ? 0.34 : 0.17);
      mesh.rotation.z = index === 1 ? -Math.min(response * 0.62, 0.28) : (index - 1) * Math.min(response * 0.18, 0.1);
    });
  });
  return (
    <group position={position}>
      {[-0.114, 0, 0.114].map((x, index) => (
        <mesh key={x} ref={stumps[index]} position={[x, 0.3555, 0]} castShadow>
          <cylinderGeometry args={[0.019, 0.021, 0.711, 18]} />
          <meshStandardMaterial map={wood} roughness={0.48} />
        </mesh>
      ))}
      {[-0.115, 0.115].map((x, index) => (
        <mesh key={x} ref={bails[index]} position={[x, 0.738, 0]} rotation-z={Math.PI / 2} castShadow>
          <cylinderGeometry args={[0.012, 0.012, 0.25, 14]} />
          <meshStandardMaterial map={wood} roughness={0.5} />
        </mesh>
      ))}
    </group>
  );
}

function CricketBall({ animationTime, ballPosition }: { animationTime: React.MutableRefObject<number>; ballPosition: React.MutableRefObject<THREE.Vector3> }) {
  const ball = useRef<THREE.Group>(null);
  const leather = useMemo(createBallTexture, []);
  useEffect(() => () => leather.dispose(), [leather]);
  useFrame((_, rawDelta) => {
    const group = ball.current;
    if (!group) return;
    const t = animationTime.current;
    let x = 0;
    let y = BALL_RADIUS;
    let z = WICKET_Z;
    if (t <= IMPACT_TIME) {
      const progress = clamp01(t / IMPACT_TIME);
      z = THREE.MathUtils.lerp(18.5, WICKET_Z, progress);
      const swing = Math.sin(progress * Math.PI) * 0.13 + Math.pow(progress, 3) * -0.105;
      x = 0.045 + swing;
      const bounceProgress = 0.73;
      if (progress < bounceProgress) {
        const phase = progress / bounceProgress;
        y = 1.95 * (1 - phase) + BALL_RADIUS + Math.sin(phase * Math.PI) * 0.34;
      } else {
        const phase = (progress - bounceProgress) / (1 - bounceProgress);
        y = BALL_RADIUS + Math.sin(phase * Math.PI) * 0.27 + phase * 0.28;
      }
    } else {
      const after = Math.min(t - IMPACT_TIME, 1.1);
      x = -0.06 - after * 0.74;
      y = Math.max(BALL_RADIUS, 0.31 + after * 0.42 - 0.5 * 2.8 * after * after);
      z = WICKET_Z + after * 0.85;
    }
    group.position.set(x, y, z);
    ballPosition.current.copy(group.position);
    const delta = Math.min(rawDelta, 0.05);
    group.rotation.x += delta * 31;
    group.rotation.z += delta * 7;
  });
  return (
    <group ref={ball}>
      <mesh castShadow>
        <sphereGeometry args={[BALL_RADIUS, 40, 28]} />
        <meshPhysicalMaterial map={leather} roughness={0.43} clearcoat={0.28} clearcoatRoughness={0.48} />
      </mesh>
      <mesh rotation-x={Math.PI / 2}>
        <torusGeometry args={[BALL_RADIUS * 0.985, BALL_RADIUS * 0.035, 7, 80]} />
        <meshStandardMaterial color="#eee1c7" roughness={0.66} />
      </mesh>
    </group>
  );
}

function ImpactDust({ animationTime }: { animationTime: React.MutableRefObject<number> }) {
  const particles = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const velocities = useMemo(() => Array.from({ length: 30 }, (_, index) => ({
    x: Math.sin(index * 2.31) * (0.11 + (index % 5) * 0.025),
    y: 0.15 + (index % 4) * 0.07,
    z: Math.cos(index * 1.73) * (0.09 + (index % 6) * 0.02),
  })), []);
  useFrame(() => {
    if (!particles.current) return;
    const t = animationTime.current - IMPACT_TIME;
    velocities.forEach((velocity, index) => {
      if (t < 0 || t > 0.8) dummy.scale.setScalar(0);
      else {
        dummy.position.set(velocity.x * t, 0.04 + velocity.y * t - 0.5 * 0.72 * t * t, WICKET_Z + velocity.z * t);
        dummy.scale.setScalar((0.008 + (index % 3) * 0.004) * (1 - t / 0.8));
      }
      dummy.updateMatrix();
      particles.current?.setMatrixAt(index, dummy.matrix);
    });
    particles.current.instanceMatrix.needsUpdate = true;
  });
  return (
    <instancedMesh ref={particles} args={[undefined, undefined, velocities.length]}>
      <sphereGeometry args={[1, 5, 4]} />
      <meshStandardMaterial color="#d3b67d" transparent opacity={0.7} roughness={1} />
    </instancedMesh>
  );
}

function StadiumScreen({ animationTime }: { animationTime: React.MutableRefObject<number> }) {
  const texture = useMemo(createScoreboardTexture, []);
  const screen = useRef<THREE.MeshStandardMaterial>(null);
  const scan = useRef<THREE.Mesh>(null);
  useEffect(() => () => texture.dispose(), [texture]);
  useFrame(() => {
    const reveal = smootherstep((animationTime.current - SCREEN_REVEAL_TIME) / 0.62);
    if (screen.current) {
      screen.current.opacity = reveal;
      screen.current.emissiveIntensity = reveal * 1.25;
    }
    if (scan.current) {
      scan.current.visible = reveal > 0 && reveal < 1;
      scan.current.position.y = 4.1 - reveal * 8.2;
    }
  });
  return (
    <group position={[0, 11.8, -39]}>
      <mesh position={[0, 0, -0.62]} castShadow>
        <boxGeometry args={[21.8, 10.8, 1.25]} />
        <meshStandardMaterial color="#252b2f" metalness={0.72} roughness={0.31} />
      </mesh>
      <mesh position={[0, 0, 0.03]}>
        <planeGeometry args={[20.5, 9.6]} />
        <meshStandardMaterial color="#050608" roughness={0.34} />
      </mesh>
      <mesh position={[0, 0, 0.055]}>
        <planeGeometry args={[20.5, 9.6]} />
        <meshStandardMaterial ref={screen} map={texture} emissiveMap={texture} emissive="#d51825" emissiveIntensity={0} transparent opacity={0} toneMapped={false} />
      </mesh>
      <mesh ref={scan} position={[0, 4.1, 0.09]} visible={false}>
        <planeGeometry args={[20.4, 0.12]} />
        <meshBasicMaterial color="#fff2da" transparent opacity={0.85} />
      </mesh>
      {[-10.2, 10.2].map((x) => (
        <mesh key={x} position={[x, -8, -0.42]} castShadow>
          <cylinderGeometry args={[0.29, 0.48, 7.2, 16]} />
          <meshStandardMaterial color="#626b70" metalness={0.72} roughness={0.34} />
        </mesh>
      ))}
    </group>
  );
}

function CinematicRig({ animationTime, ballPosition }: { animationTime: React.MutableRefObject<number>; ballPosition: React.MutableRefObject<THREE.Vector3> }) {
  const { camera, size } = useThree();
  const reducedMotion = useReducedMotion();
  const desiredPosition = useMemo(() => new THREE.Vector3(), []);
  const desiredLook = useMemo(() => new THREE.Vector3(), []);
  const smoothedLook = useRef(new THREE.Vector3(0, 0.4, 0));
  const start = useMemo(() => new THREE.Vector3(0.72, 1.28, 15.2), []);
  const impact = useMemo(() => new THREE.Vector3(0.8, 1.05, -4.7), []);
  const screenTarget = useMemo(() => new THREE.Vector3(0, 11.8, -39), []);
  useEffect(() => {
    camera.position.copy(start);
    camera.lookAt(0, 0.3, -2);
  }, [camera, start]);
  useFrame(({ clock }, rawDelta) => {
    const delta = Math.min(rawDelta, 0.05);
    animationTime.current = reducedMotion.current ? SEQUENCE_END : Math.min(clock.getElapsedTime(), SEQUENCE_END);
    const elapsed = animationTime.current;
    const perspective = camera as THREE.PerspectiveCamera;
    const aspect = Math.max(0.42, size.width / size.height);
    if (reducedMotion.current) {
      const distance = Math.max(23, 11.4 / (Math.tan(THREE.MathUtils.degToRad(22)) * aspect));
      camera.position.set(0, 11.8, -39 + distance);
      camera.lookAt(screenTarget);
      perspective.fov = 44;
      perspective.updateProjectionMatrix();
      return;
    }
    if (elapsed < 0.85) {
      desiredPosition.copy(start);
      desiredLook.set(0, 0.31, -2.2);
    } else if (elapsed < IMPACT_TIME) {
      const chase = smootherstep((elapsed - 0.85) / (IMPACT_TIME - 0.85));
      const ball = ballPosition.current;
      desiredPosition.copy(start).lerp(new THREE.Vector3(ball.x + 0.46, Math.max(0.78, ball.y + 0.58), ball.z + 5.7), chase);
      desiredLook.copy(ball).add(new THREE.Vector3(0, 0.08, -1.8));
    } else {
      const crane = smootherstep((elapsed - IMPACT_TIME) / 2.05);
      const settle = smootherstep((elapsed - 6.65) / (SEQUENCE_END - 6.65));
      const finalDistance = Math.max(23, 11.35 / (Math.tan(THREE.MathUtils.degToRad(22)) * aspect));
      const revealPosition = new THREE.Vector3(0.4, 8.9, -7.5);
      const finalPosition = new THREE.Vector3(0, 11.8, -39 + finalDistance);
      desiredPosition.copy(impact).lerp(revealPosition, crane).lerp(finalPosition, settle);
      desiredLook.set(0, 0.38, WICKET_Z).lerp(screenTarget, smootherstep((elapsed - IMPACT_TIME - 0.32) / 1.55));
    }
    const positionDamping = 1 - Math.exp(-(elapsed > 6.5 ? 2.1 : 4.2) * delta);
    camera.position.lerp(desiredPosition, positionDamping);
    smoothedLook.current.lerp(desiredLook, 1 - Math.exp(-5.2 * delta));
    if (elapsed > IMPACT_TIME && elapsed < IMPACT_TIME + 0.28) {
      const shake = Math.sin((elapsed - IMPACT_TIME) * 70) * (0.035 * (1 - (elapsed - IMPACT_TIME) / 0.28));
      camera.position.x += shake;
      camera.position.y += shake * 0.42;
    }
    camera.lookAt(smoothedLook.current);
    const targetFov = elapsed < IMPACT_TIME ? 47 + smoothstep(elapsed / IMPACT_TIME) * 4 : 51 - smoothstep((elapsed - IMPACT_TIME) / 3.4) * 7;
    perspective.fov += (targetFov - perspective.fov) * (1 - Math.exp(-3 * delta));
    perspective.updateProjectionMatrix();
  });
  return null;
}

function StadiumScene() {
  const animationTime = useRef(0);
  const ballPosition = useRef(new THREE.Vector3(0, 1.8, 18.5));
  return (
    <>
      <color attach="background" args={["#79b8df"]} />
      <fog attach="fog" args={["#91c4df", 82, 190]} />
      <Sky distance={450000} sunPosition={[80, 48, 40]} inclination={0.52} azimuth={0.23} turbidity={5.2} rayleigh={1.7} mieCoefficient={0.006} mieDirectionalG={0.78} />
      <hemisphereLight args={["#d8efff", "#51723c", 1.65]} />
      <directionalLight position={[-24, 42, 30]} intensity={3.1} color="#fff1cf" castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048} shadow-camera-left={-18} shadow-camera-right={18} shadow-camera-top={24} shadow-camera-bottom={-24} shadow-camera-near={1} shadow-camera-far={90} shadow-bias={-0.00012} />
      <Environment resolution={128}>
        <Lightformer intensity={2.2} position={[0, 28, 15]} scale={[38, 16, 1]} />
        <Lightformer intensity={1.1} color="#bde5ff" position={[-30, 10, 0]} rotation-y={Math.PI / 2} scale={[40, 12, 1]} />
        <Lightformer intensity={0.8} color="#ffe2ae" position={[30, 12, 0]} rotation-y={-Math.PI / 2} scale={[40, 10, 1]} />
      </Environment>
      <Field />
      <Stadium />
      <Wicket position={[0, 0, PITCH_LENGTH / 2]} animationTime={animationTime} />
      <Wicket position={[0, 0, WICKET_Z]} far animationTime={animationTime} />
      <CricketBall animationTime={animationTime} ballPosition={ballPosition} />
      <ImpactDust animationTime={animationTime} />
      <StadiumScreen animationTime={animationTime} />
      <CinematicRig animationTime={animationTime} ballPosition={ballPosition} />
    </>
  );
}

export default function StadiumExperience() {
  return (
    <div className="fixed inset-0 overflow-hidden bg-foreground" aria-label="Cricket stadium hosting expiry animation">
      <Canvas shadows dpr={[1, 1.65]} camera={{ position: [0.72, 1.28, 15.2], fov: 47, near: 0.015, far: 240 }} gl={{ antialias: true, powerPreference: "high-performance" }} onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.12;
        gl.shadowMap.type = THREE.PCFSoftShadowMap;
      }}>
        <StadiumScene />
      </Canvas>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_60%,hsl(var(--foreground)/0.2)_100%)]" />
      <h1 className="sr-only">Hosting Plan Expired</h1>
    </div>
  );
}

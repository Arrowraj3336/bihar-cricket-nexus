import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import brlLogo from "@/assets/logos/brl-logo-new.png";

const CricketLoader = () => {
  const [loading, setLoading] = useState(true);
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 400),
      setTimeout(() => setPhase(2), 1200),
      setTimeout(() => setPhase(3), 2200),
      setTimeout(() => setPhase(4), 3200),
      setTimeout(() => setLoading(false), 4200),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  const hexPoints = Array.from({ length: 6 }, (_, i) => {
    const angle = (Math.PI / 3) * i - Math.PI / 2;
    return `${50 + 45 * Math.cos(angle)}%,${50 + 45 * Math.sin(angle)}%`;
  }).join(" ");

  const dataLines = [
    "SYS.BOOT >> INITIALIZING CORE...",
    "NEURAL_NET >> LOADING MODULES...",
    "SECURE_LINK >> ESTABLISHING...",
    "HUD.RENDER >> CALIBRATING...",
    "ANALYTICS >> SYNCING DATA...",
    "AUTH_LAYER >> VERIFYING ACCESS...",
  ];

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden"
          style={{ background: "linear-gradient(135deg, #0a0a0f 0%, #0d1117 40%, #0a0f1a 100%)" }}
        >
          {/* Grid background */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: `linear-gradient(rgba(0,170,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,170,255,0.3) 1px, transparent 1px)`,
              backgroundSize: "60px 60px",
            }}
          />

          {/* Scanning line */}
          <motion.div
            className="absolute left-0 right-0 h-[1px]"
            style={{ background: "linear-gradient(90deg, transparent, rgba(0,170,255,0.4), transparent)" }}
            animate={{ top: ["0%", "100%", "0%"] }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          />

          {/* Corner brackets */}
          {[
            "top-4 left-4 border-t-2 border-l-2",
            "top-4 right-4 border-t-2 border-r-2",
            "bottom-4 left-4 border-b-2 border-l-2",
            "bottom-4 right-4 border-b-2 border-r-2",
          ].map((pos, i) => (
            <motion.div
              key={i}
              className={`absolute w-8 h-8 ${pos}`}
              style={{ borderColor: "rgba(0,170,255,0.3)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 + i * 0.1 }}
            />
          ))}

          {/* Left data stream */}
          <div className="absolute left-6 top-16 space-y-1.5">
            {dataLines.map((line, i) => (
              <motion.p
                key={i}
                className="text-[9px] font-mono tracking-wider"
                style={{ color: "rgba(0,170,255,0.4)" }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: phase >= 1 ? 1 : 0, x: phase >= 1 ? 0 : -20 }}
                transition={{ delay: i * 0.15, duration: 0.3 }}
              >
                {line}
              </motion.p>
            ))}
          </div>

          {/* Right status indicators */}
          <div className="absolute right-6 top-16 space-y-2">
            {["CORE", "NET", "HUD", "SEC"].map((label, i) => (
              <motion.div
                key={i}
                className="flex items-center gap-2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: phase >= 2 ? 1 : 0, x: phase >= 2 ? 0 : 20 }}
                transition={{ delay: i * 0.12 }}
              >
                <span className="text-[9px] font-mono tracking-widest" style={{ color: "rgba(0,170,255,0.5)" }}>
                  {label}
                </span>
                <motion.div
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: phase >= 3 ? "#00ff88" : "rgba(0,170,255,0.3)" }}
                  animate={phase >= 3 ? { boxShadow: ["0 0 4px #00ff88", "0 0 12px #00ff88", "0 0 4px #00ff88"] } : {}}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              </motion.div>
            ))}
          </div>

          {/* Center ARC REACTOR / HUD */}
          <div className="relative flex items-center justify-center w-72 h-72">
            {/* Outer hexagonal ring */}
            <motion.svg
              className="absolute w-full h-full"
              viewBox="0 0 100 100"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 0.3, scale: 1, rotate: 360 }}
              transition={{ opacity: { duration: 0.5 }, scale: { duration: 0.5 }, rotate: { duration: 20, repeat: Infinity, ease: "linear" } }}
            >
              <polygon
                points={hexPoints}
                fill="none"
                stroke="rgba(0,170,255,0.4)"
                strokeWidth="0.3"
              />
            </motion.svg>

            {/* Rotating ring 1 */}
            <motion.div
              className="absolute w-56 h-56 rounded-full"
              style={{ border: "1px solid rgba(0,170,255,0.15)" }}
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            >
              {[0, 90, 180, 270].map((deg) => (
                <div
                  key={deg}
                  className="absolute w-2 h-2 rounded-full"
                  style={{
                    background: "rgba(0,170,255,0.6)",
                    boxShadow: "0 0 8px rgba(0,170,255,0.4)",
                    top: "50%",
                    left: "50%",
                    transform: `rotate(${deg}deg) translateY(-112px) translate(-50%, -50%)`,
                  }}
                />
              ))}
            </motion.div>

            {/* Rotating ring 2 (counter) */}
            <motion.div
              className="absolute w-44 h-44 rounded-full"
              style={{ border: "1px dashed rgba(0,170,255,0.1)" }}
              animate={{ rotate: -360 }}
              transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            />

            {/* Inner arc segments */}
            <motion.svg className="absolute w-40 h-40" viewBox="0 0 100 100"
              animate={{ rotate: -360 }}
              transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
            >
              {[0, 120, 240].map((angle) => (
                <path
                  key={angle}
                  d={describeArc(50, 50, 40, angle, angle + 80)}
                  fill="none"
                  stroke="rgba(0,170,255,0.25)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              ))}
            </motion.svg>

            {/* Pulsing core glow */}
            <motion.div
              className="absolute w-28 h-28 rounded-full"
              style={{
                background: "radial-gradient(circle, rgba(0,170,255,0.08) 0%, transparent 70%)",
              }}
              animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* Logo */}
            <motion.div
              className="relative z-10 flex items-center justify-center"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
            >
              <motion.div
                className="w-20 h-20 rounded-full flex items-center justify-center"
                style={{
                  background: "radial-gradient(circle, rgba(0,170,255,0.1) 0%, transparent 70%)",
                  boxShadow: "0 0 30px rgba(0,170,255,0.15), inset 0 0 20px rgba(0,170,255,0.05)",
                }}
                animate={{ boxShadow: ["0 0 30px rgba(0,170,255,0.15)", "0 0 50px rgba(0,170,255,0.3)", "0 0 30px rgba(0,170,255,0.15)"] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <img src={brlLogo} alt="BRL" className="w-14 h-14 object-contain" />
              </motion.div>
            </motion.div>
          </div>

          {/* Greeting */}
          <motion.h1
            className="mt-6 text-2xl font-heading font-bold tracking-[0.15em] uppercase"
            style={{ color: "rgba(0,170,255,0.9)" }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: phase >= 1 ? 1 : 0, y: phase >= 1 ? 0 : 20 }}
            transition={{ duration: 0.5 }}
          >
            Hello, Raaz
          </motion.h1>

          {/* Status text */}
          <motion.div className="mt-4 flex flex-col items-center gap-2">
            <motion.p
              className="text-[10px] font-mono tracking-[0.5em] uppercase"
              style={{ color: "rgba(0,170,255,0.5)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: phase >= 2 ? 1 : 0 }}
              transition={{ duration: 0.4 }}
            >
              J.A.R.V.I.S — INITIALIZING
            </motion.p>

            {/* Progress bar */}
            <motion.div
              className="w-48 h-[2px] rounded-full overflow-hidden mt-1"
              style={{ background: "rgba(0,170,255,0.1)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: phase >= 2 ? 1 : 0 }}
            >
              <motion.div
                className="h-full rounded-full"
                style={{ background: "linear-gradient(90deg, rgba(0,170,255,0.8), #00ff88)" }}
                initial={{ width: "0%" }}
                animate={{ width: phase >= 2 ? "100%" : "0%" }}
                transition={{ duration: 2, ease: "easeInOut" }}
              />
            </motion.div>

            <motion.p
              className="text-[9px] font-mono"
              style={{ color: "rgba(0,255,136,0.6)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: phase >= 4 ? 1 : 0 }}
            >
              ALL SYSTEMS ONLINE
            </motion.p>
          </motion.div>

          {/* Bottom bar */}
          <motion.div
            className="absolute bottom-6 left-6 right-6 flex justify-between items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: phase >= 1 ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-[8px] font-mono" style={{ color: "rgba(0,170,255,0.3)" }}>
              BRL.SYS.v4.2.1
            </p>
            <p className="text-[8px] font-mono" style={{ color: "rgba(0,170,255,0.3)" }}>
              BIHAR RURAL LEAGUE — SECURE ACCESS
            </p>
            <motion.p
              className="text-[8px] font-mono"
              style={{ color: "rgba(0,170,255,0.3)" }}
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              ● LIVE
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Helper to draw SVG arcs
function describeArc(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`;
}

function polarToCartesian(cx: number, cy: number, r: number, angle: number) {
  const rad = ((angle - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

export default CricketLoader;

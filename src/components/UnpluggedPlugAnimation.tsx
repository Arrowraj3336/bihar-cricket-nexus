import { motion } from "framer-motion";

/**
 * Smooth, realistic "male plug detached from socket with arcing current" animation.
 * Pure SVG + framer-motion (no external gif).
 */
const Spark = ({ delay, path }: { delay: number; path: string }) => (
  <motion.path
    d={path}
    stroke="currentColor"
    strokeWidth={1.6}
    strokeLinecap="round"
    strokeLinejoin="round"
    fill="none"
    initial={{ pathLength: 0, opacity: 0 }}
    animate={{ pathLength: [0, 1, 1], opacity: [0, 1, 0] }}
    transition={{ duration: 0.55, delay, repeat: Infinity, repeatDelay: 0.75, ease: "easeOut" }}
  />
);

const UnpluggedPlugAnimation = ({ className = "" }: { className?: string }) => (
  <div className={`relative flex h-full w-full items-center justify-center ${className}`}>
    <svg viewBox="0 0 420 200" className="h-full w-full" role="img" aria-label="Power plug detached from socket emitting electric arcs">
      <defs>
        <linearGradient id="metal" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="hsl(0 0% 92%)" />
          <stop offset="45%" stopColor="hsl(0 0% 70%)" />
          <stop offset="100%" stopColor="hsl(0 0% 45%)" />
        </linearGradient>
        <linearGradient id="plugBody" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="hsl(var(--foreground) / 0.92)" />
          <stop offset="100%" stopColor="hsl(var(--foreground) / 0.65)" />
        </linearGradient>
        <radialGradient id="arcGlow">
          <stop offset="0%" stopColor="hsl(var(--primary) / 0.45)" />
          <stop offset="100%" stopColor="hsl(var(--primary) / 0)" />
        </radialGradient>
      </defs>

      {/* Wall socket (female) */}
      <g>
        <rect x="300" y="52" width="96" height="96" rx="16" fill="hsl(var(--secondary))" stroke="hsl(var(--border))" strokeWidth="2" />
        <rect x="316" y="68" width="64" height="64" rx="10" fill="hsl(var(--background))" stroke="hsl(var(--border))" strokeWidth="1.5" />
        <rect x="332" y="84" width="7" height="20" rx="3" fill="hsl(var(--foreground) / 0.7)" />
        <rect x="357" y="84" width="7" height="20" rx="3" fill="hsl(var(--foreground) / 0.7)" />
        <circle cx="348" cy="118" r="4" fill="hsl(var(--foreground) / 0.5)" />
      </g>

      {/* Plug + cable pulling away */}
      <motion.g
        animate={{ x: [0, -16, -10, -16, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* Cable */}
        <motion.path
          d="M40 150 C 90 178, 150 176, 196 128"
          stroke="hsl(var(--foreground) / 0.8)"
          strokeWidth="9"
          strokeLinecap="round"
          fill="none"
          animate={{ d: [
            "M40 150 C 90 178, 150 176, 196 128",
            "M40 152 C 92 186, 152 170, 196 128",
            "M40 150 C 90 178, 150 176, 196 128",
          ] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Plug body */}
        <rect x="196" y="82" width="72" height="60" rx="14" fill="url(#plugBody)" />
        <rect x="204" y="90" width="56" height="14" rx="7" fill="hsl(var(--background) / 0.25)" />
        {/* Pins */}
        <rect x="268" y="94" width="34" height="9" rx="4.5" fill="url(#metal)" />
        <rect x="268" y="120" width="34" height="9" rx="4.5" fill="url(#metal)" />
      </motion.g>

      {/* Arc glow between pins and socket */}
      <motion.circle
        cx="308" cy="110" r="46" fill="url(#arcGlow)"
        animate={{ opacity: [0.25, 0.75, 0.3, 0.8, 0.25], scale: [0.9, 1.08, 0.95, 1.1, 0.9] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "308px 110px" }}
      />

      {/* Electric arcs leaping off the male pins */}
      <g className="text-primary">
        <Spark delay={0} path="M302 98 l10 -12 l-6 12 l14 -6" />
        <Spark delay={0.25} path="M302 124 l12 10 l-5 -11 l15 5" />
        <Spark delay={0.5} path="M302 110 l16 -3 l-8 8 l14 2" />
        <Spark delay={0.85} path="M300 100 l6 -18 l2 12 l10 -8" />
        <Spark delay={1.1} path="M300 128 l4 16 l4 -11 l11 8" />
      </g>

      {/* Floating energy motes */}
      {[0, 1, 2, 3].map((i) => (
        <motion.circle
          key={i}
          r={2.4}
          cx={300}
          cy={110}
          className="fill-primary"
          animate={{
            cx: [300, 300 + (i % 2 === 0 ? 34 : -30)],
            cy: [110, 110 + (i < 2 ? -38 : 40)],
            opacity: [0, 0.9, 0],
          }}
          transition={{ duration: 1.6, delay: i * 0.4, repeat: Infinity, ease: "easeOut" }}
        />
      ))}
    </svg>
  </div>
);

export default UnpluggedPlugAnimation;

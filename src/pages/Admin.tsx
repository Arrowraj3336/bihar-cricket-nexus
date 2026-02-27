import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { adminApi } from "@/lib/admin-api";
import { TEAM_NAMES } from "@/lib/teams-list";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  Upload, Trophy, Calendar, Star, Trash2, Image, X,
  BarChart3, Users, MapPin, Smartphone,
  TrendingUp, Eye, Globe, Shield, ScanLine, Bell,
} from "lucide-react";
import { CricketBall, CricketBat, CricketStumps } from "@/components/CricketDecorations";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, ResponsiveContainer } from "recharts";

/* ── Holographic Particle ── */
const HoloParticle = ({ delay, x, y }: { delay: number; x: number; y: number }) => (
  <motion.div
    className="absolute w-1 h-1 rounded-full"
    style={{ left: `${x}%`, top: `${y}%`, background: "hsl(0, 85%, 50%)", boxShadow: "0 0 6px hsl(0, 85%, 40%)" }}
    initial={{ opacity: 0, scale: 0 }}
    animate={{ opacity: [0, 0.8, 0], scale: [0, 1.5, 0], y: [0, -30, -60] }}
    transition={{ delay, duration: 2.5, repeat: Infinity, ease: "easeOut" }}
  />
);

/* ── Glitch Text ── */
const GlitchText = ({ text, className = "" }: { text: string; className?: string }) => (
  <div className={`relative inline-block ${className}`}>
    <span className="relative z-10">{text}</span>
    <motion.span
      className="absolute inset-0 z-20"
      style={{ color: "hsl(0, 100%, 40%)", clipPath: "inset(0 0 60% 0)" }}
      animate={{ x: [0, -3, 2, 0], opacity: [1, 0.7, 1] }}
      transition={{ duration: 0.15, repeat: Infinity, repeatDelay: 2.5 }}
    >
      {text}
    </motion.span>
    <motion.span
      className="absolute inset-0 z-20"
      style={{ color: "hsl(350, 80%, 35%)", clipPath: "inset(60% 0 0 0)" }}
      animate={{ x: [0, 3, -2, 0], opacity: [1, 0.5, 1] }}
      transition={{ duration: 0.12, repeat: Infinity, repeatDelay: 3 }}
    >
      {text}
    </motion.span>
  </div>
);

/* ── Arc SVG helper ── */
function describeArc(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
  const s = polarToCart(cx, cy, r, endAngle);
  const e = polarToCart(cx, cy, r, startAngle);
  const large = endAngle - startAngle <= 180 ? "0" : "1";
  return `M ${s.x} ${s.y} A ${r} ${r} 0 ${large} 0 ${e.x} ${e.y}`;
}
function polarToCart(cx: number, cy: number, r: number, angle: number) {
  const rad = ((angle - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

/* ── Audio helpers ── */
const playBeep = (freq: number, duration: number, volume = 0.08) => {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = freq;
    gain.gain.value = volume;
    osc.connect(gain);
    gain.connect(ctx.destination);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch {}
};

const playBootSequence = () => {
  playBeep(440, 0.15, 0.06);
  setTimeout(() => playBeep(587, 0.12, 0.05), 300);
  setTimeout(() => playBeep(880, 0.2, 0.07), 800);
  setTimeout(() => playBeep(1174, 0.15, 0.05), 1600);
  setTimeout(() => playBeep(1760, 0.3, 0.04), 2800);
  // Low hum
  setTimeout(() => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.value = 60;
      gain.gain.value = 0.02;
      osc.connect(gain);
      gain.connect(ctx.destination);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2);
      osc.start();
      osc.stop(ctx.currentTime + 2);
    } catch {}
  }, 200);
};

/* ── JARVIS Boot Screen ── */
const JarvisBootScreen = () => {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    playBootSequence();
    const timers = [
      setTimeout(() => setPhase(1), 300),
      setTimeout(() => setPhase(2), 1000),
      setTimeout(() => setPhase(3), 2000),
      setTimeout(() => setPhase(4), 3200),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  const particles = useMemo(
    () => Array.from({ length: 40 }, (_, i) => ({ id: i, x: Math.random() * 100, y: Math.random() * 100, delay: Math.random() * 3 })),
    []
  );

  const dataLines = [
    "SYS.KERNEL >> BOOTING CORE v4.2.1...",
    "NEURAL_LINK >> HANDSHAKE ESTABLISHED",
    "FIREWALL >> PERIMETER SECURED",
    "HUD_ENGINE >> RENDERING OVERLAY...",
    "BIOMETRICS >> IDENTITY CONFIRMED",
    "QUANTUM_NET >> SYNC COMPLETE",
  ];

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center overflow-hidden"
      style={{ background: "linear-gradient(135deg, #0a0000 0%, #120505 40%, #0d0208 100%)" }}
    >
      {/* Grid overlay */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `linear-gradient(hsl(0,85%,30%,0.4) 1px, transparent 1px), linear-gradient(90deg, hsl(0,85%,30%,0.4) 1px, transparent 1px)`,
        backgroundSize: "50px 50px",
      }} />

      {/* Scan line */}
      <motion.div
        className="absolute left-0 right-0 h-[1px]"
        style={{ background: "linear-gradient(90deg, transparent, hsl(0,85%,40%,0.5), transparent)" }}
        animate={{ top: ["0%", "100%", "0%"] }}
        transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
      />

      {/* Holographic particles */}
      {particles.map((p) => (
        <HoloParticle key={p.id} delay={p.delay} x={p.x} y={p.y} />
      ))}

      {/* Corner brackets */}
      {[
        "top-3 left-3 border-t-2 border-l-2",
        "top-3 right-3 border-t-2 border-r-2",
        "bottom-3 left-3 border-b-2 border-l-2",
        "bottom-3 right-3 border-b-2 border-r-2",
      ].map((pos, i) => (
        <motion.div
          key={i}
          className={`absolute w-6 h-6 ${pos}`}
          style={{ borderColor: "hsl(0,85%,30%,0.4)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 + i * 0.08 }}
        />
      ))}

      {/* Left data stream */}
      <div className="absolute left-4 top-12 space-y-1">
        {dataLines.map((line, i) => (
          <motion.p
            key={i}
            className="text-[8px] font-mono tracking-wider"
            style={{ color: "hsl(0,85%,40%,0.45)" }}
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: phase >= 1 ? 1 : 0, x: phase >= 1 ? 0 : -15 }}
            transition={{ delay: i * 0.12, duration: 0.25 }}
          >
            {line}
          </motion.p>
        ))}
      </div>

      {/* Right status dots */}
      <div className="absolute right-4 top-12 space-y-2">
        {["CORE", "AUTH", "HUD", "NET"].map((label, i) => (
          <motion.div key={i} className="flex items-center gap-2"
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: phase >= 2 ? 1 : 0, x: phase >= 2 ? 0 : 15 }}
            transition={{ delay: i * 0.1 }}
          >
            <span className="text-[8px] font-mono tracking-[0.2em]" style={{ color: "hsl(0,70%,45%,0.5)" }}>{label}</span>
            <motion.div
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: phase >= 3 ? "hsl(0,85%,45%)" : "hsl(0,50%,30%,0.3)" }}
              animate={phase >= 3 ? { boxShadow: ["0 0 4px hsl(0,85%,45%)", "0 0 14px hsl(0,85%,50%)", "0 0 4px hsl(0,85%,45%)"] } : {}}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </motion.div>
        ))}
      </div>

      {/* Center HUD */}
      <div className="relative flex items-center justify-center w-64 h-64 md:w-72 md:h-72">
        {/* Outer rotating ring */}
        <motion.div
          className="absolute w-56 h-56 md:w-64 md:h-64 rounded-full"
          style={{ border: "1px solid hsl(0,85%,30%,0.2)" }}
          animate={{ rotate: 360 }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        >
          {[0, 60, 120, 180, 240, 300].map((deg) => (
            <div key={deg} className="absolute w-1.5 h-1.5 rounded-full"
              style={{
                background: "hsl(0,85%,45%,0.7)",
                boxShadow: "0 0 8px hsl(0,85%,40%,0.5)",
                top: "50%", left: "50%",
                transform: `rotate(${deg}deg) translateY(-${window.innerWidth < 768 ? 112 : 128}px) translate(-50%,-50%)`,
              }}
            />
          ))}
        </motion.div>

        {/* Inner arc segments */}
        <motion.svg className="absolute w-44 h-44 md:w-48 md:h-48" viewBox="0 0 100 100"
          animate={{ rotate: -360 }}
          transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
        >
          {[0, 90, 180, 270].map((a) => (
            <path key={a} d={describeArc(50, 50, 42, a, a + 60)} fill="none" stroke="hsl(0,85%,35%,0.3)" strokeWidth="1.5" strokeLinecap="round" />
          ))}
        </motion.svg>

        {/* Middle dashed ring */}
        <motion.div
          className="absolute w-36 h-36 md:w-40 md:h-40 rounded-full"
          style={{ border: "1px dashed hsl(0,60%,30%,0.15)" }}
          animate={{ rotate: 360 }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        />

        {/* Core glow pulse */}
        <motion.div
          className="absolute w-24 h-24 rounded-full"
          style={{ background: "radial-gradient(circle, hsl(0,85%,35%,0.12) 0%, transparent 70%)" }}
          animate={{ scale: [1, 1.4, 1], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Center icon */}
        <motion.div
          className="relative z-10 w-16 h-16 rounded-full flex items-center justify-center"
          style={{
            background: "radial-gradient(circle, hsl(0,85%,30%,0.15) 0%, transparent 70%)",
            boxShadow: "0 0 30px hsl(0,85%,30%,0.2), inset 0 0 15px hsl(0,85%,30%,0.08)",
          }}
          animate={{ boxShadow: ["0 0 25px hsl(0,85%,30%,0.15)", "0 0 50px hsl(0,85%,30%,0.35)", "0 0 25px hsl(0,85%,30%,0.15)"] }}
          transition={{ duration: 2, repeat: Infinity }}
          initial={{ opacity: 0, scale: 0.5 }}
          whileInView={{ opacity: 1, scale: 1 }}
        >
          <ScanLine size={28} style={{ color: "hsl(0,85%,50%)" }} />
        </motion.div>
      </div>

      {/* Greeting with glitch */}
      <motion.div
        className="mt-5"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: phase >= 1 ? 1 : 0, y: phase >= 1 ? 0 : 15 }}
        transition={{ duration: 0.4 }}
      >
        <GlitchText
          text="Hello, Raaz"
          className="text-2xl md:text-3xl font-heading font-bold tracking-[0.12em] uppercase"
          // Styles applied via inline in GlitchText's parent span color
        />
      </motion.div>

      {/* JARVIS Initializing */}
      <motion.div className="mt-4 flex flex-col items-center gap-2">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: phase >= 2 ? 1 : 0 }}
        >
          <GlitchText
            text="J.A.R.V.I.S — INITIALIZING"
            className="text-[10px] font-mono tracking-[0.4em] uppercase"
          />
        </motion.div>

        {/* Progress bar */}
        <motion.div
          className="w-52 h-[2px] rounded-full overflow-hidden mt-1"
          style={{ background: "hsl(0,85%,30%,0.15)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: phase >= 2 ? 1 : 0 }}
        >
          <motion.div
            className="h-full rounded-full"
            style={{ background: "linear-gradient(90deg, hsl(0,85%,40%), hsl(350,70%,35%))" }}
            initial={{ width: "0%" }}
            animate={{ width: phase >= 2 ? "100%" : "0%" }}
            transition={{ duration: 2.2, ease: "easeInOut" }}
          />
        </motion.div>

        <motion.p
          className="text-[9px] font-mono tracking-wider"
          style={{ color: "hsl(0,85%,50%,0.7)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: phase >= 4 ? 1 : 0 }}
        >
          ● ACCESS GRANTED — ALL SYSTEMS ONLINE
        </motion.p>
      </motion.div>

      {/* Bottom bar */}
      <motion.div
        className="absolute bottom-4 left-4 right-4 flex justify-between items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: phase >= 1 ? 1 : 0 }}
      >
        <p className="text-[7px] font-mono" style={{ color: "hsl(0,60%,40%,0.3)" }}>BRL.SYS.v4.2.1</p>
        <p className="text-[7px] font-mono" style={{ color: "hsl(0,60%,40%,0.3)" }}>BIHAR RURAL LEAGUE — SECURE ACCESS</p>
        <motion.p className="text-[7px] font-mono" style={{ color: "hsl(0,85%,45%,0.4)" }}
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          ● LIVE
        </motion.p>
      </motion.div>

      {/* Global text color for glitch children */}
      <style>{`
        .relative.inline-block > span:first-child {
          color: hsl(0, 85%, 50%);
        }
      `}</style>
    </div>
  );
};

const PIN_LENGTH = 4;

const PHONE_LETTERS: Record<string, string> = {
  "2": "ABC", "3": "DEF", "4": "GHI", "5": "JKL",
  "6": "MNO", "7": "PQRS", "8": "TUV", "9": "WXYZ",
};

const PinKeypad = ({ onComplete, error, isLoading }: { onComplete: (pin: string) => void; error: string; isLoading: boolean }) => {
  const [pin, setPin] = useState<string>("");

  const handleDigit = (digit: string) => {
    if (pin.length >= PIN_LENGTH || isLoading) return;
    playBeep(800 + parseInt(digit) * 80, 0.08, 0.04);
    const newPin = pin + digit;
    setPin(newPin);
    if (newPin.length === PIN_LENGTH) {
      onComplete(newPin);
    }
  };

  const handleDelete = () => {
    setPin((prev) => prev.slice(0, -1));
  };

  useEffect(() => {
    if (error) setPin("");
  }, [error]);

  return (
    <div className="flex flex-col items-center gap-8">
      {/* PIN Dots */}
      <div className="flex gap-5">
        {Array.from({ length: PIN_LENGTH }).map((_, i) => (
          <div
            key={i}
            className={`w-3.5 h-3.5 rounded-full transition-all duration-300 ${
              i < pin.length
                ? "bg-background scale-125"
                : "border-2 border-background/30"
            } ${error && pin.length === 0 ? "border-destructive animate-shake" : ""}`}
          />
        ))}
      </div>

      {error && (
        <p className="text-xs text-destructive font-display animate-pulse -mt-4" role="alert">{error}</p>
      )}

      {/* Mobile-style Numeric Keypad */}
      <div className="grid grid-cols-3 gap-x-6 gap-y-4">
        {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((digit) => (
          <button
            key={digit}
            type="button"
            disabled={isLoading}
            onClick={() => handleDigit(digit)}
            className="w-[76px] h-[76px] rounded-full bg-background/[0.08] backdrop-blur-sm flex flex-col items-center justify-center hover:bg-background/[0.16] active:bg-background/25 active:scale-[0.93] transition-all duration-150 disabled:opacity-40 select-none"
          >
            <span className="text-[28px] font-light text-background leading-none">{digit}</span>
            {PHONE_LETTERS[digit] && (
              <span className="text-[9px] font-semibold tracking-[0.18em] text-background/50 mt-0.5 uppercase">{PHONE_LETTERS[digit]}</span>
            )}
          </button>
        ))}
        <div /> {/* empty cell */}
        <button
          type="button"
          disabled={isLoading}
          onClick={() => handleDigit("0")}
          className="w-[76px] h-[76px] rounded-full bg-background/[0.08] backdrop-blur-sm flex flex-col items-center justify-center hover:bg-background/[0.16] active:bg-background/25 active:scale-[0.93] transition-all duration-150 disabled:opacity-40 select-none"
        >
          <span className="text-[28px] font-light text-background leading-none">0</span>
        </button>
        <button
          type="button"
          disabled={isLoading || pin.length === 0}
          onClick={handleDelete}
          className="w-[76px] h-[76px] rounded-full flex items-center justify-center hover:bg-background/[0.08] active:scale-[0.93] transition-all duration-150 disabled:opacity-30 select-none"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-background"><path d="M9 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"/><path d="M3 12l5-7h12a1 1 0 011 1v12a1 1 0 01-1 1H8l-5-7z"/></svg>
        </button>
      </div>

      {isLoading && (
        <p className="text-xs text-background/40 font-display animate-pulse">Verifying...</p>
      )}
    </div>
  );
};

const AdminPanel = () => {
  const [pin, setPin] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [showBootSequence, setShowBootSequence] = useState(false);
  const bootTimeoutRef = useRef<number | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    return () => {
      if (bootTimeoutRef.current !== null) {
        window.clearTimeout(bootTimeoutRef.current);
      }
    };
  }, []);

  const handlePinComplete = async (enteredPin: string) => {
    if (isAuthenticating) return;
    setIsAuthenticating(true);
    setLoginError("");

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
      const res = await fetch(
        `${SUPABASE_URL}/functions/v1/admin-api?action=verify-auth`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-admin-password": enteredPin,
          },
          signal: controller.signal,
        }
      );
      clearTimeout(timeoutId);

      if (res.status === 401) {
        setLoginError("Wrong PIN. Try again.");
        setIsAuthenticating(false);
        return;
      }

      if (!res.ok) {
        setLoginError("Server error. Please retry.");
        setIsAuthenticating(false);
        return;
      }

      setPin(enteredPin);
      setShowBootSequence(true);
      setIsAuthenticating(false);

      bootTimeoutRef.current = window.setTimeout(() => {
        setAuthenticated(true);
        setShowBootSequence(false);
      }, 4500);
    } catch (err: any) {
      setIsAuthenticating(false);
      if (err?.name === "AbortError") {
        setLoginError("Timed out. Check your connection.");
      } else {
        setLoginError("Network error. Please retry.");
      }
    }
  };

  if (showBootSequence && !authenticated) {
    return <JarvisBootScreen />;
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-foreground flex flex-col items-center justify-between py-12 px-4 relative overflow-hidden select-none">
        {/* Subtle radial glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--primary)/0.15),transparent_60%)]" />

        {/* Top section: time-like header */}
        <div className="relative z-10 flex flex-col items-center gap-1 mt-4">
          <div className="w-16 h-16 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center mb-3">
            <Shield size={28} className="text-primary-foreground/90" />
          </div>
          <h1 className="font-heading text-2xl font-bold text-background tracking-wide">BRL Admin</h1>
          <p className="text-xs text-background/50 font-display tracking-wider">Enter Passcode</p>
        </div>

        {/* Center: PIN + Keypad */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center -mt-4">
          <PinKeypad onComplete={handlePinComplete} error={loginError} isLoading={isAuthenticating} />
        </div>

        {/* Bottom hint */}
        <p className="relative z-10 text-[10px] text-background/25 font-display tracking-widest uppercase">Secured Access</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative">
      <CricketBall className="fixed top-20 right-10 w-60 h-60 text-primary opacity-[0.02] pointer-events-none" />
      <CricketBat className="fixed bottom-20 left-5 w-8 h-28 text-accent opacity-[0.03] pointer-events-none rotate-12" />

      {/* Header */}
      <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container max-w-5xl flex items-center justify-between py-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-accent flex items-center justify-center">
              <Shield size={16} className="text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-heading text-lg font-bold leading-none">BRL Admin</h1>
              <p className="text-[10px] text-muted-foreground font-display">Management Dashboard</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (bootTimeoutRef.current !== null) {
                window.clearTimeout(bootTimeoutRef.current);
                bootTimeoutRef.current = null;
              }
              setAuthenticated(false);
              setShowBootSequence(false);
              setLoginError("");
              setPin("");
            }}
            className="font-display text-xs"
          >
            Logout
          </Button>
        </div>
      </div>

      <div className="container py-6 space-y-6 max-w-5xl">
        <AnalyticsDashboard password={pin} toast={toast} />
        <GalleryManager password={pin} toast={toast} />
        <PointsTableManager password={pin} toast={toast} />
        <MatchesManager password={pin} toast={toast} />
        <PerformersManager password={pin} toast={toast} />
        <AlertsManager password={pin} toast={toast} />
      </div>
    </div>
  );
};

// ── Section Wrapper ──
const AdminSection = ({ icon: Icon, title, subtitle, children, accentColor = "text-primary" }: {
  icon: any; title: string; subtitle: string; children: React.ReactNode; accentColor?: string;
}) => (
  <section className="relative rounded-2xl overflow-hidden border border-border shadow-card">
    <div className="h-1 w-full bg-gradient-to-r from-primary via-accent to-primary" />
    <div className="p-5 md:p-6 space-y-4 bg-gradient-card">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center border border-border/50">
          <Icon size={18} className={accentColor} />
        </div>
        <div>
          <h2 className="font-heading text-lg font-bold leading-tight">{title}</h2>
          <p className="text-[11px] text-muted-foreground font-display">{subtitle}</p>
        </div>
      </div>
      {children}
    </div>
  </section>
);

// ── Analytics Dashboard ──
const CHART_COLORS = [
  "hsl(0, 85%, 30%)", "hsl(350, 70%, 25%)", "hsl(45, 100%, 42%)",
  "hsl(25, 100%, 50%)", "hsl(140, 60%, 35%)", "hsl(200, 70%, 45%)",
  "hsl(280, 60%, 45%)", "hsl(30, 80%, 55%)",
];

const AnalyticsDashboard = ({ password, toast }: { password: string; toast: any }) => {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await adminApi("get-analytics", password);
        if (res.data) setLogs(res.data);
      } catch (err: any) {
        toast({ title: "Analytics Error", description: err.message, variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [password]);

  const stats = useMemo(() => {
    if (!logs.length) return null;

    const today = new Date().toDateString();
    const todayCount = logs.filter((l) => new Date(l.created_at).toDateString() === today).length;

    // State distribution
    const stateMap: Record<string, number> = {};
    logs.forEach((l) => { stateMap[l.state || "Unknown"] = (stateMap[l.state || "Unknown"] || 0) + 1; });
    const stateData = Object.entries(stateMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([name, value]) => ({ name, value }));

    // Device distribution
    const deviceMap: Record<string, number> = {};
    logs.forEach((l) => { deviceMap[l.device_type || "unknown"] = (deviceMap[l.device_type || "unknown"] || 0) + 1; });
    const deviceData = Object.entries(deviceMap).map(([name, value]) => ({ name, value }));

    // Daily visits (last 7 days)
    const dailyMap: Record<string, number> = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      dailyMap[key] = 0;
    }
    logs.forEach((l) => {
      const d = new Date(l.created_at);
      const key = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      if (key in dailyMap) dailyMap[key]++;
    });
    const dailyData = Object.entries(dailyMap).map(([name, visits]) => ({ name, visits }));

    // Country distribution
    const countryMap: Record<string, number> = {};
    logs.forEach((l) => { countryMap[l.country || "Unknown"] = (countryMap[l.country || "Unknown"] || 0) + 1; });
    const countryData = Object.entries(countryMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, value]) => ({ name, value }));

    return { total: logs.length, today: todayCount, stateData, deviceData, dailyData, countryData };
  }, [logs]);

  const chartConfig = {
    visits: { label: "Visits", color: "hsl(0, 85%, 30%)" },
    value: { label: "Visitors", color: "hsl(350, 70%, 25%)" },
  };

  return (
    <AdminSection icon={BarChart3} title="Visitor Analytics" subtitle="Real-time visitor tracking & insights" accentColor="text-cricket-gold">
      {loading ? (
        <div className="text-center py-10 text-muted-foreground font-display text-sm">Loading analytics...</div>
      ) : !stats ? (
        <div className="text-center py-10 text-muted-foreground font-display text-sm">No visitor data yet. Data will appear as users visit your site.</div>
      ) : (
        <>
          {/* Stat Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: "Total Visitors", value: stats.total, icon: Users, color: "text-primary" },
              { label: "Today", value: stats.today, icon: Eye, color: "text-cricket-gold" },
              { label: "States", value: stats.stateData.length, icon: MapPin, color: "text-cricket-green" },
              { label: "Countries", value: stats.countryData.length, icon: Globe, color: "text-accent" },
            ].map((s) => (
              <div key={s.label} className="bg-secondary/50 rounded-xl border border-border/50 p-3 flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-background flex items-center justify-center border border-border/50">
                  <s.icon size={16} className={s.color} />
                </div>
                <div>
                  <p className="font-heading text-xl font-bold leading-none">{s.value}</p>
                  <p className="text-[10px] text-muted-foreground font-display mt-0.5">{s.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Daily Visits Line Chart */}
            <div className="bg-secondary/30 rounded-xl border border-border/50 p-4">
              <h3 className="font-heading text-sm font-bold mb-3 flex items-center gap-2">
                <TrendingUp size={14} className="text-primary" /> Daily Visits (7 Days)
              </h3>
              <ChartContainer config={chartConfig} className="h-[200px] w-full">
                <LineChart data={stats.dailyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(0, 10%, 88%)" />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line type="monotone" dataKey="visits" stroke="hsl(0, 85%, 30%)" strokeWidth={2} dot={{ fill: "hsl(0, 85%, 30%)", r: 3 }} />
                </LineChart>
              </ChartContainer>
            </div>

            {/* State Distribution Bar Chart */}
            <div className="bg-secondary/30 rounded-xl border border-border/50 p-4">
              <h3 className="font-heading text-sm font-bold mb-3 flex items-center gap-2">
                <MapPin size={14} className="text-cricket-green" /> Visitors by State
              </h3>
              <ChartContainer config={chartConfig} className="h-[200px] w-full">
                <BarChart data={stats.stateData} layout="vertical">
                  <XAxis type="number" tick={{ fontSize: 10 }} />
                  <YAxis dataKey="name" type="category" tick={{ fontSize: 9 }} width={80} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="value" fill="hsl(350, 70%, 25%)" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ChartContainer>
            </div>

            {/* Device Distribution Pie */}
            <div className="bg-secondary/30 rounded-xl border border-border/50 p-4">
              <h3 className="font-heading text-sm font-bold mb-3 flex items-center gap-2">
                <Smartphone size={14} className="text-accent" /> Device Types
              </h3>
              <div className="h-[200px] flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={stats.deviceData} cx="50%" cy="50%" outerRadius={70} innerRadius={40} paddingAngle={3} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                      {stats.deviceData.map((_, i) => (
                        <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Country Distribution */}
            <div className="bg-secondary/30 rounded-xl border border-border/50 p-4">
              <h3 className="font-heading text-sm font-bold mb-3 flex items-center gap-2">
                <Globe size={14} className="text-cricket-gold" /> Top Countries
              </h3>
              <ChartContainer config={chartConfig} className="h-[200px] w-full">
                <BarChart data={stats.countryData}>
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {stats.countryData.map((_, i) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ChartContainer>
            </div>
          </div>
        </>
      )}
    </AdminSection>
  );
};



const GalleryManager = ({ password, toast }: { password: string; toast: any }) => {
  const [files, setFiles] = useState<FileList | null>(null);
  const [showOnHomepage, setShowOnHomepage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<any[]>([]);

  const loadImages = async () => {
    const { data } = await supabase.from("gallery_images").select("*").order("created_at", { ascending: false });
    if (data) setImages(data);
  };

  useEffect(() => { loadImages(); }, []);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!files || files.length === 0) return;
    setLoading(true);
    try {
      for (let i = 0; i < files.length; i++) {
        const formData = new FormData();
        formData.append("file", files[i]);
        formData.append("alt_text", files[i].name.replace(/\.[^.]+$/, ""));
        formData.append("show_on_homepage", showOnHomepage ? "true" : "false");
        await adminApi("upload-gallery", password, formData);
      }
      toast({ title: "Uploaded!", description: `${files.length} image(s) uploaded.` });
      setFiles(null);
      loadImages();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, image_url: string) => {
    try {
      await adminApi("delete-gallery", password, { id, image_url });
      toast({ title: "Deleted!" });
      loadImages();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  return (
    <AdminSection icon={Image} title="Gallery Photos" subtitle="Upload & manage tournament photos" accentColor="text-primary">
      <form onSubmit={handleUpload} className="space-y-3">
        <div className="border-2 border-dashed border-border rounded-xl p-6 text-center bg-secondary/20">
          <Upload size={28} className="mx-auto text-muted-foreground mb-2" />
          <p className="text-xs text-muted-foreground mb-2 font-display">Drop or select images to upload</p>
          <Input type="file" accept="image/*" multiple onChange={(e) => setFiles(e.target.files)} className="max-w-xs mx-auto" />
        </div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={showOnHomepage} onChange={(e) => setShowOnHomepage(e.target.checked)} className="rounded" />
          <span className="text-sm font-display">Show on homepage (max 7)</span>
        </label>
        <Button type="submit" disabled={loading || !files} className="w-full bg-gradient-accent shadow-glow font-heading uppercase tracking-wider text-sm">
          {loading ? "Uploading..." : "Upload Photos"}
        </Button>
      </form>

      {images.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 mt-4">
          {images.map((img) => (
            <div key={img.id} className="relative group rounded-lg overflow-hidden border border-border/50">
              <img src={img.image_url} alt={img.alt_text} className="w-full h-20 object-cover" />
              <button onClick={() => handleDelete(img.id, img.image_url)} className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <X size={10} />
              </button>
              {img.show_on_homepage && (
                <span className="absolute bottom-0.5 left-0.5 bg-primary text-primary-foreground text-[7px] px-1 rounded font-display">HP</span>
              )}
            </div>
          ))}
        </div>
      )}
    </AdminSection>
  );
};

// ── Points Table Manager ──
const PointsTableManager = ({ password, toast }: { password: string; toast: any }) => {
  const [team, setTeam] = useState("");
  const [played, setPlayed] = useState("");
  const [won, setWon] = useState("");
  const [lost, setLost] = useState("");
  const [points, setPoints] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!team) return;
    setLoading(true);
    try {
      await adminApi("upsert-points", password, {
        team_name: team, played: parseInt(played) || 0, won: parseInt(won) || 0,
        lost: parseInt(lost) || 0, points: parseInt(points) || 0,
      });
      toast({ title: "Updated!", description: `${team} points updated.` });
      setPlayed(""); setWon(""); setLost(""); setPoints(""); setTeam("");
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminSection icon={Trophy} title="Points Table" subtitle="Update team standings & points" accentColor="text-cricket-gold">
      <form onSubmit={handleSubmit} className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="col-span-2 sm:col-span-3">
          <Label className="text-xs font-display font-semibold uppercase tracking-wider text-muted-foreground">Team</Label>
          <Select value={team} onValueChange={setTeam}>
            <SelectTrigger className="mt-1"><SelectValue placeholder="Select team" /></SelectTrigger>
            <SelectContent>{TEAM_NAMES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        {[
          { label: "Played", value: played, set: setPlayed },
          { label: "Won", value: won, set: setWon },
          { label: "Lost", value: lost, set: setLost },
          { label: "Points", value: points, set: setPoints },
        ].map((f) => (
          <div key={f.label}>
            <Label className="text-xs font-display font-semibold uppercase tracking-wider text-muted-foreground">{f.label}</Label>
            <Input type="number" value={f.value} onChange={(e) => f.set(e.target.value)} placeholder="0" className="mt-1" />
          </div>
        ))}
        <div className="col-span-2 sm:col-span-3">
          <Button type="submit" disabled={loading || !team} className="w-full bg-gradient-accent shadow-glow font-heading uppercase tracking-wider text-sm">
            {loading ? "Updating..." : "Update Points"}
          </Button>
        </div>
      </form>
    </AdminSection>
  );
};

// ── Matches Manager ──
const MatchesManager = ({ password, toast }: { password: string; toast: any }) => {
  const [team1, setTeam1] = useState("");
  const [team2, setTeam2] = useState("");
  const [matchDate, setMatchDate] = useState("");
  const [matchTime, setMatchTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [matches, setMatches] = useState<any[]>([]);

  const loadMatches = async () => {
    const { data } = await supabase.from("upcoming_matches").select("*").order("match_date", { ascending: true });
    if (data) setMatches(data);
  };

  useEffect(() => { loadMatches(); }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!team1 || !team2 || !matchDate || !matchTime) return;
    setLoading(true);
    try {
      await adminApi("add-match", password, { team1, team2, match_date: matchDate, match_time: matchTime });
      toast({ title: "Match added!" });
      setTeam1(""); setTeam2(""); setMatchDate(""); setMatchTime("");
      loadMatches();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (id: string) => {
    try {
      await adminApi("delete-match", password, { id });
      toast({ title: "Match removed!" });
      loadMatches();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  return (
    <AdminSection icon={Calendar} title="Upcoming Matches" subtitle="Schedule & manage match fixtures" accentColor="text-accent">
      <form onSubmit={handleAdd} className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-xs font-display font-semibold uppercase tracking-wider text-muted-foreground">Team 1</Label>
          <Select value={team1} onValueChange={setTeam1}>
            <SelectTrigger className="mt-1"><SelectValue placeholder="Select team" /></SelectTrigger>
            <SelectContent>{TEAM_NAMES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs font-display font-semibold uppercase tracking-wider text-muted-foreground">Team 2</Label>
          <Select value={team2} onValueChange={setTeam2}>
            <SelectTrigger className="mt-1"><SelectValue placeholder="Select team" /></SelectTrigger>
            <SelectContent>{TEAM_NAMES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs font-display font-semibold uppercase tracking-wider text-muted-foreground">Date</Label>
          <Input type="date" value={matchDate} onChange={(e) => setMatchDate(e.target.value)} className="mt-1" />
        </div>
        <div>
          <Label className="text-xs font-display font-semibold uppercase tracking-wider text-muted-foreground">Time</Label>
          <Input type="time" value={matchTime} onChange={(e) => setMatchTime(e.target.value)} className="mt-1" />
        </div>
        <div className="col-span-2 text-[10px] text-muted-foreground font-display flex items-center gap-1">
          <MapPin size={10} /> Venue: Nagendrajha Stadium (auto)
        </div>
        <div className="col-span-2">
          <Button type="submit" disabled={loading || !team1 || !team2 || !matchDate || !matchTime} className="w-full bg-gradient-accent shadow-glow font-heading uppercase tracking-wider text-sm">
            {loading ? "Adding..." : "Add Match"}
          </Button>
        </div>
      </form>

      {matches.length > 0 && (
        <div className="space-y-2 mt-4">
          <h3 className="font-heading text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
            <Calendar size={12} /> Scheduled Matches
          </h3>
          {matches.map((m) => (
            <div key={m.id} className="flex items-center justify-between bg-secondary/50 rounded-xl px-4 py-2.5 border border-border/50">
              <div className="text-sm font-display">
                <span className="font-semibold">{m.team1}</span>
                <span className="text-muted-foreground mx-1.5 text-xs">vs</span>
                <span className="font-semibold">{m.team2}</span>
                <span className="text-muted-foreground ml-2 text-[10px]">{m.match_date} • {m.match_time}</span>
              </div>
              <Button variant="destructive" size="sm" onClick={() => handleRemove(m.id)}>
                <Trash2 size={12} />
              </Button>
            </div>
          ))}
        </div>
      )}
    </AdminSection>
  );
};

// ── Performers Manager ──
const PerformersManager = ({ password, toast }: { password: string; toast: any }) => {
  const [category, setCategory] = useState<string>("orange");
  const [name, setName] = useState("");
  const [team, setTeam] = useState("");
  const [statValue, setStatValue] = useState("");
  const [matchesPlayed, setMatchesPlayed] = useState("");
  const [detail1, setDetail1] = useState("");
  const [detail2, setDetail2] = useState("");
  const [detail3, setDetail3] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const catConfig: Record<string, { statLabel: string; fields: { label: string; placeholder: string }[] }> = {
    orange: {
      statLabel: "Total Runs",
      fields: [
        { label: "Highest Score", placeholder: "e.g. 89*" },
        { label: "Average", placeholder: "e.g. 54.11" },
        { label: "Strike Rate", placeholder: "e.g. 148.3" },
      ],
    },
    purple: {
      statLabel: "Total Wickets",
      fields: [
        { label: "Best Bowling", placeholder: "e.g. 4/22" },
        { label: "Average", placeholder: "e.g. 14.2" },
        { label: "Economy", placeholder: "e.g. 6.8" },
      ],
    },
    mvp: {
      statLabel: "MVP Points",
      fields: [
        { label: "Runs Scored", placeholder: "e.g. 487" },
        { label: "Wickets Taken", placeholder: "e.g. 5" },
        { label: "Man of Match", placeholder: "e.g. 4" },
      ],
    },
  };

  const config = catConfig[category];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !team) return;
    setLoading(true);
    try {
      let photoUrl = null;
      if (photo) {
        const formData = new FormData();
        formData.append("file", photo);
        const uploadRes = await adminApi("upload-performer-photo", password, formData);
        photoUrl = uploadRes.url;
      }
      const sv = parseInt(statValue) || 0;
      const statLabel = category === "purple" ? "Wickets" : category === "mvp" ? "Points" : "Runs";

      await adminApi("upsert-performer", password, {
        category, name, team,
        runs: category === "mvp" ? (parseInt(detail1) || 0) : sv,
        wickets: category === "mvp" ? (parseInt(detail2) || 0) : 0,
        matches_played: parseInt(matchesPlayed) || 0,
        matches_won: 0,
        photo_url: photoUrl, stat_value: sv, stat_label: statLabel,
      });
      toast({ title: "Updated!", description: `${category} cap performer updated.` });
      setName(""); setTeam(""); setStatValue(""); setMatchesPlayed("");
      setDetail1(""); setDetail2(""); setDetail3(""); setPhoto(null);
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminSection icon={Star} title="Top Performers" subtitle="Manage Orange Cap, Purple Cap & MVP" accentColor="text-cricket-orange">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label className="text-xs font-display font-semibold uppercase tracking-wider text-muted-foreground">Category</Label>
          <Select value={category} onValueChange={(v) => { setCategory(v); setDetail1(""); setDetail2(""); setDetail3(""); }}>
            <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="orange">🟠 Orange Cap (Most Runs)</SelectItem>
              <SelectItem value="purple">🟣 Purple Cap (Most Wickets)</SelectItem>
              <SelectItem value="mvp">⭐ Most Valuable Player</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-xs font-display font-semibold uppercase tracking-wider text-muted-foreground">Player Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Player name" className="mt-1" />
          </div>
          <div>
            <Label className="text-xs font-display font-semibold uppercase tracking-wider text-muted-foreground">Team</Label>
            <Select value={team} onValueChange={setTeam}>
              <SelectTrigger className="mt-1"><SelectValue placeholder="Select team" /></SelectTrigger>
              <SelectContent>{TEAM_NAMES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>

        {/* Primary stat + matches */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-xs font-display font-semibold uppercase tracking-wider text-muted-foreground">{config.statLabel}</Label>
            <Input type="number" value={statValue} onChange={(e) => setStatValue(e.target.value)} placeholder="0" className="mt-1" />
          </div>
          <div>
            <Label className="text-xs font-display font-semibold uppercase tracking-wider text-muted-foreground">Matches Played</Label>
            <Input type="number" value={matchesPlayed} onChange={(e) => setMatchesPlayed(e.target.value)} placeholder="0" className="mt-1" />
          </div>
        </div>

        {/* Category-specific detail fields */}
        <div className="bg-secondary/30 rounded-xl border border-border/50 p-4 space-y-3">
          <h4 className="font-heading text-xs font-bold text-muted-foreground uppercase tracking-widest">
            {category === "orange" ? "🟠" : category === "purple" ? "🟣" : "⭐"} Additional Stats
          </h4>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label className="text-[10px] font-display font-semibold uppercase tracking-wider text-muted-foreground">{config.fields[0].label}</Label>
              <Input value={detail1} onChange={(e) => setDetail1(e.target.value)} placeholder={config.fields[0].placeholder} className="mt-1" />
            </div>
            <div>
              <Label className="text-[10px] font-display font-semibold uppercase tracking-wider text-muted-foreground">{config.fields[1].label}</Label>
              <Input value={detail2} onChange={(e) => setDetail2(e.target.value)} placeholder={config.fields[1].placeholder} className="mt-1" />
            </div>
            <div>
              <Label className="text-[10px] font-display font-semibold uppercase tracking-wider text-muted-foreground">{config.fields[2].label}</Label>
              <Input value={detail3} onChange={(e) => setDetail3(e.target.value)} placeholder={config.fields[2].placeholder} className="mt-1" />
            </div>
          </div>
        </div>

        <div>
          <Label className="text-xs font-display font-semibold uppercase tracking-wider text-muted-foreground">Player Photo</Label>
          <Input type="file" accept="image/*" onChange={(e) => setPhoto(e.target.files?.[0] || null)} className="mt-1" />
        </div>
        <Button type="submit" disabled={loading || !name || !team} className="w-full bg-gradient-accent shadow-glow font-heading uppercase tracking-wider text-sm">
          {loading ? "Updating..." : "Update Performer"}
        </Button>
      </form>
    </AdminSection>
  );
};

// ── Alerts Manager ──
const AlertsManager = ({ password, toast }: { password: string; toast: any }) => {
  const [message, setMessage] = useState("");
  const [alertType, setAlertType] = useState("info");
  const [loading, setLoading] = useState(false);
  const [alerts, setAlerts] = useState<any[]>([]);

  const loadAlerts = async () => {
    const { data } = await supabase.from("alerts").select("*").order("created_at", { ascending: false });
    if (data) setAlerts(data);
  };

  useEffect(() => { loadAlerts(); }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    setLoading(true);
    try {
      await adminApi("add-alert", password, { message: message.trim(), alert_type: alertType });
      toast({ title: "Alert added!" });
      setMessage("");
      loadAlerts();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await adminApi("delete-alert", password, { id });
      toast({ title: "Alert removed!" });
      loadAlerts();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const typeLabels: Record<string, string> = {
    info: "ℹ️ Info",
    warning: "⚠️ Warning",
    success: "✅ Success",
    urgent: "🔴 Urgent",
  };

  return (
    <AdminSection icon={Bell} title="Alerts & Notifications" subtitle="Manage public alerts shown on the website" accentColor="text-accent">
      <form onSubmit={handleAdd} className="space-y-3">
        <div>
          <Label className="text-xs font-display font-semibold uppercase tracking-wider text-muted-foreground">Alert Type</Label>
          <Select value={alertType} onValueChange={setAlertType}>
            <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="info">ℹ️ Info</SelectItem>
              <SelectItem value="warning">⚠️ Warning</SelectItem>
              <SelectItem value="success">✅ Success</SelectItem>
              <SelectItem value="urgent">🔴 Urgent</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs font-display font-semibold uppercase tracking-wider text-muted-foreground">Message</Label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter alert message..."
            rows={3}
            className="mt-1 flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
        </div>
        <Button type="submit" disabled={loading || !message.trim()} className="w-full bg-gradient-accent shadow-glow font-heading uppercase tracking-wider text-sm">
          {loading ? "Adding..." : "Add Alert"}
        </Button>
      </form>

      {alerts.length > 0 && (
        <div className="space-y-2 mt-4">
          <h3 className="font-heading text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
            <Bell size={12} /> Active Alerts ({alerts.length})
          </h3>
          {alerts.map((a) => (
            <div key={a.id} className="flex items-start justify-between gap-3 bg-secondary/50 rounded-xl px-4 py-3 border border-border/50">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-display font-semibold uppercase tracking-wider text-muted-foreground">
                    {typeLabels[a.alert_type] || a.alert_type}
                  </span>
                  {!a.is_active && (
                    <span className="text-[9px] bg-muted text-muted-foreground px-1.5 py-0.5 rounded font-display">Inactive</span>
                  )}
                </div>
                <p className="text-sm font-display leading-relaxed">{a.message}</p>
                <p className="text-[10px] text-muted-foreground mt-1">
                  {new Date(a.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                </p>
              </div>
              <Button variant="destructive" size="sm" onClick={() => handleDelete(a.id)}>
                <Trash2 size={12} />
              </Button>
            </div>
          ))}
        </div>
      )}
    </AdminSection>
  );
};

export default AdminPanel;

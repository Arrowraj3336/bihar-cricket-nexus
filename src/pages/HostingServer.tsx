import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Mail, Phone, ServerCrash } from "lucide-react";
import brlLogo from "@/assets/logos/brl-logo-new.png";
import { CricketBall, CricketBat, CricketStumps } from "@/components/CricketDecorations";

/** Hosting expired landing page — the only visible page while the site is under maintenance. */
const HostingServer = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  const { scrollYProgress } = useScroll();

  const yFar = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const yMid = useTransform(scrollYProgress, [0, 1], [0, -160]);
  const yNear = useTransform(scrollYProgress, [0, 1], [0, -260]);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      setPointer({
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      });
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <div ref={ref} className="relative min-h-screen overflow-hidden bg-background">
      {/* Ambient field glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_10%,hsl(var(--primary)/0.12),transparent_60%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.06] [background-image:repeating-linear-gradient(90deg,hsl(var(--primary))_0_1px,transparent_1px_64px)]" />

      {/* Parallax cricket layers */}
      <motion.div style={{ y: yFar, x: pointer.x * -14 }} className="pointer-events-none absolute left-[6%] top-[18%]">
        <CricketStumps className="h-40 w-24 text-primary opacity-[0.07]" />
      </motion.div>
      <motion.div style={{ y: yMid, x: pointer.x * 22 }} className="pointer-events-none absolute right-[8%] top-[26%]">
        <CricketBat className="h-56 w-16 rotate-[24deg] text-primary opacity-[0.08]" />
      </motion.div>
      <motion.div style={{ y: yNear, x: pointer.x * 34 }} className="pointer-events-none absolute bottom-[12%] left-[14%]">
        <CricketBall className="h-24 w-24 text-primary opacity-[0.09]" />
      </motion.div>

      {/* Header: logo + name only */}
      <header className="relative z-10 flex items-center justify-center gap-3 px-6 pt-8">
        <img src={brlLogo} alt="DBRL" className="h-14 w-14 object-contain sm:h-16 sm:w-16" />
        <div className="h-8 w-px bg-border" />
        <span className="font-heading text-2xl font-black tracking-[0.3em] text-foreground sm:text-3xl">DBRL</span>
      </header>

      <main className="relative z-10 mx-auto flex min-h-[calc(100vh-7rem)] max-w-3xl flex-col items-center justify-center px-6 py-14 text-center">
        {/* 3D spinning cricket ball */}
        <div className="mb-8 [perspective:1000px]">
          <motion.div
            animate={{ rotateY: 360, rotateX: [8, -8, 8] }}
            transition={{
              rotateY: { duration: 12, repeat: Infinity, ease: "linear" },
              rotateX: { duration: 6, repeat: Infinity, ease: "easeInOut" },
            }}
            style={{ transformStyle: "preserve-3d", x: pointer.x * 18, y: pointer.y * 12 }}
            className="relative h-32 w-32 rounded-full sm:h-40 sm:w-40"
          >
            <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_32%_28%,hsl(var(--primary)/0.95),hsl(var(--primary)/0.55)_45%,hsl(0_60%_12%)_100%)] shadow-glow" />
            <div className="absolute inset-0 rounded-full border-t-2 border-dashed border-background/50" />
            <div className="absolute inset-x-3 top-1/2 h-[2px] -translate-y-1/2 border-t-2 border-dashed border-background/40" />
            <div className="absolute inset-0 rounded-full ring-1 ring-primary/40" />
          </motion.div>
          <div className="mx-auto mt-3 h-3 w-24 rounded-[50%] bg-primary/25 blur-md" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-secondary/60 px-4 py-1.5 backdrop-blur"
        >
          <ServerCrash className="h-3.5 w-3.5 text-primary" />
          <span className="font-display text-[10px] font-bold uppercase tracking-[0.25em] text-primary">Innings Break</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-5 font-heading text-4xl font-black uppercase leading-[1.05] tracking-tight text-foreground sm:text-6xl"
        >
          Hosting Plan <span className="text-gradient-primary">Has Expired</span>
        </motion.h1>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mx-auto mt-4 h-[3px] w-32 rounded-full bg-gradient-accent"
        />

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="mt-5 max-w-lg font-display text-sm leading-relaxed text-muted-foreground sm:text-base"
        >
          Our hosting plan has run out, so the Darbhanga Bihar Rural League site is temporarily off the field.
          We'll be back at the crease shortly — reach out to the admin for renewal or any urgent query.
        </motion.p>

        {/* Animated contact admin button */}
        <motion.a
          href="tel:+919801396077"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.96 }}
          className="group relative mt-9 inline-flex items-center gap-3 overflow-hidden rounded-full bg-gradient-accent px-8 py-4 font-display text-xs font-bold uppercase tracking-[0.2em] text-primary-foreground shadow-glow"
        >
          <span className="absolute inset-0 -translate-x-full bg-white/25 transition-transform duration-700 group-hover:translate-x-full" />
          <motion.span
            animate={{ scale: [1, 1.25, 1] }}
            transition={{ duration: 1.8, repeat: Infinity }}
            className="absolute inset-0 rounded-full ring-2 ring-primary/40"
          />
          <Phone className="h-4 w-4" />
          Contact Admin
        </motion.a>

        <a
          href="mailto:dbrl.info@gmail.com"
          className="mt-4 inline-flex items-center gap-2 font-display text-xs tracking-wide text-muted-foreground transition-colors hover:text-primary"
        >
          <Mail className="h-3.5 w-3.5" /> dbrl.info@gmail.com
        </a>

        <p className="mt-10 font-display text-[10px] uppercase tracking-[0.3em] text-muted-foreground/70">
          Darbhanga Bihar Rural League
        </p>
      </main>
    </div>
  );
};

export default HostingServer;

import { motion } from "framer-motion";
import heroBatsman from "@/assets/hero-batsman.jpeg";
import brlLogo from "@/assets/logos/brl-logo-new.png";

const HeroSection = () => {
  return (
    <section id="hero" className="relative min-h-screen flex flex-col overflow-hidden bg-gradient-to-b from-white via-white to-background">
      <img
        src={heroBatsman}
        alt="Cricket batsman striking the ball"
        className="absolute inset-0 w-full h-full object-cover object-[center_60%]"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-background/80" />
      <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-transparent to-white/10" />

      <div className="container relative z-10 pt-20 pb-8 md:pt-28 md:pb-16 flex-1 flex flex-col">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <img src={brlLogo} alt="BRL Logo" className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 object-contain mx-auto mb-4 drop-shadow-2xl" />
          <p className="text-foreground/70 font-display text-xs sm:text-sm md:text-base font-semibold tracking-[0.3em] uppercase mb-3">
            Season 2026 • Bihar's Biggest Cricket Tournament
          </p>
          <h1 className="font-heading text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black leading-[1.05] mb-4">
            <span className="text-foreground">WHERE RURAL</span>
            <br />
            <span className="text-foreground">TALENT</span>{" "}
            <span className="text-[hsl(340,80%,35%)] font-black">MEETS</span>
            <br />
            <span className="text-foreground">THE </span>
            <span className="text-foreground">BIG STAGE</span>
          </h1>
        </motion.div>

        <div className="flex-1" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center pb-8 md:pb-12"
        >
          <a
            href="#teams"
            className="inline-flex items-center justify-center px-8 py-3.5 rounded-lg border border-primary/40 text-primary font-heading font-semibold text-sm tracking-wider uppercase hover:bg-primary/10 transition-colors backdrop-blur-md bg-background/30"
          >
            Explore Teams
          </a>
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default HeroSection;

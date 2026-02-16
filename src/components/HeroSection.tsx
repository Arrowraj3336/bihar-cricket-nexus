import { motion } from "framer-motion";
import heroBatsman from "@/assets/hero-batsman.jpeg";
import brlLogo from "@/assets/logos/brl-logo-new.png";

const HeroSection = () => {
  return (
    <section id="hero" className="relative min-h-screen flex items-end justify-center overflow-hidden">
      <img
        src={heroBatsman}
        alt="Cricket batsman striking the ball"
        className="absolute inset-0 w-full h-full object-cover object-center"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20" />

      <div className="container relative z-10 pb-16 md:pb-24 pt-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <img src={brlLogo} alt="BRL Logo" className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 object-contain mx-auto mb-4 drop-shadow-2xl" />
          <p className="text-white/80 font-display text-xs sm:text-sm md:text-base font-semibold tracking-[0.3em] uppercase mb-3 drop-shadow-lg">
            Season 2026 • Bihar's Biggest Cricket Tournament
          </p>
          <h1 className="font-heading text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black leading-[1.05] mb-4 drop-shadow-2xl">
            <span className="text-white">WHERE RURAL</span>
            <br />
            <span className="text-white">TALENT</span>{" "}
            <span className="text-white">MEETS</span>
            <br />
            <span className="text-white">THE </span>
            <span className="text-white">BIG STAGE</span>
          </h1>
          <p className="text-white/80 text-sm sm:text-base md:text-lg max-w-lg mx-auto mb-8 drop-shadow-lg">
            Unleashing the power of grassroots cricket across Bihar.
            16 teams, 1 champion — the battle begins now.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="#matches"
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-gradient-accent text-primary-foreground font-heading font-semibold text-sm tracking-wider uppercase shadow-glow hover:opacity-90 transition-opacity"
            >
              View Schedule
            </a>
            <a
              href="#teams"
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg border border-white/30 text-white font-heading font-semibold text-sm tracking-wider uppercase hover:bg-white/10 transition-colors backdrop-blur-sm"
            >
              Explore Teams
            </a>
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default HeroSection;

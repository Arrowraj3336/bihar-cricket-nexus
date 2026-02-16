import { useState, useEffect } from "react";
import { Calendar, Trophy, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import brlLogo from "@/assets/logos/brl-logo-new.png";

const navLinks = [
  { label: "Home", href: "#hero" },
  { label: "Teams", href: "#teams" },
  { label: "Matches", href: "#matches" },
  { label: "Performers", href: "#performers" },
  { label: "Gallery", href: "#gallery" },
  { label: "About", href: "#organiser" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const currentY = window.scrollY;
      setScrolled(currentY > 30);

      if (currentY < 100) {
        setVisible(true);
      } else if (currentY < lastScrollY) {
        setVisible(true);
      } else if (currentY > lastScrollY + 5) {
        setVisible(false);
      }
      setLastScrollY(currentY);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [lastScrollY]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
    <motion.nav
      initial={{ y: 0 }}
      animate={{ y: visible || open ? 0 : -100 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-background/80 backdrop-blur-2xl shadow-[0_2px_40px_hsl(340_70%_35%/0.06)] border-b border-primary/10"
          : "bg-transparent backdrop-blur-md"
      }`}
    >
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      <div className="container flex items-center justify-between h-16 md:h-[72px]">
        {/* Logo - left on mobile */}
        <a href="#hero" className="flex items-center gap-2.5 group">
          <img
            src={brlLogo}
            alt="Bihar Rural League"
            className="w-10 h-10 md:w-12 md:h-12 object-contain transition-transform duration-300 group-hover:scale-105"
          />
          <div className="flex flex-col">
            <span className="font-heading text-sm md:text-base font-black tracking-wider text-foreground leading-none">BRL</span>
            <span className="text-[8px] md:text-[9px] font-display text-muted-foreground tracking-widest uppercase leading-tight">Bihar Rural League</span>
          </div>
        </a>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="relative px-4 py-2 text-sm font-display font-semibold tracking-wide text-muted-foreground hover:text-foreground transition-all duration-300 group"
            >
              {link.label}
              <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-gradient-to-r from-primary to-accent rounded-full group-hover:w-2/3 transition-all duration-300" />
            </a>
          ))}
          <a
            href="#matches"
            className="ml-3 px-5 py-2 rounded-lg bg-gradient-accent text-primary-foreground font-display font-bold text-xs tracking-widest uppercase shadow-glow hover:shadow-[0_0_50px_hsl(340_70%_35%/0.3)] transition-all duration-300 hover:scale-105"
          >
            Schedule
          </a>
        </div>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-foreground hover:border-primary/40 transition-all duration-300"
          aria-label="Toggle menu"
        >
          <AnimatePresence mode="wait">
            {open ? (
              <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                <X size={20} />
              </motion.div>
            ) : (
              <motion.div key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
                <Menu size={20} />
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </div>
    </motion.nav>

    {/* Mobile menu - modern slide-down style */}
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="md:hidden fixed inset-0 z-[60] bg-background/98 backdrop-blur-[80px]"
          style={{ top: "4rem" }}
        >
          <div className="flex flex-col h-full">
            {/* Nav links */}
            <div className="flex-1 flex flex-col px-6 pt-6 gap-1">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: i * 0.05, duration: 0.3 }}
                  className="flex items-center gap-4 py-4 px-4 rounded-2xl text-lg font-heading font-bold tracking-wide text-foreground/70 hover:text-foreground hover:bg-primary/5 transition-all duration-200"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                  {link.label}
                </motion.a>
              ))}
            </div>
            
            {/* Bottom CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="p-6 pb-10 border-t border-border"
            >
              <a
                href="#matches"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl bg-gradient-accent text-primary-foreground font-heading font-bold text-sm tracking-widest uppercase shadow-glow"
              >
                <Calendar size={16} />
                View Schedule
              </a>
              <div className="flex items-center justify-center gap-2 mt-4 text-xs text-muted-foreground">
                <Trophy size={12} className="text-primary" />
                <span className="font-display tracking-wider">Bihar Rural League 2026</span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
    </>
  );
};

export default Navbar;

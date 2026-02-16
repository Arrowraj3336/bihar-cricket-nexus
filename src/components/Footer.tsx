import { Mail, MapPin, Phone, Instagram, Facebook, Youtube, ExternalLink, Trophy } from "lucide-react";
import { motion } from "framer-motion";
import brlLogo from "@/assets/logos/brl-logo-new.png";

const Footer = () => {
  

  return (
    <footer className="relative bg-secondary/30 overflow-hidden">
      {/* Top gradient line */}
      <div className="h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />


      <div className="container py-10 md:py-14">
        {/* Brand + Info */}
        <div className="flex flex-col items-center text-center gap-6 mb-8">
          <a href="#hero" className="flex items-center gap-3">
            <img src={brlLogo} alt="BRL Logo" className="w-12 h-12 object-contain drop-shadow-[0_0_10px_hsl(265_60%_50%/0.3)]" />
            <span className="font-heading text-2xl font-black tracking-widest text-foreground">BRL</span>
          </a>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
            Empowering rural cricket talent across Bihar — a professional platform for undiscovered players.
          </p>

          {/* Social */}
          <div className="flex gap-3">
            {[
              { Icon: Instagram, label: "Instagram" },
              { Icon: Facebook, label: "Facebook" },
              { Icon: Youtube, label: "YouTube" },
            ].map(({ Icon, label }) => (
              <motion.a
                key={label}
                href="#"
                whileHover={{ scale: 1.15, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-muted-foreground hover:text-accent hover:border-accent/40 hover:bg-accent/10 transition-all duration-300"
                aria-label={label}
              >
                <Icon size={16} />
              </motion.a>
            ))}
          </div>
        </div>

        {/* Info grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-md mx-auto">
          {/* Contact */}
          <div className="bg-card/50 rounded-2xl p-5 border border-border/50">
            <h4 className="font-heading text-xs font-bold uppercase tracking-widest mb-4 text-accent flex items-center gap-2">
              <Mail size={12} />
              Contact
            </h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2.5">
                <MapPin size={14} className="text-primary shrink-0 mt-0.5" />
                <span>Darbhanga, Bihar</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Mail size={14} className="text-primary shrink-0 mt-0.5" />
                <span className="break-all text-xs">dbrl.info@gmail.com</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Phone size={14} className="text-primary shrink-0 mt-0.5" />
                <span>+91 9801396077</span>
              </li>
            </ul>
          </div>

          {/* Tournament */}
          <div className="bg-card/50 rounded-2xl p-5 border border-border/50">
            <h4 className="font-heading text-xs font-bold uppercase tracking-widest mb-4 text-accent flex items-center gap-2">
              <Trophy size={12} />
              Tournament
            </h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-2.5"><span>🏏</span><span>16 Teams</span></li>
              <li className="flex items-center gap-2.5"><span>📍</span><span>Darbhanga</span></li>
              <li className="flex items-center gap-2.5"><span>🏆</span><span>Trials: 21 Feb</span></li>
              <li className="flex items-center gap-2.5"><span>⚡</span><span>T20 Format</span></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border/30">
        <div className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/15 to-transparent" />
        <div className="container py-4 flex flex-col items-center gap-3 md:flex-row md:justify-between text-xs text-muted-foreground">
          <p>© 2026 Bihar Rural League. All rights reserved.</p>
          <div className="flex items-center gap-3 flex-wrap justify-center">
            <a href="#" className="hover:text-accent transition-colors">Privacy</a>
            <span className="w-px h-3 bg-border" />
            <a href="#" className="hover:text-accent transition-colors">Terms</a>
            <span className="w-px h-3 bg-border" />
            <a
              href="https://www.instagram.com/arrowxlabs?igsh=MW40NzJ0ZjU2Mmllcg=="
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-accent hover:text-accent/80 transition-colors font-display font-semibold"
            >
              Design & Developed By Arrow X Labs
              <ExternalLink size={10} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
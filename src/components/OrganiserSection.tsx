import { motion } from "framer-motion";
import { Users, Award, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import organiserImg from "@/assets/organiser-anand-thakur-new.jpeg";
import convenerImg from "@/assets/convener-gyaneshwar.jpeg";
import chiefSelectorImg from "@/assets/chief-selector-anand.jpeg";
import squadSelectorImg from "@/assets/squad-selector-rajesh.jpeg";
import digitalExecImg from "@/assets/digital-exec-raaz.jpeg";
import yashImg from "@/assets/member-yash.jpeg";
import sarfarazImg from "@/assets/member-sarfaraz.jpeg";
import playerVector from "@/assets/player-vector.png";
import heroBatsman from "@/assets/hero-batsman.jpeg";

const rollingCards = [
  { title: "Fair Play Award", subtitle: "Excellence in sportsmanship" },
  { title: "Best Catch", subtitle: "Outstanding fielding moments" },
  { title: "Century Club", subtitle: "Batsmen who hit 100+" },
  { title: "Hat-Trick Heroes", subtitle: "3 wickets in 3 balls" },
  { title: "Rising Stars", subtitle: "U-19 emerging talents" },
  { title: "Fan Favourite", subtitle: "Most popular player vote" },
  { title: "Power Hitter", subtitle: "Most sixes in tournament" },
  { title: "Economy King", subtitle: "Best bowling economy" },
];

const teamMembers = [
  {
    name: "Mr. Anand Thakur",
    role: "Tournament Organiser Head",
    img: organiserImg,
    bio: "Pioneering rural cricket development across Bihar since 2010.",
  },
  {
    name: "Mr. Gyaneshwar Gautam",
    role: "Convener, Governing Council",
    img: convenerImg,
    bio: "Ensuring transparent governance and fair play standards.",
  },
  {
    name: "Mr. Sarfaraz Hussain",
    role: "Chairman",
    img: sarfarazImg,
    bio: "Leading the league's strategic vision and partnerships.",
  },
  {
    name: "Mr. Rajesh",
    role: "Squad Selector Head",
    img: squadSelectorImg,
    bio: "Identifying and nurturing grassroots cricket talent.",
  },
  {
    name: "Mr. Anand",
    role: "Chief Selector",
    img: chiefSelectorImg,
    bio: "Curating competitive squads for every franchise.",
  },
  {
    name: "Mr. Raaz",
    role: "Chief Web Executive",
    img: digitalExecImg,
    bio: "Driving digital innovation and online engagement.",
  },
  {
    name: "Mr. Gautam Thakur",
    role: "Treasurer",
    img: yashImg,
    bio: "Managing league finances with integrity and precision.",
  },
];

const OrganiserSection = () => {
  return (
    <section id="organiser" className="py-16 md:py-24 bg-background relative overflow-hidden">
      {/* Subtle background decorations */}
      <div className="absolute inset-0 cricket-ball-pattern opacity-50" />
      <div className="absolute top-10 right-0 w-40 h-40 rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute bottom-10 left-0 w-40 h-40 rounded-full bg-accent/5 blur-3xl" />

      <div className="container relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 mb-3">
            <Users size={14} className="text-accent" />
            <span className="text-xs font-display font-semibold text-accent uppercase tracking-wider">The Team</span>
          </div>
          <h2 className="font-heading text-3xl md:text-5xl font-bold mb-2">
            Organisers & <span className="text-gradient-primary">Awards</span>
          </h2>
          <p className="text-muted-foreground text-sm md:text-base max-w-md mx-auto">
            The visionary leaders powering Bihar's biggest cricket league
          </p>
        </motion.div>

        {/* Leaders - Top 3 */}
        <div className="max-w-3xl mx-auto mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl border border-border bg-card/80 p-5 md:p-8"
          >
            <div className="grid grid-cols-3 gap-3 md:gap-6 mb-5">
              {teamMembers.slice(0, 3).map((member) => (
                <div key={member.name} className="flex flex-col items-center text-center">
                  <img
                    src={member.img}
                    alt={member.name}
                    className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-2xl object-cover border border-border mb-3"
                  />
                  <span className="text-[9px] sm:text-xs text-accent font-display font-semibold uppercase tracking-wider mb-0.5">
                    {member.role}
                  </span>
                  <h3 className="font-heading text-xs sm:text-sm md:text-base font-bold text-foreground">{member.name}</h3>
                </div>
              ))}
            </div>
            <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed text-center">
              Visionary sports administrators dedicated to promoting rural cricket talent across Bihar with over 15 years of experience.
            </p>
          </motion.div>
        </div>

        {/* Other Members */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4 max-w-4xl mx-auto mb-8">
          {teamMembers.slice(3).map((member, i) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="rounded-xl border border-border bg-card/80 p-3 sm:p-4 text-center group hover:border-primary/30 transition-all duration-300"
            >
              <img
                src={member.img}
                alt={member.name}
                className="w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-xl object-cover border border-border group-hover:border-primary/30 transition-colors mx-auto mb-2.5"
              />
              <span className="text-[9px] sm:text-[10px] md:text-xs text-accent font-display font-semibold uppercase tracking-wider block mb-0.5">
                {member.role}
              </span>
              <h4 className="font-heading text-xs sm:text-sm md:text-base font-bold text-foreground mb-1">{member.name}</h4>
              <p className="text-[9px] sm:text-[10px] md:text-xs text-muted-foreground leading-snug">{member.bio}</p>
            </motion.div>
          ))}
        </div>

        {/* More Members Button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <Link
            to="/members"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-accent text-primary-foreground font-heading font-semibold text-sm tracking-wider uppercase shadow-glow hover:opacity-90 transition-opacity"
          >
            View All Members
            <ArrowRight size={16} />
          </Link>
        </motion.div>

        {/* Awards Marquee */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="overflow-hidden"
        >
          <div className="inline-flex items-center gap-2 mx-auto mb-6 justify-center w-full">
            <Award size={16} className="text-accent" />
            <h3 className="font-heading text-lg md:text-xl font-bold text-center">
              Tournament <span className="text-gradient-gold">Awards</span>
            </h3>
          </div>

          <div className="relative mb-4">
            <div className="flex animate-[marquee_30s_linear_infinite] gap-4 w-max">
              {[...rollingCards, ...rollingCards].map((card, i) => (
                <div
                  key={i}
                  className="flex-shrink-0 w-48 sm:w-56 md:w-64 bg-card/80 rounded-xl border border-border/60 p-4 relative overflow-hidden group hover:border-primary/40 transition-colors"
                >
                  <img
                    src={playerVector}
                    alt=""
                    className="absolute -right-4 -bottom-2 w-16 h-16 md:w-24 md:h-24 object-contain opacity-[0.06] group-hover:opacity-[0.12] transition-opacity"
                  />
                  <p className="font-heading text-sm md:text-base font-bold mb-1 relative z-10">{card.title}</p>
                  <p className="text-[10px] md:text-xs text-muted-foreground relative z-10">{card.subtitle}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="flex animate-[marquee-reverse_35s_linear_infinite] gap-4 w-max">
              {[...rollingCards.slice(4), ...rollingCards.slice(0, 4), ...rollingCards.slice(4), ...rollingCards.slice(0, 4)].map((card, i) => (
                <div
                  key={i}
                  className="flex-shrink-0 w-48 sm:w-56 md:w-64 bg-card/80 rounded-xl border border-border/60 p-4 relative overflow-hidden group hover:border-accent/40 transition-colors"
                >
                  <img
                    src={heroBatsman}
                    alt=""
                    className="absolute -right-4 -bottom-2 w-16 h-16 md:w-24 md:h-24 object-cover rounded-lg opacity-[0.05] group-hover:opacity-[0.10] transition-opacity"
                  />
                  <p className="font-heading text-sm md:text-base font-bold mb-1 relative z-10">{card.title}</p>
                  <p className="text-[10px] md:text-xs text-muted-foreground relative z-10">{card.subtitle}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default OrganiserSection;

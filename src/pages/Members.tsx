import { motion } from "framer-motion";
import { ArrowLeft, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { CricketBall, CricketBat, CricketStumps } from "@/components/CricketDecorations";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

import organiserImg from "@/assets/organiser-anand-thakur-new.jpeg";
import convenerImg from "@/assets/convener-gyaneshwar.jpeg";
import chiefSelectorImg from "@/assets/chief-selector-anand.jpeg";
import squadSelectorImg from "@/assets/squad-selector-rajesh.jpeg";
import digitalExecImg from "@/assets/digital-exec-raaz.jpeg";
import harshwardhanImg from "@/assets/member-harshwardhan.jpeg";
import amitImg from "@/assets/member-amit.jpeg";
import jiaulImg from "@/assets/member-jiaul.jpeg";
import rupakImg from "@/assets/member-rupak.jpeg";
import sanketImg from "@/assets/member-sanket.jpeg";
import abhishekImg from "@/assets/member-abhishek.jpeg";
import rahulImg from "@/assets/member-rahul.jpeg";

const allMembers = [
  { name: "Mr. Anand Thakur", role: "Tournament Organiser Head", img: organiserImg, desc: "Leads the Bihar Rural League with a vision to uplift grassroots cricket across rural Bihar." },
  { name: "Mr. Gyaneshwar Gautam", role: "Convener, Governing Council", img: convenerImg, desc: "Oversees the governing council and ensures smooth coordination between all tournament bodies." },
  { name: "Mr. Rajesh", role: "Squad Selector Head", img: squadSelectorImg, desc: "Heads the selection committee, identifying and nurturing emerging cricket talent from rural areas." },
  { name: "Mr. Anand", role: "Chief Selector", img: chiefSelectorImg, desc: "Evaluates player performances and finalizes team compositions for every tournament stage." },
  { name: "Mr. Raaz", role: "Chief Web Executive", img: digitalExecImg, desc: "Manages the league's digital presence, web strategy, and all online communications." },
  { name: "Mr. Harshwardhan", role: "BCA President", img: harshwardhanImg, desc: "Presides over the Bihar Cricket Association, guiding policy and development for the sport statewide." },
  { name: "Mr. Amit Kumar", role: "Member Bihar Rural League", img: amitImg, desc: "An active member contributing to event planning, logistics, and ground-level tournament operations." },
  { name: "Mr. Jiaul Arfeen", role: "Secretary, Bihar Cricket Association", img: jiaulImg, desc: "Handles administrative duties and inter-organizational liaisons for Bihar's cricket ecosystem." },
  { name: "Mr. Rupak Kumar", role: "Media Manager", img: rupakImg, desc: "Directs media coverage, photography, and public relations for the Bihar Rural League." },
  { name: "Mr. Sanket", role: "Support Personnel", img: sanketImg, desc: "Provides essential support across logistics, coordination, and on-ground tournament operations." },
  { name: "Mr. Abhishek", role: "Elite Performance Staff", img: abhishekImg, desc: "Works closely with players to enhance elite-level performance standards and training quality." },
  { name: "Mr. Rahul", role: "Athletic Performance Staff", img: rahulImg, desc: "Focuses on athletic conditioning, fitness programs, and physical readiness of all players." },
];

const Members = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-24 pb-16 md:pt-32 md:pb-24 relative overflow-hidden">
        {/* Cricket vector decorations */}
        <CricketBall className="absolute top-20 left-4 w-16 h-16 text-primary opacity-10 md:w-24 md:h-24 md:left-10" />
        <CricketBat className="absolute top-40 right-4 w-8 h-24 text-accent opacity-10 md:w-12 md:h-40 md:right-16" />
        <CricketStumps className="absolute bottom-20 left-8 w-12 h-20 text-primary opacity-[0.08] md:w-16 md:h-28 md:left-20" />
        <CricketBall className="absolute bottom-40 right-10 w-12 h-12 text-accent opacity-[0.08] md:w-20 md:h-20" />

        {/* Background blurs */}
        <div className="absolute top-0 right-0 w-60 h-60 rounded-full bg-primary/5 blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-60 h-60 rounded-full bg-accent/5 blur-[100px]" />

        <div className="container relative z-10">
          {/* Back button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-8"
          >
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm font-display font-semibold text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft size={16} />
              Back to Home
            </Link>
          </motion.div>

          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 mb-3">
              <Users size={14} className="text-accent" />
              <span className="text-xs font-display font-semibold text-accent uppercase tracking-wider">Our Team</span>
            </div>
            <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold mb-3">
              Meet the <span className="text-gradient-primary">Leaders</span>
            </h1>
            <p className="text-muted-foreground text-sm md:text-base max-w-lg mx-auto">
              The dedicated team behind Bihar Rural League, working tirelessly to bring world-class cricket to rural Bihar.
            </p>
          </motion.div>

          {/* Members Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 max-w-5xl mx-auto">
            {allMembers.map((member, i) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06, duration: 0.5 }}
                className="group rounded-2xl border border-border bg-card/60 backdrop-blur-sm p-5 flex flex-col items-center text-center hover:border-primary/30 transition-all duration-300"
              >
                <img
                  src={member.img}
                  alt={member.name}
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border border-border group-hover:border-primary/30 transition-colors mb-3"
                />
                <span className="text-[10px] sm:text-xs text-accent font-display font-semibold uppercase tracking-wider block mb-1 leading-tight">
                  {member.role}
                </span>
                <h3 className="font-heading text-sm sm:text-base font-bold text-foreground mb-2">{member.name}</h3>
                <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">{member.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Members;

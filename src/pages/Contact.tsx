import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, User, Calendar, FileText, Shield, ChevronDown } from "lucide-react";
import { CricketBall, CricketBat, CricketStumps } from "@/components/CricketDecorations";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const playerTypes = ["Batter", "Bowler", "All Rounder", "Wicket Keeper"];
const documentTypes = ["Aadhar Card", "Birth Certificate"];

const Contact = () => {
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    dob: "",
    phone: "",
    email: "",
    documentType: "",
    documentNumber: "",
    playerType: "",
    address: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const { data, error } = await supabase.functions.invoke("submit-registration", {
        body: form,
      });

      if (error) throw error;

      toast({
        title: "Registration Submitted! ✅",
        description: "Your registration has been saved successfully. Our team will contact you soon.",
      });

      setForm({ name: "", dob: "", phone: "", email: "", documentType: "", documentNumber: "", playerType: "", address: "" });
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "Something went wrong. Please try again.", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <Navbar />

      {/* Background decorations - cricket vectors */}
      <div className="absolute inset-0 cricket-ball-pattern opacity-50" />
      <div className="absolute top-20 left-[5%] w-40 h-40 rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute bottom-32 right-[10%] w-48 h-48 rounded-full bg-accent/5 blur-3xl" />
      <CricketBall className="absolute top-28 -left-8 w-28 h-28 text-primary opacity-[0.07]" />
      <CricketBat className="absolute top-48 -right-6 w-14 h-40 text-accent opacity-[0.08] rotate-[15deg]" />
      <CricketStumps className="absolute bottom-60 -left-4 w-16 h-28 text-primary opacity-[0.06]" />
      <CricketBall className="absolute bottom-16 right-8 w-20 h-20 text-accent opacity-[0.06]" />
      <CricketBat className="absolute top-[45%] -left-6 w-10 h-32 text-primary opacity-[0.05] -rotate-[20deg]" />
      <CricketStumps className="absolute top-[25%] -right-6 w-14 h-24 text-accent opacity-[0.05]" />
      <CricketBall className="absolute top-[65%] right-[15%] w-12 h-12 text-primary opacity-[0.04] hidden md:block" />
      <CricketBat className="absolute bottom-[30%] left-[10%] w-8 h-24 text-accent opacity-[0.04] rotate-[35deg] hidden md:block" />
      <CricketStumps className="absolute top-[80%] right-[5%] w-10 h-18 text-primary opacity-[0.04] hidden md:block" />
      <CricketBall className="absolute top-[15%] right-[30%] w-10 h-10 text-accent opacity-[0.03] hidden lg:block" />
      <CricketBat className="absolute bottom-[15%] right-[40%] w-6 h-20 text-primary opacity-[0.03] -rotate-12 hidden lg:block" />

      <div className="container relative z-10 pt-24 pb-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 mb-3">
            <Mail size={14} className="text-accent" />
            <span className="text-xs font-display font-semibold text-accent uppercase tracking-wider">Get In Touch</span>
          </div>
          <h1 className="font-heading text-3xl md:text-5xl font-bold mb-4">
            Contact <span className="text-gradient-primary">Us</span>
          </h1>
        </motion.div>

        {/* Contact Info Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto mb-12"
        >
          {[
            { icon: Phone, label: "Phone", value: "+91 9801396077" },
            { icon: Mail, label: "Email", value: "dbrl.info@gmail.com" },
            { icon: MapPin, label: "Location", value: "Darbhanga, Bihar" },
          ].map((item) => (
            <div key={item.label} className="rounded-xl border border-border bg-card/80 p-5 text-center relative overflow-hidden group hover:border-primary/30 transition-colors">
              <CricketBall className="absolute -right-3 -bottom-3 w-12 h-12 text-primary opacity-[0.05] group-hover:opacity-[0.1] transition-opacity" />
              <item.icon size={24} className="text-primary mx-auto mb-2" />
              <p className="text-xs text-muted-foreground font-display uppercase tracking-wider mb-1">{item.label}</p>
              <p className="font-heading font-bold text-sm">{item.value}</p>
            </div>
          ))}
        </motion.div>

        {/* Selection Process Description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-3xl mx-auto mb-12"
        >
          <div className="rounded-2xl border border-border bg-card/80 p-6 md:p-8 relative overflow-hidden">
            <CricketStumps className="absolute -right-4 top-4 w-10 h-20 text-primary opacity-[0.06]" />
            <CricketBat className="absolute -left-2 bottom-4 w-6 h-20 text-accent opacity-[0.05] rotate-[25deg]" />

            <h2 className="font-heading text-xl md:text-2xl font-bold mb-4 flex items-center gap-2">
              <Shield size={20} className="text-primary" />
              Selection Process & <span className="text-gradient-primary">Registration</span>
            </h2>

            <div className="space-y-3 text-sm md:text-base text-muted-foreground leading-relaxed">
              <p>
                The <strong className="text-foreground">Bihar Rural League (BRL)</strong> is committed to discovering and nurturing cricket talent from the grassroots level across Bihar. Our selection process is designed to be fair, transparent, and accessible to every aspiring cricketer.
              </p>
              <p>
                <strong className="text-foreground">How Selection Works:</strong> Players register through our official registration form below. Once registered, players are invited to attend selection trials at designated venues across Darbhanga and surrounding districts. Our experienced panel of selectors — led by the Squad Selector Head and Chief Selector — evaluate each player based on their batting, bowling, fielding, and overall cricket IQ.
              </p>
              <p>
                <strong className="text-foreground">Trial Process:</strong> Each trial consists of batting nets, bowling sessions, and fielding drills. Players are scored on technique, temperament, fitness, and match awareness. Top performers are shortlisted and drafted into one of the 16 franchise teams for the upcoming season.
              </p>
              <p>
                <strong className="text-foreground">How to Register:</strong> Fill out the registration form below with your accurate details. Make sure to provide a valid ID (Aadhar Card or Birth Certificate) and select your primary playing role. Our team will contact you with trial dates, venue details, and further instructions via phone or email.
              </p>
              <p>
                <strong className="text-foreground">Eligibility:</strong> All players from rural Bihar are eligible. There is no age restriction, but players under 16 must provide a Birth Certificate. Fair play, sportsmanship, and dedication are the core values we look for in every player.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Registration Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="max-w-2xl mx-auto"
        >
          <div className="rounded-2xl border border-border bg-card/80 p-6 md:p-8 relative overflow-hidden">
            <div className="h-1.5 w-full absolute top-0 left-0 right-0 bg-gradient-to-r from-primary via-accent to-primary" />
            <CricketBall className="absolute -right-6 -bottom-6 w-24 h-24 text-primary opacity-[0.05]" />

            <h2 className="font-heading text-xl md:text-2xl font-bold mb-6 text-center">
              Player <span className="text-gradient-primary">Registration</span>
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <label className="text-xs font-display font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <User size={12} /> Full Name
                </label>
                <input
                  type="text" name="name" value={form.name} onChange={handleChange} required
                  placeholder="Enter your full name"
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                />
              </div>

              {/* DOB & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-display font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <Calendar size={12} /> Date of Birth
                  </label>
                  <input
                    type="date" name="dob" value={form.dob} onChange={handleChange} required
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                  />
                </div>
                <div>
                  <label className="text-xs font-display font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <Phone size={12} /> Phone Number
                  </label>
                  <input
                    type="tel" name="phone" value={form.phone} onChange={handleChange} required
                    placeholder="+91 XXXXX XXXXX"
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="text-xs font-display font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Mail size={12} /> Email
                </label>
                <input
                  type="email" name="email" value={form.email} onChange={handleChange} required
                  placeholder="your@email.com"
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                />
              </div>

              {/* Document Type & Number */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-display font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <FileText size={12} /> Document Type
                  </label>
                  <div className="relative">
                    <select
                      name="documentType" value={form.documentType} onChange={handleChange} required
                      className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                    >
                      <option value="">Select document</option>
                      {documentTypes.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-display font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <FileText size={12} /> Document Number
                  </label>
                  <input
                    type="text" name="documentNumber" value={form.documentNumber} onChange={handleChange} required
                    placeholder="Enter document number"
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                  />
                </div>
              </div>

              {/* Player Type */}
              <div>
                <label className="text-xs font-display font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Shield size={12} /> Player Type
                </label>
                <div className="relative">
                  <select
                    name="playerType" value={form.playerType} onChange={handleChange} required
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                  >
                    <option value="">Select player type</option>
                    {playerTypes.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="text-xs font-display font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <MapPin size={12} /> Address
                </label>
                <textarea
                  name="address" value={form.address} onChange={handleChange} required rows={3}
                  placeholder="Enter your full address"
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all resize-none"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 rounded-xl bg-gradient-accent text-primary-foreground font-heading font-bold text-sm tracking-widest uppercase shadow-glow hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Send size={16} />
                {submitting ? "Submitting..." : "Submit Registration"}
              </button>
            </form>
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default Contact;

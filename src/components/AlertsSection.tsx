import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Bell, AlertTriangle, Info, CheckCircle, Megaphone } from "lucide-react";
import { CricketBall, CricketBat, CricketStumps } from "./CricketDecorations";
import { supabase } from "@/integrations/supabase/client";

type AlertType = "info" | "warning" | "success" | "urgent";

const alertConfig: Record<AlertType, { icon: typeof Bell; dot: string; badge: string; badgeText: string }> = {
  info: { icon: Info, dot: "bg-blue-500", badge: "bg-blue-500/10 text-blue-600 border-blue-500/20", badgeText: "Info" },
  warning: { icon: AlertTriangle, dot: "bg-amber-500", badge: "bg-amber-500/10 text-amber-600 border-amber-500/20", badgeText: "Warning" },
  success: { icon: CheckCircle, dot: "bg-emerald-500", badge: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20", badgeText: "Update" },
  urgent: { icon: Bell, dot: "bg-red-500", badge: "bg-red-500/10 text-red-600 border-red-500/20", badgeText: "Urgent" },
};

const AlertsSection = () => {
  const [alerts, setAlerts] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("alerts")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false });
      if (data) setAlerts(data);
    };
    load();
  }, []);

  if (alerts.length === 0) return null;

  return (
    <section id="alerts" className="py-16 md:py-24 bg-background relative overflow-hidden">
      {/* Cricket decorations */}
      <CricketBall className="absolute -top-8 left-[10%] w-40 h-40 text-primary" />
      <CricketBall className="absolute bottom-4 right-[5%] w-28 h-28 text-accent" />
      <CricketBat className="absolute top-1/3 -right-2 w-7 h-20 text-accent opacity-[0.06] rotate-12" />
      <CricketStumps className="absolute bottom-8 left-4 w-10 h-16 text-primary opacity-[0.05]" />

      <div className="container relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 rounded-full px-4 py-1.5 mb-3">
            <Megaphone size={14} className="text-accent" />
            <span className="text-xs font-display font-semibold text-accent uppercase tracking-wider">
              Notice Board
            </span>
          </div>
          <h2 className="font-heading text-3xl md:text-5xl font-bold">
            Alerts & <span className="text-gradient-gold">Notifications</span>
          </h2>
          <div className="flex items-center justify-center gap-3 mt-2">
            <CricketBat className="w-4 h-12 text-accent opacity-30" />
            <p className="text-muted-foreground text-sm md:text-base">
              Stay updated with all the latest announcements
            </p>
            <CricketBall className="w-5 h-5 text-primary opacity-30" />
          </div>
        </motion.div>

        {/* Notice Board */}
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            {/* Board frame */}
            <div className="rounded-2xl border-2 border-primary/20 bg-gradient-card shadow-card overflow-hidden">
              {/* Board header bar */}
              <div className="bg-gradient-accent px-5 py-3 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary-foreground/10 backdrop-blur-sm flex items-center justify-center border border-primary-foreground/20">
                  <Bell size={16} className="text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-heading text-sm font-bold text-primary-foreground uppercase tracking-wider">
                    BRL Notice Board
                  </h3>
                  <p className="text-[10px] text-primary-foreground/60 font-display">
                    Bihar Rural League • Official Updates
                  </p>
                </div>
                <div className="ml-auto flex items-center gap-1.5">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400" />
                  </span>
                  <span className="text-[10px] text-primary-foreground/70 font-display font-semibold uppercase tracking-wider">
                    Live
                  </span>
                </div>
              </div>

              {/* Pin decoration row */}
              <div className="flex justify-between px-6 -mb-2 relative z-10">
                {[0, 1].map((i) => (
                  <div key={i} className="w-5 h-5 rounded-full bg-primary/80 border-2 border-primary-foreground/30 shadow-md -mt-2.5" />
                ))}
              </div>

              {/* Alerts list */}
              <div className="p-4 md:p-6 space-y-0 divide-y divide-border/50">
                {alerts.map((alert, idx) => {
                  const type = (alert.alert_type as AlertType) || "info";
                  const config = alertConfig[type] || alertConfig.info;
                  const Icon = config.icon;

                  return (
                    <motion.div
                      key={alert.id}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.08, duration: 0.35 }}
                      className="flex items-start gap-3 md:gap-4 py-4 first:pt-2 last:pb-2 group"
                    >
                      {/* Numbered bullet with icon */}
                      <div className="flex flex-col items-center gap-1 flex-shrink-0 pt-0.5">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${config.badge} shadow-sm group-hover:scale-110 transition-transform`}>
                          <Icon size={16} />
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className={`inline-flex items-center gap-1 text-[10px] font-display font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${config.badge}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
                            {config.badgeText}
                          </span>
                          <span className="text-[10px] text-muted-foreground font-display tracking-wide">
                            {new Date(alert.created_at).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                        <p className="font-display text-sm md:text-[15px] text-foreground leading-relaxed">
                          {alert.message}
                        </p>
                      </div>

                      {/* Serial number */}
                      <div className="flex-shrink-0 w-7 h-7 rounded-full bg-secondary border border-border/60 flex items-center justify-center">
                        <span className="text-[11px] font-heading font-bold text-muted-foreground">
                          {idx + 1}
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Board footer */}
              <div className="bg-secondary/40 border-t border-border/50 px-5 py-2.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CricketBall className="w-4 h-4 text-primary opacity-40" />
                  <span className="text-[10px] text-muted-foreground font-display tracking-wider uppercase">
                    {alerts.length} Active {alerts.length === 1 ? "Notice" : "Notices"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CricketStumps className="w-3 h-5 text-accent opacity-30" />
                  <span className="text-[10px] text-muted-foreground font-display tracking-wider">
                    Updated {new Date(alerts[0]?.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AlertsSection;

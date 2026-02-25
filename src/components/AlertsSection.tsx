import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Bell, AlertTriangle, Info, CheckCircle, Megaphone } from "lucide-react";
import { CricketBat } from "./CricketDecorations";
import { supabase } from "@/integrations/supabase/client";

type AlertType = "info" | "warning" | "success" | "urgent";

const alertConfig: Record<AlertType, { icon: typeof Bell; dot: string; badge: string; badgeText: string }> = {
  info: { icon: Info, dot: "bg-blue-500", badge: "bg-blue-500/10 text-blue-600 border-blue-500/20", badgeText: "Info" },
  warning: { icon: AlertTriangle, dot: "bg-amber-500", badge: "bg-amber-500/10 text-amber-600 border-amber-500/20", badgeText: "Warning" },
  success: { icon: CheckCircle, dot: "bg-emerald-500", badge: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20", badgeText: "Update" },
  urgent: { icon: Bell, dot: "bg-red-500", badge: "bg-red-500/10 text-red-600 border-red-500/20", badgeText: "Urgent" },
};

/* Spiral binding holes along the top */
const SpiralBinding = ({ count = 14 }: { count?: number }) => (
  <div className="flex items-center justify-center gap-[6px] md:gap-3 px-4 py-3 relative z-10">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="flex flex-col items-center">
        {/* 3D spiral ring */}
        <div
          className="w-5 h-5 md:w-6 md:h-6 rounded-full relative"
          style={{
            background: `linear-gradient(145deg, hsl(0 0% 82%), hsl(0 0% 68%))`,
            boxShadow: `
              inset 1px 1px 2px hsl(0 0% 90%),
              inset -1px -1px 2px hsl(0 0% 50%),
              0 2px 4px hsl(0 0% 0% / 0.2),
              0 1px 2px hsl(0 0% 0% / 0.15)
            `,
          }}
        >
          {/* Inner hole */}
          <div
            className="absolute inset-[4px] md:inset-[5px] rounded-full"
            style={{
              background: `linear-gradient(180deg, hsl(0 0% 96%) 0%, hsl(0 0% 88%) 100%)`,
              boxShadow: `inset 0 1px 3px hsl(0 0% 0% / 0.15)`,
            }}
          />
          {/* Highlight gleam */}
          <div
            className="absolute top-[2px] left-[3px] w-[6px] h-[3px] rounded-full"
            style={{ background: `hsl(0 0% 100% / 0.5)` }}
          />
        </div>
        {/* Wire connecting into page */}
        <div
          className="w-[2.5px] h-2.5 -mt-[1px] rounded-b-sm"
          style={{
            background: `linear-gradient(90deg, hsl(0 0% 65%), hsl(0 0% 78%), hsl(0 0% 65%))`,
            boxShadow: `1px 0 2px hsl(0 0% 0% / 0.1)`,
          }}
        />
      </div>
    ))}
  </div>
);

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
          </div>
        </motion.div>

        {/* Notebook / Spiral Page */}
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            {/* Notebook page */}
            <div
              className="rounded-2xl overflow-hidden"
              style={{
                boxShadow: "0 8px 40px -12px hsl(var(--primary) / 0.12), 0 2px 12px -4px rgba(0,0,0,0.08)",
              }}
            >
              {/* Spiral binding at top */}
              <div className="bg-secondary/60 border-b border-border/40">
                <SpiralBinding />
              </div>

              {/* Page header strip */}
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

              {/* Ruled page content */}
              <div
                className="bg-card relative"
                style={{
                  backgroundImage: `repeating-linear-gradient(
                    to bottom,
                    transparent,
                    transparent 31px,
                    hsl(var(--border) / 0.35) 31px,
                    hsl(var(--border) / 0.35) 32px
                  )`,
                  backgroundSize: "100% 32px",
                  backgroundPositionY: "16px",
                }}
              >
                {/* Red margin line */}
                <div
                  className="absolute top-0 bottom-0 left-[52px] md:left-[68px] w-[1px]"
                  style={{ background: "hsl(0, 70%, 65%, 0.25)" }}
                />

                <div className="p-4 md:p-6 space-y-0 divide-y divide-border/30">
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
                        {/* Numbered bullet */}
                        <div className="flex-shrink-0 w-8 md:w-10 flex items-center justify-center pt-0.5">
                          <div className={`w-8 h-8 md:w-9 md:h-9 rounded-xl flex items-center justify-center border ${config.badge} shadow-sm group-hover:scale-110 transition-transform`}>
                            <Icon size={15} />
                          </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0 pl-2 md:pl-4">
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
              </div>

              {/* Board footer */}
              <div className="bg-secondary/40 border-t border-border/50 px-5 py-2.5 flex items-center justify-between">
                <span className="text-[10px] text-muted-foreground font-display tracking-wider uppercase">
                  {alerts.length} Active {alerts.length === 1 ? "Notice" : "Notices"}
                </span>
                <span className="text-[10px] text-muted-foreground font-display tracking-wider">
                  Updated {new Date(alerts[0]?.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AlertsSection;

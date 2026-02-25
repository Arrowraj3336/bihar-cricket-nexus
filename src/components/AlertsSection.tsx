import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, AlertTriangle, Info, CheckCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type AlertType = "info" | "warning" | "success" | "urgent";

const alertStyles: Record<AlertType, { icon: typeof Bell; bg: string; border: string; iconColor: string; glow: string }> = {
  info: { icon: Info, bg: "bg-blue-500/5", border: "border-blue-500/20", iconColor: "text-blue-500", glow: "shadow-blue-500/10" },
  warning: { icon: AlertTriangle, bg: "bg-amber-500/5", border: "border-amber-500/20", iconColor: "text-amber-500", glow: "shadow-amber-500/10" },
  success: { icon: CheckCircle, bg: "bg-emerald-500/5", border: "border-emerald-500/20", iconColor: "text-emerald-500", glow: "shadow-emerald-500/10" },
  urgent: { icon: Bell, bg: "bg-red-500/5", border: "border-red-500/20", iconColor: "text-red-500", glow: "shadow-red-500/10" },
};

const AlertsSection = () => {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);

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

  useEffect(() => {
    if (alerts.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIdx((i) => (i + 1) % alerts.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [alerts.length]);

  if (alerts.length === 0) return null;

  const current = alerts[currentIdx];
  const type = (current.alert_type as AlertType) || "info";
  const style = alertStyles[type] || alertStyles.info;
  const Icon = style.icon;

  return (
    <section className="py-10 md:py-14 bg-background relative overflow-hidden">
      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-6"
        >
          <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 rounded-full px-4 py-1.5 mb-3">
            <Bell size={14} className="text-accent" />
            <span className="text-xs font-display font-semibold text-accent uppercase tracking-wider">
              Alerts & Notifications
            </span>
          </div>
          <h2 className="font-heading text-2xl md:text-4xl font-bold">
            Latest <span className="text-gradient-gold">Updates</span>
          </h2>
        </motion.div>

        <div className="max-w-3xl mx-auto relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.3 }}
              className={`${style.bg} ${style.border} border rounded-2xl p-5 md:p-6 shadow-lg ${style.glow}`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-xl ${style.bg} border ${style.border} flex items-center justify-center flex-shrink-0`}>
                  <Icon size={20} className={style.iconColor} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-display text-sm md:text-base text-foreground leading-relaxed">
                    {current.message}
                  </p>
                  <p className="text-[10px] text-muted-foreground font-display mt-2 uppercase tracking-wider">
                    {new Date(current.created_at).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {alerts.length > 1 && (
            <div className="flex items-center justify-center gap-3 mt-4">
              <button
                onClick={() => setCurrentIdx((i) => (i - 1 + alerts.length) % alerts.length)}
                className="w-8 h-8 rounded-full bg-secondary border border-border/50 flex items-center justify-center hover:bg-secondary/80 transition-colors"
              >
                <ChevronLeft size={14} className="text-muted-foreground" />
              </button>
              <div className="flex gap-1.5">
                {alerts.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentIdx(i)}
                    className={`h-2 rounded-full transition-all ${i === currentIdx ? "w-6 bg-accent" : "w-2 bg-border"}`}
                  />
                ))}
              </div>
              <button
                onClick={() => setCurrentIdx((i) => (i + 1) % alerts.length)}
                className="w-8 h-8 rounded-full bg-secondary border border-border/50 flex items-center justify-center hover:bg-secondary/80 transition-colors"
              >
                <ChevronRight size={14} className="text-muted-foreground" />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default AlertsSection;

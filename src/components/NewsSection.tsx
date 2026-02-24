import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Newspaper, Bell, Pin, ChevronRight, Megaphone } from "lucide-react";
import { CricketBall, CricketBat } from "./CricketDecorations";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

const NewsSection = () => {
  const [news, setNews] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("news")
        .select("*")
        .order("is_pinned", { ascending: false })
        .order("created_at", { ascending: false })
        .limit(10);
      if (data) setNews(data);
    };
    load();
  }, []);

  if (news.length === 0) return null;

  const pinnedNews = news.filter((n) => n.is_pinned);
  const regularNews = news.filter((n) => !n.is_pinned);
  const tickerItems = [...news, ...news]; // duplicate for seamless loop

  return (
    <section className="py-16 md:py-24 bg-background relative overflow-hidden">
      <CricketBall className="absolute -top-8 right-10 w-32 h-32 text-primary opacity-[0.04]" />
      <CricketBat className="absolute bottom-10 -left-4 w-8 h-24 text-accent opacity-[0.06] rotate-12" />

      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 mb-3">
            <Megaphone size={14} className="text-primary" />
            <span className="text-xs font-display font-semibold text-primary uppercase tracking-wider">
              News & Updates
            </span>
          </div>
          <h2 className="font-heading text-3xl md:text-5xl font-bold mb-2">
            Latest <span className="text-gradient-gold">News</span>
          </h2>
          <p className="text-muted-foreground text-sm md:text-base">
            Stay updated with tournament announcements
          </p>
        </motion.div>

        {/* 3D Scoreboard Style Ticker */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <div className="relative rounded-2xl overflow-hidden border border-border/60 shadow-card">
            {/* Scoreboard top bar */}
            <div className="bg-gradient-accent px-4 py-2.5 flex items-center gap-2">
              <div className="flex gap-1">
                <span className="w-2 h-2 rounded-full bg-cricket-gold animate-pulse" />
                <span className="w-2 h-2 rounded-full bg-primary-foreground/40" />
                <span className="w-2 h-2 rounded-full bg-primary-foreground/40" />
              </div>
              <Bell size={14} className="text-primary-foreground ml-2" />
              <span className="font-heading text-xs font-bold text-primary-foreground uppercase tracking-widest">
                Live Updates
              </span>
            </div>

            {/* Ticker content - scoreboard style */}
            <div className="bg-secondary/80 border-t border-border/30 overflow-hidden relative">
              {/* 3D depth effect */}
              <div className="absolute inset-0 bg-gradient-to-b from-foreground/[0.02] to-transparent pointer-events-none" />
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent" />

              <div className="overflow-hidden py-3">
                <div
                  className="flex whitespace-nowrap"
                  style={{
                    animation: "marquee 30s linear infinite",
                    width: "fit-content",
                  }}
                >
                  {tickerItems.map((item, i) => (
                    <span key={i} className="inline-flex items-center gap-2 mx-6">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                      <span className="font-display text-sm font-semibold text-foreground">
                        {item.title}
                      </span>
                      <span className="text-muted-foreground text-xs">•</span>
                      <span className="font-display text-xs text-muted-foreground">
                        {item.content.length > 60
                          ? item.content.slice(0, 60) + "…"
                          : item.content}
                      </span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* News Cards - 3D Scoreboard Style */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {news.slice(0, 6).map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <div className="relative group h-full">
                {/* 3D scoreboard card */}
                <div className="relative rounded-xl overflow-hidden border border-border/60 bg-gradient-card shadow-card hover:shadow-glow transition-all duration-500 h-full flex flex-col">
                  {/* Scoreboard header strip */}
                  <div className="h-1 w-full bg-gradient-to-r from-primary via-accent to-primary" />

                  {/* 3D top edge */}
                  <div className="h-6 bg-gradient-to-b from-secondary to-card relative">
                    <div className="absolute inset-x-0 bottom-0 h-px bg-border/30" />
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 flex gap-1">
                      <div className="w-1 h-1 rounded-full bg-primary/40" />
                      <div className="w-1 h-1 rounded-full bg-accent/40" />
                    </div>
                    {item.is_pinned && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <Pin size={10} className="text-primary fill-primary" />
                      </div>
                    )}
                  </div>

                  <div className="p-4 flex-1 flex flex-col">
                    {/* Category badge */}
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[10px] font-display font-bold uppercase tracking-widest bg-primary/10 text-primary px-2 py-0.5 rounded">
                        {item.category}
                      </span>
                      <span className="text-[10px] text-muted-foreground font-display">
                        {format(new Date(item.created_at), "dd MMM yyyy")}
                      </span>
                    </div>

                    <h3 className="font-heading text-base font-bold mb-2 leading-snug group-hover:text-primary transition-colors">
                      {item.title}
                    </h3>

                    <p className="text-sm text-muted-foreground flex-1 leading-relaxed">
                      {item.content.length > 120
                        ? item.content.slice(0, 120) + "…"
                        : item.content}
                    </p>

                    <div className="mt-3 flex items-center gap-1 text-primary text-xs font-display font-semibold">
                      <span>Read More</span>
                      <ChevronRight size={12} />
                    </div>
                  </div>

                  {/* 3D bottom edge */}
                  <div className="h-1.5 bg-gradient-to-t from-secondary to-card relative">
                    <div className="absolute inset-x-0 top-0 h-px bg-border/30" />
                  </div>

                  {/* Bottom scoreboard strip */}
                  <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewsSection;

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Camera, Sparkles, ArrowRight } from "lucide-react";
import { CricketBall, CricketBat } from "./CricketDecorations";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";

// Static fallback images
import gallery1 from "@/assets/gallery-1.jpg";
import gallery2 from "@/assets/gallery-2.jpg";
import gallery3 from "@/assets/gallery-3.jpg";
import gallery4 from "@/assets/gallery-4.jpg";
import gallery5 from "@/assets/gallery-5.jpg";
import gallery6 from "@/assets/gallery-6.jpg";
import gallery7 from "@/assets/gallery-7.jpg";

const fallbackImages = [
  { src: gallery1, alt: "Team group photo" },
  { src: gallery2, alt: "Player gathering" },
  { src: gallery3, alt: "Guest speech" },
  { src: gallery4, alt: "Scoring table" },
  { src: gallery5, alt: "Organiser at ground" },
  { src: gallery6, alt: "Net practice bowling" },
  { src: gallery7, alt: "Batsman in nets" },
];

const GallerySection = () => {
  const [images, setImages] = useState<{ src: string; alt: string }[]>(fallbackImages);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("gallery_images")
        .select("*")
        .eq("show_on_homepage", true)
        .order("created_at", { ascending: false })
        .limit(7);
      
      if (data && data.length > 0) {
        setImages(data.map(img => ({ src: img.image_url, alt: img.alt_text || "Gallery photo" })));
      }
    };
    load();
  }, []);

  return (
    <section id="gallery" className="py-16 md:py-24 bg-secondary/30 relative overflow-hidden">
      <CricketBall className="absolute -bottom-8 -right-8 w-40 h-40 text-primary" />
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 mb-3">
            <Camera size={14} className="text-primary" />
            <span className="text-xs font-display font-semibold text-primary uppercase tracking-wider">Memories</span>
          </div>
          <h2 className="font-heading text-3xl md:text-5xl font-bold mb-2">
            Tournament <span className="text-gradient-gold">Gallery</span>
          </h2>
          <div className="flex items-center justify-center gap-3 mt-1">
            <CricketBat className="w-4 h-12 text-primary opacity-30" />
            <p className="text-muted-foreground text-sm md:text-base">Capturing the best moments</p>
            <Sparkles size={16} className="text-accent opacity-40" />
          </div>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {images.map((img, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className={`relative overflow-hidden rounded-xl group ${i === 0 ? "col-span-2 row-span-2" : ""}`}
            >
              <img src={img.src} alt={img.alt} loading="lazy"
                className="w-full h-full object-cover aspect-video group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                <span className="font-heading text-sm font-semibold text-background">{img.alt}</span>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link to="/gallery"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-accent text-primary-foreground font-heading font-semibold text-sm tracking-wider uppercase shadow-glow hover:opacity-90 transition-opacity">
            View Full Gallery <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default GallerySection;

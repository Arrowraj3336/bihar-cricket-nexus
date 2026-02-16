import { motion } from "framer-motion";
import { Camera, Sparkles } from "lucide-react";
import { CricketBall, CricketBat } from "./CricketDecorations";
import gallery1 from "@/assets/gallery-1.jpg";
import gallery2 from "@/assets/gallery-2.jpg";
import gallery3 from "@/assets/gallery-3.jpg";
import gallery4 from "@/assets/gallery-4.jpg";
import gallery5 from "@/assets/gallery-5.jpg";

const images = [
  { src: gallery1, alt: "Team celebration" },
  { src: gallery2, alt: "Batsman cover drive" },
  { src: gallery3, alt: "Fast bowling action" },
  { src: gallery4, alt: "Trophy ceremony" },
  { src: gallery5, alt: "Stadium crowd" },
];

const GallerySection = () => {
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
            <Camera size={14} className="text-accent" />
            <span className="text-xs font-display font-semibold text-accent uppercase tracking-wider">Memories</span>
          </div>
          <h2 className="font-heading text-3xl md:text-5xl font-bold mb-2">
            Tournament <span className="text-gradient-gold">Gallery</span>
          </h2>
          <div className="flex items-center justify-center gap-3 mt-1">
            <CricketBat className="w-4 h-12 text-accent opacity-30" />
            <p className="text-muted-foreground text-sm md:text-base">Capturing the best moments</p>
            <Sparkles size={16} className="text-accent opacity-40" />
          </div>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {images.map((img, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className={`relative overflow-hidden rounded-xl group ${
                i === 0 ? "col-span-2 md:col-span-2 row-span-2" : ""
              }`}
            >
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-full object-cover aspect-video group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                <span className="font-heading text-sm font-semibold">{img.alt}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GallerySection;

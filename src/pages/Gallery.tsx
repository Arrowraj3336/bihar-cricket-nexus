import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Camera, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const GalleryPage = () => {
  const [images, setImages] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from("gallery_images").select("*").order("created_at", { ascending: false });
      if (data) setImages(data);
    };
    load();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container">
          <div className="flex items-center gap-3 mb-8">
            <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft size={20} />
            </Link>
            <div>
              <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 mb-2">
                <Camera size={14} className="text-primary" />
                <span className="text-xs font-display font-semibold text-primary uppercase tracking-wider">Full Gallery</span>
              </div>
              <h1 className="font-heading text-3xl md:text-5xl font-bold">
                Tournament <span className="text-gradient-gold">Gallery</span>
              </h1>
            </div>
          </div>

          {images.length === 0 ? (
            <p className="text-center text-muted-foreground py-20">No photos uploaded yet.</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
              {images.map((img, i) => (
                <motion.div
                  key={img.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="relative overflow-hidden rounded-xl group"
                >
                  <img
                    src={img.image_url}
                    alt={img.alt_text || "Gallery photo"}
                    loading="lazy"
                    className="w-full h-full object-cover aspect-square group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <span className="font-heading text-sm font-semibold text-background">{img.alt_text}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default GalleryPage;

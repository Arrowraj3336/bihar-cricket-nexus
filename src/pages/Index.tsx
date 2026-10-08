import Navbar from "@/components/Navbar";

import HeroSection from "@/components/HeroSection";
import TeamsSection from "@/components/TeamsSection";
import UpcomingMatches from "@/components/UpcomingMatches";
import TopPerformers from "@/components/TopPerformers";
import AlertsSection from "@/components/AlertsSection";
import GallerySection from "@/components/GallerySection";
import OrganiserSection from "@/components/OrganiserSection";
import Footer from "@/components/Footer";
import HomeBootLoader from "@/components/HomeBootLoader";
import HomeOpenerControls from "@/components/HomeOpenerControls";
import { useState } from "react";
import { useVisitorTracking } from "@/hooks/useVisitorTracking";

const Index = () => {
  useVisitorTracking();
  const [replayCount, setReplayCount] = useState(0);

  return (
    <div className="min-h-screen bg-background">
      <HomeBootLoader key={replayCount} replay={replayCount > 0} />
      <HomeOpenerControls onReplay={() => setReplayCount((count) => count + 1)} />
      <Navbar />
      <HeroSection />
      <TeamsSection />
      <UpcomingMatches />
      <TopPerformers />
      <AlertsSection />
      <GallerySection />
      <OrganiserSection />
      <Footer />
    </div>
  );
};

export default Index;

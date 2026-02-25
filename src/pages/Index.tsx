import Navbar from "@/components/Navbar";
import CricketLoader from "@/components/CricketLoader";
import HeroSection from "@/components/HeroSection";
import TeamsSection from "@/components/TeamsSection";
import UpcomingMatches from "@/components/UpcomingMatches";
import TopPerformers from "@/components/TopPerformers";
import GallerySection from "@/components/GallerySection";
import OrganiserSection from "@/components/OrganiserSection";
import Footer from "@/components/Footer";
import { useVisitorTracking } from "@/hooks/useVisitorTracking";

const Index = () => {
  useVisitorTracking();

  return (
    <div className="min-h-screen bg-background">
      <CricketLoader />
      <Navbar />
      <HeroSection />
      <TeamsSection />
      <UpcomingMatches />
      <TopPerformers />
      <GallerySection />
      <OrganiserSection />
      <Footer />
    </div>
  );
};

export default Index;

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import HostingServer from "./pages/HostingServer";
import Admin from "./pages/Admin";

// NOTE: The public site is temporarily hidden. All pages below still exist
// (Index, Members, Contact, Gallery, TeamDetail, CalendarPage) and can be
// restored by re-enabling their routes.

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<HostingServer />} />
          {/* Admin remains reachable for site management */}
          <Route path="/brl-admin-panel" element={<Admin />} />
          {/* Every other page is hidden while the site is being updated */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

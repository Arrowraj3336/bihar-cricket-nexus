import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

const getDeviceType = (ua: string): string => {
  if (/mobile/i.test(ua)) return "mobile";
  if (/tablet|ipad/i.test(ua)) return "tablet";
  return "desktop";
};

// Indian states list for mapping from timezone / rough geo
const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Delhi", "Jammu and Kashmir", "Ladakh",
];

export const useVisitorTracking = () => {
  useEffect(() => {
    const track = async () => {
      try {
        const sessionKey = "brl_visitor_tracked";
        if (sessionStorage.getItem(sessionKey)) return;
        sessionStorage.setItem(sessionKey, "1");

        const ua = navigator.userAgent;
        const deviceType = getDeviceType(ua);

        // Try to get location from a free API
        let state = "Unknown";
        let city = "Unknown";
        let country = "India";

        try {
          const geoRes = await fetch("https://ipapi.co/json/", { signal: AbortSignal.timeout(3000) });
          if (geoRes.ok) {
            const geo = await geoRes.json();
            state = geo.region || "Unknown";
            city = geo.city || "Unknown";
            country = geo.country_name || "Unknown";
          }
        } catch {
          // silently fail - geo is optional
        }

        await supabase.from("visitor_logs").insert({
          page: window.location.pathname,
          referrer: document.referrer || null,
          user_agent: ua.slice(0, 500),
          state,
          city,
          country,
          device_type: deviceType,
        });
      } catch {
        // silently fail
      }
    };

    track();
  }, []);
};

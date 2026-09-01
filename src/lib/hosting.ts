/**
 * Single source of truth for the hosting plan expiry.
 * Update this ISO date (IST) whenever the hosting plan is renewed.
 */
export const HOSTING_EXPIRY_ISO = "2026-09-02T00:00:00+05:30";
export const HOSTING_EXPIRY_DATE = new Date(HOSTING_EXPIRY_ISO);

export const HOSTING_EXPIRY_LABEL = HOSTING_EXPIRY_DATE.toLocaleDateString("en-IN", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "Asia/Kolkata",
});

export type HostingTimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalHours: number;
  expired: boolean;
};

export const getHostingTimeLeft = (): HostingTimeLeft => {
  const remaining = Math.max(HOSTING_EXPIRY_DATE.getTime() - Date.now(), 0);
  return {
    days: Math.floor(remaining / 86_400_000),
    hours: Math.floor((remaining / 3_600_000) % 24),
    minutes: Math.floor((remaining / 60_000) % 60),
    seconds: Math.floor((remaining / 1_000) % 60),
    totalHours: Math.floor(remaining / 3_600_000),
    expired: remaining <= 0,
  };
};

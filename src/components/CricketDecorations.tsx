const CricketBall = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="2" opacity="0.15" />
    <path d="M25 20 Q50 50 25 80" stroke="currentColor" strokeWidth="1.5" opacity="0.2" strokeLinecap="round" />
    <path d="M75 20 Q50 50 75 80" stroke="currentColor" strokeWidth="1.5" opacity="0.2" strokeLinecap="round" />
    {/* Seam stitches */}
    {[22, 30, 38, 46, 54, 62, 70, 78].map((y) => (
      <line key={`l-${y}`} x1="23" y1={y} x2="28" y2={y - 2} stroke="currentColor" strokeWidth="1" opacity="0.15" />
    ))}
    {[22, 30, 38, 46, 54, 62, 70, 78].map((y) => (
      <line key={`r-${y}`} x1="72" y1={y} x2="77" y2={y - 2} stroke="currentColor" strokeWidth="1" opacity="0.15" />
    ))}
  </svg>
);

const CricketBat = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 60 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="22" y="0" width="16" height="60" rx="3" stroke="currentColor" strokeWidth="1.5" opacity="0.12" />
    <rect x="15" y="60" width="30" height="100" rx="5" stroke="currentColor" strokeWidth="1.5" opacity="0.12" />
    <rect x="18" y="160" width="24" height="10" rx="2" stroke="currentColor" strokeWidth="1" opacity="0.1" />
  </svg>
);

const CricketStumps = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 80 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <line x1="20" y1="15" x2="20" y2="110" stroke="currentColor" strokeWidth="2" opacity="0.12" />
    <line x1="40" y1="15" x2="40" y2="110" stroke="currentColor" strokeWidth="2" opacity="0.12" />
    <line x1="60" y1="15" x2="60" y2="110" stroke="currentColor" strokeWidth="2" opacity="0.12" />
    {/* Bails */}
    <rect x="15" y="10" width="15" height="5" rx="2" stroke="currentColor" strokeWidth="1" opacity="0.15" />
    <rect x="50" y="10" width="15" height="5" rx="2" stroke="currentColor" strokeWidth="1" opacity="0.15" />
  </svg>
);

export { CricketBall, CricketBat, CricketStumps };

const OpenerCricketBall = () => (
  <svg viewBox="0 0 160 160" className="home-cartoon-ball h-full w-full" aria-hidden="true">
    <defs>
      <radialGradient id="opener-leather" cx="32%" cy="25%" r="80%">
        <stop offset="0" stopColor="hsl(var(--opener-ball-highlight))" />
        <stop offset="0.5" stopColor="hsl(var(--opener-ball))" />
        <stop offset="1" stopColor="hsl(var(--opener-ball-shadow))" />
      </radialGradient>
      <clipPath id="opener-ball-clip"><circle cx="80" cy="80" r="72" /></clipPath>
    </defs>
    <circle cx="80" cy="80" r="73" fill="hsl(var(--opener-ball-shadow))" />
    <circle cx="80" cy="80" r="70" fill="url(#opener-leather)" />
    <g clipPath="url(#opener-ball-clip)" fill="none" strokeLinecap="round">
      <path d="M104 2 C40 35 40 125 104 158" stroke="hsl(var(--opener-ball-shadow))" strokeWidth="14" />
      <path d="M101 2 C37 35 37 125 101 158" stroke="hsl(var(--opener-stitch))" strokeWidth="3" strokeDasharray="3 7" />
      <path d="M110 2 C46 35 46 125 110 158" stroke="hsl(var(--opener-stitch))" strokeWidth="3" strokeDasharray="3 7" />
      <path d="M106 2 C42 35 42 125 106 158" stroke="hsl(var(--opener-stitch))" strokeWidth="1.5" opacity="0.65" />
      <path d="M30 49 Q38 28 58 24" stroke="hsl(var(--opener-stitch))" strokeWidth="7" opacity="0.65" />
      <path d="M107 126 Q126 118 132 99" stroke="hsl(var(--opener-ball-shadow))" strokeWidth="6" opacity="0.4" />
    </g>
  </svg>
);

export default OpenerCricketBall;
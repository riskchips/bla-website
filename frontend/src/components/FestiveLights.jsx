import React from 'react';
import '../styles/bengali-decorations.css';

const HangingLamp = ({ delay, left, topOffset = 0 }) => (
  <div className="hanging-lamp-container" style={{ left, animationDelay: delay, top: topOffset }}>
    {/* The string holding the lamp */}
    <div className="lamp-string"></div>
    {/* The lamp itself */}
    <div className="lamp-body">
      <svg width="24" height="40" viewBox="0 0 24 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Top ring/hanger */}
        <circle cx="12" cy="4" r="3" stroke="var(--gold)" strokeWidth="1.5" fill="none" />
        {/* Main lamp body (traditional shape) */}
        <path d="M12 7 L16 18 L20 22 C20 26 18 30 12 32 C6 30 4 26 4 22 L8 18 Z" fill="var(--gold)" />
        {/* Details/engravings */}
        <path d="M8 22 C8 25 10 27 12 27 C14 27 16 25 16 22" stroke="var(--ink)" strokeWidth="1" strokeOpacity="0.3" fill="none" />
        <path d="M12 32 L12 38" stroke="var(--gold)" strokeWidth="2" />
        <circle cx="12" cy="39" r="1.5" fill="var(--maroon)" />
      </svg>
      {/* The glowing flame positioned on top of the lamp body */}
      <div className="lamp-flame"></div>
      <div className="lamp-halo"></div>
    </div>
  </div>
);

const FestiveLights = () => {
  // We place lamps at different horizontal positions with varying animation delays for an organic feel
  const lamps = [
    { left: '8%', delay: '0s', topOffset: '5px' },
    { left: '22%', delay: '1.2s', topOffset: '15px' },
    { left: '38%', delay: '0.5s', topOffset: '5px' },
    { left: '50%', delay: '2.4s', topOffset: '18px' },
    { left: '62%', delay: '0.9s', topOffset: '5px' },
    { left: '78%', delay: '2.1s', topOffset: '15px' },
    { left: '92%', delay: '1.5s', topOffset: '5px' },
  ];

  return (
    <div className="festive-lights-wrapper">
      <div className="festive-garland">
        {/* A repeating soft garland SVG */}
        <svg width="100%" height="40" preserveAspectRatio="none" viewBox="0 0 1000 40" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,0 Q62.5,25 125,0 T250,0 T375,0 T500,0 T625,0 T750,0 T875,0 T1000,0" fill="none" stroke="var(--gold)" strokeWidth="1.5" strokeDasharray="6 4" opacity="0.4"/>
        </svg>
      </div>
      {lamps.map((lamp, i) => (
        <HangingLamp key={i} left={lamp.left} delay={lamp.delay} topOffset={lamp.topOffset} />
      ))}
    </div>
  );
};

export default FestiveLights;

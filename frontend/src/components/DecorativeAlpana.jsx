import React from 'react';
import '../styles/bengali-decorations.css';

const AlpanaMotif = ({ className }) => (
  <svg 
    viewBox="0 0 100 100" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={`alpana-svg ${className}`}
  >
    {/* Center Dot */}
    <circle cx="50" cy="50" r="3" fill="var(--gold)" />
    {/* Inner Circle */}
    <circle cx="50" cy="50" r="10" stroke="var(--gold)" strokeWidth="1.5" strokeDasharray="2 2" />
    {/* Petals */}
    <path d="M50 40 C55 20 65 25 50 10 C35 25 45 20 50 40 Z" fill="none" stroke="var(--gold)" strokeWidth="1.5" />
    <path d="M50 60 C55 80 65 75 50 90 C35 75 45 80 50 60 Z" fill="none" stroke="var(--gold)" strokeWidth="1.5" />
    <path d="M60 50 C80 45 75 35 90 50 C75 65 80 55 60 50 Z" fill="none" stroke="var(--gold)" strokeWidth="1.5" />
    <path d="M40 50 C20 45 25 35 10 50 C25 65 20 55 40 50 Z" fill="none" stroke="var(--gold)" strokeWidth="1.5" />
    
    {/* Diagonal smaller petals */}
    <path d="M57 43 C70 30 75 35 80 20 C65 25 70 30 57 43 Z" fill="none" stroke="var(--gold)" strokeWidth="1" opacity="0.8" />
    <path d="M43 57 C30 70 25 65 20 80 C35 75 30 70 43 57 Z" fill="none" stroke="var(--gold)" strokeWidth="1" opacity="0.8" />
    <path d="M57 57 C70 70 75 65 80 80 C65 75 70 70 57 57 Z" fill="none" stroke="var(--gold)" strokeWidth="1" opacity="0.8" />
    <path d="M43 43 C30 30 25 35 20 20 C35 25 30 30 43 43 Z" fill="none" stroke="var(--gold)" strokeWidth="1" opacity="0.8" />

    {/* Outer decorative dots */}
    <circle cx="50" cy="5" r="1.5" fill="var(--gold)" />
    <circle cx="50" cy="95" r="1.5" fill="var(--gold)" />
    <circle cx="95" cy="50" r="1.5" fill="var(--gold)" />
    <circle cx="5" cy="50" r="1.5" fill="var(--gold)" />
    <circle cx="85" cy="15" r="1.5" fill="var(--gold)" />
    <circle cx="15" cy="85" r="1.5" fill="var(--gold)" />
    <circle cx="85" cy="85" r="1.5" fill="var(--gold)" />
    <circle cx="15" cy="15" r="1.5" fill="var(--gold)" />
  </svg>
);

const DecorativeAlpana = () => {
  return (
    <div className="decorative-alpana-wrapper">
      {/* 
        We use pointer-events: none in CSS to ensure it doesn't block clicks.
        We place one in the bottom-left and one in the bottom-right.
      */}
      <div className="alpana-corner bottom-left">
        <AlpanaMotif className="spin-slowly" />
      </div>
      <div className="alpana-corner bottom-right">
        <AlpanaMotif className="spin-slowly-reverse" />
      </div>
    </div>
  );
};

export default DecorativeAlpana;

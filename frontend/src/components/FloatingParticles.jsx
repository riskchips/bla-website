import { useEffect, useState } from 'react';

// Bengali letters and cultural symbols to float
const SYMBOLS = [
  'ক', 'খ', 'গ', 'ঘ', 'ঙ', 'চ', 'ছ', 'জ', 'ঝ',
  'ট', 'ঠ', 'ড', 'ঢ', 'ণ', 'ত', 'থ', 'দ', 'ধ', 'ন',
  'প', 'ফ', 'ব', 'ভ', 'ম', 'য', 'র', 'ল',
  'শ', 'ষ', 'স', 'হ',
  '❁', '❋', '✾', '⚘', '🪷',
];

const FloatingParticles = ({ count = 20 }) => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const generated = Array.from({ length: count }, (_, i) => ({
      id: i,
      char: SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
      left: Math.random() * 100,
      duration: 15 + Math.random() * 25, // 15–40 seconds
      delay: Math.random() * 20,
      size: 0.8 + Math.random() * 1.5,  // 0.8rem – 2.3rem
    }));
    setParticles(generated);
  }, [count]);

  return (
    <div className="floating-particles" aria-hidden="true">
      {particles.map((p) => (
        <span
          key={p.id}
          className="floating-particle"
          style={{
            left: `${p.left}%`,
            fontSize: `${p.size}rem`,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        >
          {p.char}
        </span>
      ))}
    </div>
  );
};

export default FloatingParticles;

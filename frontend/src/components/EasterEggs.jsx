import { useEffect, useState, useRef, useCallback } from 'react';

// ── Tagore quotes for Konami code ────────────────────────────
const TAGORE_QUOTES = [
  'যেখানে দেখিবে ছাই, উড়াইয়া দেখ তাই, পাইলেও পাইতে পার অমূল্য রতন।',
  'চিত্ত যেথা ভয়শূন্য, উচ্চ যেথা শির।',
  'আমার মাথা নত করে দাও হে তোমার চরণধুলার তলে।',
];

// ── Bengali consonants for confetti ──────────────────────────
const BN_LETTERS = [
  'ক', 'খ', 'গ', 'ঘ', 'চ', 'ছ', 'জ', 'ঝ', 'ট', 'ঠ',
  'ড', 'ঢ', 'ণ', 'ত', 'থ', 'দ', 'ধ', 'ন', 'প', 'ফ',
  'ব', 'ভ', 'ম', 'য', 'র', 'ল', 'শ', 'ষ', 'স', 'হ',
];

const CONFETTI_COLORS = ['#B8893A', '#C4533A', '#6B1D1D', '#D9B06B', '#7A1F1A'];

const PETAL_CHARS = ['🌸', '🪷', '❁', '✾', '⚘', '🌺'];

// ── Konami sequence ──────────────────────────────────────────
const KONAMI = [
  'ArrowUp', 'ArrowUp',
  'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight',
  'ArrowLeft', 'ArrowRight',
  'KeyB', 'KeyA',
];

const EasterEggs = () => {
  // ── State ──────────────────────────────────────────────────
  const [showTagore, setShowTagore] = useState(false);
  const [tagoreQuote, setTagoreQuote] = useState('');
  const [petals, setPetals] = useState([]);

  const [showDhak, setShowDhak] = useState(false);

  const [confettiLetters, setConfettiLetters] = useState([]);
  const [showConfetti, setShowConfetti] = useState(false);

  const [footerVisible, setFooterVisible] = useState(false);

  const [showRosogolla, setShowRosogolla] = useState(false);
  const [rosogollas, setRosogollas] = useState([]);

  const [showUlu, setShowUlu] = useState(false);

  // ── Refs ───────────────────────────────────────────────────
  const konamiIndex = useRef(0);
  const typedBuffer = useRef('');
  const sentinelRef = useRef(null);
  const clickCountRef = useRef(0);
  const clickTimerRef = useRef(null);

  // ═══════════════════════════════════════════════════════════
  //  (a) Konami Code  →  Tagore quote + petal rain
  // ═══════════════════════════════════════════════════════════
  const triggerKonami = useCallback(() => {
    const quote = TAGORE_QUOTES[Math.floor(Math.random() * TAGORE_QUOTES.length)];
    setTagoreQuote(quote);

    // Generate petals
    const newPetals = Array.from({ length: 40 }, (_, i) => ({
      id: i,
      char: PETAL_CHARS[Math.floor(Math.random() * PETAL_CHARS.length)],
      left: Math.random() * 100,
      duration: 3 + Math.random() * 4,
      delay: Math.random() * 2,
      size: 1 + Math.random() * 1.5,
    }));
    setPetals(newPetals);
    setShowTagore(true);

    setTimeout(() => {
      setShowTagore(false);
      setPetals([]);
    }, 5000);
  }, []);

  useEffect(() => {
    const handleKonami = (e) => {
      if (e.code === KONAMI[konamiIndex.current]) {
        konamiIndex.current += 1;
        if (konamiIndex.current === KONAMI.length) {
          konamiIndex.current = 0;
          triggerKonami();
        }
      } else {
        konamiIndex.current = 0;
      }
    };
    window.addEventListener('keydown', handleKonami);
    return () => window.removeEventListener('keydown', handleKonami);
  }, [triggerKonami]);

  // ═══════════════════════════════════════════════════════════
  //  (b) Dhak Drumroll  →  triple-click on .hero
  // ═══════════════════════════════════════════════════════════
  useEffect(() => {
    const handleClick = (e) => {
      if (!e.target.closest('.hero')) return;

      clickCountRef.current += 1;

      if (clickTimerRef.current) clearTimeout(clickTimerRef.current);
      clickTimerRef.current = setTimeout(() => {
        clickCountRef.current = 0;
      }, 500);

      if (clickCountRef.current >= 3) {
        clickCountRef.current = 0;
        setShowDhak(true);
        setTimeout(() => setShowDhak(false), 2000);
      }
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  // ═══════════════════════════════════════════════════════════
  //  (c) Bengali Typing Confetti  →  type "bangla"
  // ═══════════════════════════════════════════════════════════
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key.length !== 1) return; // ignore modifier keys
      typedBuffer.current += e.key.toLowerCase();

      // Keep only the last 10 chars to avoid unbounded growth
      if (typedBuffer.current.length > 10) {
        typedBuffer.current = typedBuffer.current.slice(-10);
      }

      if (typedBuffer.current.includes('bangla')) {
        typedBuffer.current = '';
        triggerConfetti();
      } else if (typedBuffer.current.includes('sweet') || typedBuffer.current.includes('misti')) {
        typedBuffer.current = '';
        triggerRosogolla();
      } else if (typedBuffer.current.includes('ulu')) {
        typedBuffer.current = '';
        triggerUlu();
      }
    };

    const triggerConfetti = () => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;

      const letters = Array.from({ length: 35 }, (_, i) => {
        const angle = (Math.PI * 2 * i) / 35 + (Math.random() - 0.5) * 0.5;
        const radius = 120 + Math.random() * 200;
        return {
          id: i,
          char: BN_LETTERS[Math.floor(Math.random() * BN_LETTERS.length)],
          x: cx,
          y: cy,
          dx: Math.cos(angle) * radius,
          dy: Math.sin(angle) * radius - 60,
          color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
          size: 1.2 + Math.random() * 1.4,
          delay: Math.random() * 0.3,
        };
      });

      setConfettiLetters(letters);
      setShowConfetti(true);

      setTimeout(() => {
        setShowConfetti(false);
        setConfettiLetters([]);
      }, 3000);
    };

    const triggerRosogolla = () => {
      const sweets = Array.from({ length: 40 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        duration: 2 + Math.random() * 3,
        delay: Math.random() * 1.5,
        size: 20 + Math.random() * 30, // px width and height
      }));
      setRosogollas(sweets);
      setShowRosogolla(true);

      setTimeout(() => {
        setShowRosogolla(false);
        setRosogollas([]);
      }, 5000);
    };

    const triggerUlu = () => {
      setShowUlu(true);
      setTimeout(() => setShowUlu(false), 2000);
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  // ═══════════════════════════════════════════════════════════
  //  (d) Hidden Footer Scroll  →  Intersection Observer
  // ═══════════════════════════════════════════════════════════
  useEffect(() => {
    // Create and append a sentinel element at the very bottom of the page
    const sentinel = document.createElement('div');
    sentinel.style.height = '1px';
    sentinel.style.width = '100%';
    sentinel.style.pointerEvents = 'none';
    sentinel.setAttribute('aria-hidden', 'true');
    document.body.appendChild(sentinel);
    sentinelRef.current = sentinel;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setFooterVisible(true);
        }
      },
      { threshold: 1.0 }
    );

    observer.observe(sentinel);

    return () => {
      observer.disconnect();
      if (sentinelRef.current && sentinelRef.current.parentNode) {
        sentinelRef.current.parentNode.removeChild(sentinelRef.current);
      }
    };
  }, []);

  // ═══════════════════════════════════════════════════════════
  //  Render
  // ═══════════════════════════════════════════════════════════
  return (
    <>
      {/* ── (a) Konami: Tagore Overlay + Petal Rain ──────── */}
      {showTagore && (
        <>
          <div className="tagore-overlay">
            <div className="tagore-quote">{tagoreQuote}</div>
          </div>
          <div className="petal-rain" aria-hidden="true">
            {petals.map((p) => (
              <span
                key={p.id}
                className="petal"
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
        </>
      )}

      {/* ── (b) Dhak Drumroll ────────────────────────────── */}
      {showDhak && (
        <div className="dhak-overlay">
          <div className="dhak-drum">🥁</div>
          <div className="dhak-text">ঢাক বাজছে!</div>
        </div>
      )}

      {/* ── (c) Bengali Confetti ─────────────────────────── */}
      {showConfetti && (
        <div className="confetti-container" aria-hidden="true">
          {confettiLetters.map((l) => (
            <span
              key={l.id}
              className="confetti-letter"
              style={{
                left: l.x,
                top: l.y,
                fontSize: `${l.size}rem`,
                color: l.color,
                animationDelay: `${l.delay}s`,
                '--dx': `${l.dx}px`,
                '--dy': `${l.dy}px`,
              }}
            >
              {l.char}
            </span>
          ))}
        </div>
      )}

      {/* ── (d) Hidden Footer Message ────────────────────── */}
      {footerVisible && null}

      {/* ── (e) Rosogolla Rain ───────────────────────────── */}
      {showRosogolla && (
        <div className="rosogolla-rain" aria-hidden="true">
          {rosogollas.map((r) => (
            <div
              key={r.id}
              className="rosogolla"
              style={{
                left: `${r.left}%`,
                width: `${r.size}px`,
                height: `${r.size}px`,
                animationDuration: `${r.duration}s`,
                animationDelay: `${r.delay}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* ── (f) Ulu Dhwani ───────────────────────────────── */}
      {showUlu && (
        <div className="dhak-overlay">
          <div className="dhak-drum" style={{ fontSize: '5rem', animationDuration: '0.05s' }}>🗣️</div>
          <div className="dhak-text" style={{ fontSize: '3rem' }}>উলু উলু উলু!</div>
        </div>
      )}
    </>
  );
};

export default EasterEggs;

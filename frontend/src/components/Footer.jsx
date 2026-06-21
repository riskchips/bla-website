import { useState } from "react";
import { Link } from "react-router-dom";

const quotes = [
  {
    bn: "যদি তোর ডাক শুনে কেউ না আসে, তবে একলা চলো রে।",
    author: "রবীন্দ্রনাথ ঠাকুর",
  },
  {
    bn: "বল বীর, বল উন্নত মম শির।",
    author: "কাজী নজরুল ইসলাম",
  },
  {
    bn: "মানুষ মানুষের জন্য, জীবন জীবনের জন্য।",
    author: "কামিনী রায়",
  },
  {
    bn: "আমরা করব জয়, আমরা করব জয় নিশ্চয়।",
    author: "লোকগীতি",
  },
  {
    bn: "আমার সোনার বাংলা, আমি তোমায় ভালোবাসি।",
    author: "রবীন্দ্রনাথ ঠাকুর",
  },
];

const Footer = () => {
  const [quoteIndex, setQuoteIndex] = useState(0);

  const handleQuoteHover = () => {
    setQuoteIndex((prev) => (prev + 1) % quotes.length);
  };

  const currentQuote = quotes[quoteIndex];

  return (
    <footer className="footer">
      <div className="container">
        {/* Rotating Quote */}
        <div
          className="footer-quote-rotator"
          onMouseEnter={handleQuoteHover}
          style={{
            textAlign: "center",
            padding: "28px 20px 36px",
            marginBottom: 36,
            borderBottom: "1px solid var(--line)",
            cursor: "default",
            position: "relative",
          }}
        >
          <div
            style={{
              fontSize: "0.75rem",
              textTransform: "uppercase",
              letterSpacing: "0.2em",
              color: "var(--terracotta)",
              fontFamily: "var(--font-en-display)",
              marginBottom: 12,
            }}
          >
            ✾ Words of Wisdom ✾
          </div>
          <blockquote
            key={quoteIndex}
            style={{
              fontFamily: "var(--font-bn-display)",
              fontSize: "clamp(1.1rem, 2.2vw, 1.5rem)",
              color: "var(--deep-red)",
              fontStyle: "italic",
              lineHeight: 1.7,
              margin: "0 auto 8px",
              maxWidth: 600,
              animation: "quoteReveal 0.5s ease-out",
            }}
          >
            "{currentQuote.bn}"
          </blockquote>
          <cite
            key={`cite-${quoteIndex}`}
            style={{
              fontFamily: "var(--font-bn-body)",
              fontSize: "0.9rem",
              color: "var(--ink-soft)",
              fontStyle: "normal",
              animation: "quoteReveal 0.5s ease-out 0.1s both",
            }}
          >
            — {currentQuote.author}
          </cite>
          <div
            style={{
              fontSize: "0.7rem",
              color: "var(--ink-soft)",
              opacity: 0.5,
              marginTop: 10,
              fontFamily: "var(--font-en-body)",
            }}
          >
            hover to discover more
          </div>
        </div>

        <style>{`
          @keyframes quoteReveal {
            from { opacity: 0; transform: translateY(8px); }
            to   { opacity: 1; transform: translateY(0); }
          }
        `}</style>

        {/* Footer Grid */}
        <div className="footer-grid">
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginBottom: 12,
              }}
            >
              <img
                src="/assets/logo_dark.png"
                alt=""
                loading="lazy"
                style={{ width: 40, height: 40 }}
              />
              <div>
                <div
                  style={{
                    fontFamily: "var(--font-en-display)",
                    color: "var(--deep-red)",
                    fontWeight: 600,
                  }}
                >
                  Bengali Literary Association
                </div>
                <div
                  className="bn"
                  style={{ color: "var(--ink-soft)", fontSize: 14 }}
                >
                  ঐকতান
                </div>
              </div>
            </div>
            <p style={{ color: "var(--ink-soft)", maxWidth: 380 }}>
              A cultural sanctuary for literature, music, dance and art — built
              by students, for students, rooted in Bengali heritage.
            </p>
            <div style={{ display: "flex", gap: "16px", marginTop: "24px" }}>
              <a href="https://www.facebook.com/AIKYATAAN_VITU" target="_blank" rel="noreferrer" aria-label="Facebook" style={{ color: "var(--maroon)", transition: "transform 0.2s" }} onMouseEnter={e => e.currentTarget.style.transform = "scale(1.1)"} onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="https://www.instagram.com/AIKYATAAN_VIT" target="_blank" rel="noreferrer" aria-label="Instagram" style={{ color: "var(--maroon)", transition: "transform 0.2s" }} onMouseEnter={e => e.currentTarget.style.transform = "scale(1.1)"} onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                </svg>
              </a>
              <a href="https://www.linkedin.com/search/results/all/?keywords=AIKYATAAN%20VIT" target="_blank" rel="noreferrer" aria-label="LinkedIn" style={{ color: "var(--maroon)", transition: "transform 0.2s" }} onMouseEnter={e => e.currentTarget.style.transform = "scale(1.1)"} onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            </div>
          </div>

          <div>
            <h4>✾ Explore</h4>
            <ul>
              <li>
                <Link to="/about" className="cursor-target">
                  About
                </Link>
              </li>
              <li>
                <Link to="/events" className="cursor-target">
                  Events
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="cursor-target">
                  Gallery
                </Link>
              </li>
              <li>
                <Link to="/board" className="cursor-target">
                  Board
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4>✾ Connect</h4>
            <ul>
              <li>
                <Link to="/contact" className="cursor-target">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/grievance" className="cursor-target">
                  Grievance Portal
                </Link>
              </li>
              <li>
                <Link to="/terms" className="cursor-target">
                  Terms
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="cursor-target">
                  Privacy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} Bengali Literary Association · All
            rights reserved.
          </span>
          <span className="bn">শব্দে শব্দে বাংলা</span>
        </div>
      </div>

      {/* Easter egg scroll detection sentinel */}
      <div id="footer-sentinel" />
    </footer>
  );
};

export default Footer;

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
                src="/assets/logo.png"
                alt=""
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
                  <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-1.1 0-2 .9-2 2v1h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z"/>
                </svg>
              </a>
              <a href="https://www.instagram.com/AIKYATAAN_VIT" target="_blank" rel="noreferrer" aria-label="Instagram" style={{ color: "var(--maroon)", transition: "transform 0.2s" }} onMouseEnter={e => e.currentTarget.style.transform = "scale(1.1)"} onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.254 1.216.598 1.772 1.153a4.908 4.908 0 0 1 1.153 1.772c.247.637.415 1.363.465 2.428.047 1.066.06 1.405.06 4.122 0 2.717-.01 3.056-.06 4.122-.05 1.065-.218 1.79-.465 2.428a4.883 4.883 0 0 1-1.153 1.772 4.915 4.915 0 0 1-1.772 1.153c-.637.247-1.363.415-2.428.465-1.066.047-1.405.06-4.122.06-2.717 0-3.056-.01-4.122-.06-1.065-.05-1.79-.218-2.428-.465a4.89 4.89 0 0 1-1.772-1.153 4.904 4.904 0 0 1-1.153-1.772c-.248-.637-.415-1.363-.465-2.428C2.013 15.056 2 14.717 2 12c0-2.717.01-3.056.06-4.122.05-1.066.217-1.79.465-2.428a4.88 4.88 0 0 1 1.153-1.772A4.897 4.897 0 0 1 5.45 2.525c.638-.248 1.362-.415 2.428-.465C8.944 2.013 9.283 2 12 2zm0 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0 8.2a3.2 3.2 0 1 1 0-6.4 3.2 3.2 0 0 1 0 6.4zm5.2-7.1a1.2 1.2 0 1 1-2.4 0 1.2 1.2 0 0 1 2.4 0z"/>
                </svg>
              </a>
              <a href="https://www.linkedin.com/search/results/all/?keywords=AIKYATAAN%20VIT" target="_blank" rel="noreferrer" aria-label="LinkedIn" style={{ color: "var(--maroon)", transition: "transform 0.2s" }} onMouseEnter={e => e.currentTarget.style.transform = "scale(1.1)"} onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.27c-.97 0-1.75-.79-1.75-1.76s.78-1.76 1.75-1.76 1.75.79 1.75 1.76-.78 1.76-1.75 1.76zm13.5 12.27h-3v-5.6c0-3.37-4-3.12-4 0v5.6h-3v-11h3v1.76c1.4-2.58 7-2.78 7 2.47v6.77z"/>
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

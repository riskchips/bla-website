import { Link } from "react-router-dom";
import PageTransition from "../components/PageTransition";

/* ─── Floating Bengali letters ─── */
const FLOATING_LETTERS = [
  { ch: "ক", top: "8%", left: "5%", size: "2.2rem", delay: "0s", dur: "6s" },
  { ch: "খ", top: "18%", left: "88%", size: "1.6rem", delay: "1.2s", dur: "7s" },
  { ch: "গ", top: "70%", left: "10%", size: "1.8rem", delay: "0.6s", dur: "5.5s" },
  { ch: "ঘ", top: "60%", left: "85%", size: "2rem", delay: "1.8s", dur: "8s" },
  { ch: "ঙ", top: "35%", left: "3%", size: "1.4rem", delay: "2.4s", dur: "6.5s" },
  { ch: "চ", top: "80%", left: "78%", size: "1.5rem", delay: "0.3s", dur: "7.5s" },
  { ch: "ছ", top: "15%", left: "72%", size: "1.3rem", delay: "3s", dur: "5s" },
  { ch: "জ", top: "50%", left: "92%", size: "1.7rem", delay: "0.9s", dur: "6.8s" },
  { ch: "ঝ", top: "85%", left: "20%", size: "1.2rem", delay: "2.1s", dur: "5.2s" },
  { ch: "ট", top: "28%", left: "95%", size: "1.9rem", delay: "1.5s", dur: "7.2s" },
  { ch: "ঠ", top: "45%", left: "8%", size: "1.1rem", delay: "3.5s", dur: "6.3s" },
  { ch: "ড", top: "90%", left: "50%", size: "1.6rem", delay: "0.7s", dur: "5.8s" },
];

/* ─── Decorative lotus SVG ─── */
const LotusSVG = () => (
  <svg
    width="80"
    height="48"
    viewBox="0 0 80 48"
    fill="none"
    aria-hidden="true"
    style={{ margin: "24px auto", display: "block" }}
  >
    {/* Center petal */}
    <ellipse cx="40" cy="28" rx="8" ry="20" fill="var(--gold-soft)" opacity="0.4" />
    {/* Left petals */}
    <ellipse cx="40" cy="28" rx="8" ry="20" fill="var(--gold-soft)" opacity="0.3" transform="rotate(-25 40 28)" />
    <ellipse cx="40" cy="28" rx="8" ry="20" fill="var(--gold-soft)" opacity="0.2" transform="rotate(-50 40 28)" />
    {/* Right petals */}
    <ellipse cx="40" cy="28" rx="8" ry="20" fill="var(--gold-soft)" opacity="0.3" transform="rotate(25 40 28)" />
    <ellipse cx="40" cy="28" rx="8" ry="20" fill="var(--gold-soft)" opacity="0.2" transform="rotate(50 40 28)" />
    {/* Center dot */}
    <circle cx="40" cy="28" r="3" fill="var(--gold)" opacity="0.6" />
    {/* Base curve */}
    <path d="M24 42 Q40 34 56 42" stroke="var(--gold-soft)" strokeWidth="1.5" fill="none" opacity="0.4" />
  </svg>
);

/* ─── Main 404 Page ─── */
const NotFound = () => (
  <PageTransition>
    <section
      className="page"
      style={{
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
        minHeight: "70vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Floating Bengali letters background */}
      {FLOATING_LETTERS.map((l, i) => (
        <span
          key={i}
          className="bn"
          aria-hidden="true"
          style={{
            position: "absolute",
            top: l.top,
            left: l.left,
            fontSize: l.size,
            color: "var(--terracotta)",
            opacity: 0.06,
            animation: `slow-drift ${l.dur} ease-in-out ${l.delay} infinite`,
            pointerEvents: "none",
            userSelect: "none",
          }}
        />
      ))}
      {/* Also render the actual character in the span */}
      {FLOATING_LETTERS.map((l, i) => (
        <span
          key={`f-${i}`}
          className="bn"
          aria-hidden="true"
          style={{
            position: "absolute",
            top: l.top,
            left: l.left,
            fontSize: l.size,
            color: "var(--terracotta)",
            opacity: 0.06,
            animation: `slow-drift ${l.dur} ease-in-out ${l.delay} infinite`,
            pointerEvents: "none",
            userSelect: "none",
          }}
        >
          {l.ch}
        </span>
      ))}

      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        {/* Large animated Bengali ৪০৪ */}
        <div
          className="bn"
          style={{
            fontSize: "clamp(6rem, 16vw, 12rem)",
            color: "var(--deep-red)",
            lineHeight: 1,
            animation: "gentle-float 4s ease-in-out infinite",
            textShadow: "0 8px 32px rgba(122, 31, 26, 0.15)",
            marginBottom: 8,
          }}
          aria-label="404"
        >
          ৪০৪
        </div>

        {/* English subtitle */}
        <h1
          className="section-title"
          style={{
            marginTop: 8,
            animation: "fade-in-up 0.8s 0.2s ease both",
          }}
        >
          Page not found
        </h1>

        <p
          className="italic-en"
          style={{
            color: "var(--ink-soft)",
            fontSize: "1.1rem",
            animation: "fade-in-up 0.8s 0.4s ease both",
            marginBottom: 8,
          }}
        >
          This page seems to have wandered off…
        </p>

        {/* Decorative lotus */}
        <div style={{ animation: "fade-in-up 0.8s 0.5s ease both" }}>
          <LotusSVG />
        </div>

        {/* Bengali poetic message */}
        <p
          className="bn"
          style={{
            color: "var(--ink-soft)",
            fontSize: "1.15rem",
            maxWidth: 500,
            margin: "0 auto 28px",
            lineHeight: 1.8,
            animation: "fade-in-up 0.8s 0.6s ease both",
          }}
        >
          হারিয়ে গেছেন? চিন্তা নেই — ঘরে ফেরার পথ সবসময় আছে।
        </p>

        {/* Small translation */}
        <p
          style={{
            color: "var(--ink-soft)",
            fontSize: "0.9rem",
            opacity: 0.6,
            marginBottom: 28,
            animation: "fade-in-up 0.8s 0.7s ease both",
          }}
        >
          Lost? Don't worry — there's always a way back home.
        </p>

        {/* Back home button */}
        <div style={{ animation: "fade-in-up 0.8s 0.8s ease both" }}>
          <Link to="/" className="btn cursor-target" aria-label="Go back to homepage">
            Back home
          </Link>
        </div>

        {/* Decorative bottom elements */}
        <div
          aria-hidden="true"
          style={{
            marginTop: 48,
            display: "flex",
            justifyContent: "center",
            gap: 16,
            color: "var(--gold-soft)",
            opacity: 0.4,
            fontSize: "1.2rem",
            animation: "fade-in-up 0.8s 1s ease both",
          }}
        >
          <span>✾</span>
          <span className="bn">ঐক্যতান</span>
          <span>✾</span>
        </div>
      </div>
    </section>
  </PageTransition>
);

export default NotFound;

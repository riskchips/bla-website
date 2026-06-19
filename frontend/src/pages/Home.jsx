import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import TextPressure from "../components/TextPressure";
import PageTransition from "../components/PageTransition";
import AlpanaDivider from "../components/AlpanaDivider";
import Ornament from "../components/Ornament";
import { SkeletonCard } from "../components/Skeleton";
import { getNotifications, getEvents } from "../api";
import useScrollReveal from "../hooks/useScrollReveal";

/* ─── Scroll Reveal wrapper ─── */
const ScrollReveal = ({ children, className = "", delay = 0 }) => {
  const ref = useScrollReveal();
  return (
    <div
      ref={ref}
      className={`scroll-reveal ${className}`}
      style={delay ? { transitionDelay: `${delay}s` } : undefined}
    >
      {children}
    </div>
  );
};

/* ─── Bengali Word of the Day ─── */
const words = [
  {
    bn: "অভিসার",
    en: "A secret rendezvous, especially romantic",
    pronunciation: "Obhishar",
  },
  {
    bn: "মায়াবী",
    en: "Enchanting, magical, illusory",
    pronunciation: "Mayabi",
  },
  {
    bn: "নিসর্গ",
    en: "Nature in its purest, untouched form",
    pronunciation: "Nishorgo",
  },
  {
    bn: "বিভাবরী",
    en: "The night, darkness personified",
    pronunciation: "Bibhabori",
  },
  {
    bn: "ঊর্মিমালা",
    en: "A garland of waves",
    pronunciation: "Urmimala",
  },
  {
    bn: "অলকানন্দা",
    en: "A celestial river, bearer of joy",
    pronunciation: "Olokanonda",
  },
  {
    bn: "চাঁদনী",
    en: "Moonlight, a night bathed in silver",
    pronunciation: "Chandni",
  },
];

/* ─── Date formatter ─── */
const formatDate = (ts) => {
  if (!ts) return "";
  const n = typeof ts === "string" ? Number(ts) : ts;
  const d = new Date(n);
  if (isNaN(d.getTime())) return ts;
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

/* ─── Floating Bengali aksharas for the hero ─── */
const floatingChars = [
  { char: "ক", top: "12%", left: "8%", size: "2.2rem", delay: "0s" },
  { char: "গ", top: "25%", right: "6%", size: "1.8rem", delay: "1.2s" },
  { char: "ত", bottom: "20%", left: "5%", size: "2rem", delay: "0.6s" },
  { char: "ম", top: "60%", right: "10%", size: "1.6rem", delay: "1.8s" },
  { char: "শ", top: "15%", right: "18%", size: "1.4rem", delay: "2.4s" },
  { char: "ন", bottom: "30%", left: "14%", size: "1.5rem", delay: "0.3s" },
  { char: "র", top: "45%", left: "3%", size: "1.7rem", delay: "1.5s" },
  { char: "প", bottom: "15%", right: "15%", size: "1.9rem", delay: "2.1s" },
];

/* ─── Home Page ─── */
const Home = () => {
  const [notifications, setNotifications] = useState(null);
  const [events, setEvents] = useState(null);
  const [notifErr, setNotifErr] = useState(null);
  const [eventErr, setEventErr] = useState(null);

  useEffect(() => {
    getNotifications()
      .then((r) => {
        const sorted = [...(r.notifications || [])].sort(
          (a, b) => (b.unix_timestamp || 0) - (a.unix_timestamp || 0)
        );
        setNotifications(sorted);
      })
      .catch((e) => setNotifErr(e.message));

    getEvents()
      .then((r) => setEvents(r.events || []))
      .catch((e) => setEventErr(e.message));
  }, []);

  const todaysWord = words[new Date().getDate() % words.length];

  return (
    <PageTransition>
      {/* ═══ Inline Styles for animations ═══ */}
      <style>{`
        @keyframes floatChar {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-12px) rotate(5deg); }
        }
        .floating-char {
          position: absolute;
          font-family: var(--font-bn-display);
          color: rgba(245, 236, 217, 0.08);
          pointer-events: none;
          animation: floatChar 6s ease-in-out infinite;
          z-index: 0;
        }
        .scroll-reveal {
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.7s ease-out, transform 0.7s ease-out;
        }
        .scroll-reveal.visible {
          opacity: 1;
          transform: translateY(0);
        }
        .word-of-day-card {
          background: linear-gradient(135deg, var(--paper) 0%, var(--paper-dark) 100%);
          border: 1px solid var(--line);
          border-radius: 8px;
          padding: 40px 32px;
          text-align: center;
          max-width: 600px;
          margin: 0 auto;
          position: relative;
          overflow: hidden;
        }
        .word-of-day-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, var(--gold), var(--terracotta), var(--gold));
        }
        .word-label {
          font-family: var(--font-en-display);
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          color: var(--terracotta);
          margin-bottom: 16px;
        }
        .bn-word {
          font-family: var(--font-bn-display);
          font-size: clamp(2.5rem, 5vw, 3.5rem);
          color: var(--deep-red);
          line-height: 1.3;
          margin-bottom: 4px;
        }
        .word-pronunciation {
          font-family: var(--font-en-display);
          font-style: italic;
          color: var(--gold);
          font-size: 1.1rem;
          margin-bottom: 12px;
        }
        .en-meaning {
          font-family: var(--font-en-body);
          color: var(--ink-soft);
          font-size: 1.05rem;
          line-height: 1.5;
        }
        .tilt-card {
          transition: transform 0.4s ease, box-shadow 0.4s ease;
        }
        .tilt-card:hover {
          transform: translateY(-6px) rotateX(2deg) rotateY(-1deg);
          box-shadow: 0 24px 48px -16px rgba(122, 31, 26, 0.25);
        }
        .about-deco-char {
          position: absolute;
          font-family: var(--font-bn-display);
          color: var(--terracotta);
          opacity: 0.06;
          pointer-events: none;
          font-size: 4rem;
        }
      `}</style>

      {/* ═══ Hero Section ═══ */}
      <section className="hero">
        {/* Floating Bengali aksharas */}
        {floatingChars.map((fc, i) => (
          <span
            key={i}
            className="floating-char"
            style={{
              top: fc.top,
              left: fc.left,
              right: fc.right,
              bottom: fc.bottom,
              fontSize: fc.size,
              animationDelay: fc.delay,
            }}
          >
            {fc.char}
          </span>
        ))}

        <div className="container hero-inner">
          <div
            className="ornament"
            aria-hidden="true"
            style={{ color: "var(--gold-soft)" }}
          >
            <span className="line" style={{ background: "var(--gold-soft)" }} />
            <span className="kalka" style={{ color: "var(--gold-soft)" }}>
              ❉ এসো হে বৈশাখ ❉
            </span>
            <span className="line" style={{ background: "var(--gold-soft)" }} />
          </div>

            <div
              className="hero-pressure"
              style={{
                position: "relative",
                width: "100%",
                maxWidth: "1000px",
                padding: "20px 0",
                margin: "0 auto",
                display: "flex",
                flexDirection: "column",
                alignItems: "center"
              }}
            >
            <TextPressure
              text="BLA"
              flex={true}
              width={true}
              weight={true}
              italic={true}
              alpha={false}
              stroke={false}
              textColor="#f5ecd9"
              strokeColor="#b8893a"
              minFontSize={80}
              fontFamily="Playfair Display"
              fontUrl=""
            />
          </div>

          <div className="hero-tag bn" style={{ marginTop: "1rem" }}>
            বাংলা সাহিত্য সংঘ
          </div>

          <p
            className="hero-sub"
            style={{ maxWidth: "700px", margin: "1rem auto" }}
          >
            A college cultural club where literature, music, dance and art live
            together — in the warmth of Bengali heritage.
          </p>

          <div
            className="hero-ctas"
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "1rem",
              flexWrap: "wrap",
            }}
          >
            <Link to="/events" className="btn cursor-target">
              Upcoming Events
            </Link>
            <Link to="/about" className="btn ghost cursor-target">
              Our Story
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ Hero → Body Transition Wave ═══ */}
      <div style={{ position: "relative", marginTop: -1 }}>
        <svg
          viewBox="0 0 1440 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ display: "block", width: "100%" }}
        >
          <path
            d="M0,0 C360,80 1080,80 1440,0 L1440,80 L0,80 Z"
            fill="var(--bg-cream)"
          />
        </svg>
      </div>

      {/* ═══ Bengali Word of the Day ═══ */}
      <section className="section--tight">
        <div className="container">
          <ScrollReveal>
            <div className="word-of-day-card">
              <div className="word-label">✾ Bengali Word of the Day ✾</div>
              <div className="word-content">
                <div className="bn-word">{todaysWord.bn}</div>
                <div className="word-pronunciation">
                  /{todaysWord.pronunciation}/
                </div>
                <div className="en-meaning">{todaysWord.en}</div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ═══ Notifications ═══ */}
      <section className="section">
        <div className="container">
          <ScrollReveal>
            <div style={{ textAlign: "center", marginBottom: 36 }}>
              <span className="eyebrow">সংবাদ</span>
              <h2 className="section-title">Latest Notifications</h2>
              <Ornament />
            </div>
          </ScrollReveal>

          {notifErr && <div className="alert error">{notifErr}</div>}

          {notifications === null && !notifErr && (
            <div className="grid grid-2">
              <SkeletonCard />
              <SkeletonCard />
            </div>
          )}

          {notifications && notifications.length === 0 && (
            <div className="empty">
              No notifications yet. Check back soon — কিছুক্ষণ পরে দেখুন।
            </div>
          )}

          {notifications && notifications.length > 0 && (
            <div className="grid grid-2">
              {notifications.slice(0, 4).map((n, idx) => (
                <ScrollReveal key={n.id || n.unix_timestamp} delay={idx * 0.12}>
                  <article className="card notif">
                    <h3>{n.title}</h3>
                    <div className="date bn-body">
                      {n.date || formatDate(n.unix_timestamp)}
                    </div>
                    <p className="body">{n.details}</p>
                    {n.buttons?.length > 0 && (
                      <div className="notif-buttons">
                        {n.buttons.map((b, i) => (
                          <a
                            key={i}
                            href={b.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="cursor-target"
                          >
                            {b.name}
                          </a>
                        ))}
                      </div>
                    )}
                  </article>
                </ScrollReveal>
              ))}
            </div>
          )}
        </div>
      </section>

      <AlpanaDivider />

      {/* ═══ About Teaser ═══ */}
      <section className="section--tight">
        <div
          className="container"
          style={{
            textAlign: "center",
            maxWidth: 780,
            margin: "0 auto",
            position: "relative",
          }}
        >
          {/* Decorative Bengali chars */}
          <span
            className="about-deco-char"
            style={{ top: -20, left: 0 }}
            aria-hidden="true"
          >
            ক
          </span>
          <span
            className="about-deco-char"
            style={{ bottom: -10, right: 10 }}
            aria-hidden="true"
          >
            ঞ
          </span>

          <ScrollReveal>
            <span className="eyebrow">আমাদের কথা</span>
            <h2 className="section-title italic-en">
              Where words become a way of life
            </h2>
            <p style={{ color: "var(--ink-soft)", fontSize: "1.1rem" }}>
              From Tagore's verses to today's open mics, BLA is the home for
              every student who finds joy in literature, art and the simple
              comfort of shared culture.
            </p>
            <div style={{ marginTop: 24 }}>
              <Link to="/about" className="btn ghost cursor-target">
                Read more
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ═══ Events Preview ═══ */}
      <section className="section">
        <div className="container">
          <ScrollReveal>
            <div style={{ textAlign: "center", marginBottom: 36 }}>
              <span className="eyebrow">অনুষ্ঠান</span>
              <h2 className="section-title">Upcoming & Past Events</h2>
              <Ornament />
            </div>
          </ScrollReveal>

          {eventErr && <div className="alert error">{eventErr}</div>}

          {events === null && !eventErr && (
            <div className="grid grid-3">
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </div>
          )}

          {events && events.length === 0 && (
            <div className="empty">Events will appear here soon.</div>
          )}

          {events && events.length > 0 && (
            <div className="grid grid-3">
              {events.slice(0, 3).map((ev, i) => (
                <ScrollReveal key={i} delay={i * 0.15}>
                  <article className="card tilt-card">
                    {ev.gallery?.[0] && (
                      <img
                        src={ev.gallery[0]}
                        alt=""
                        loading="lazy"
                        style={{
                          width: "100%",
                          aspectRatio: "16/10",
                          objectFit: "cover",
                          marginBottom: 14,
                          border: "1px solid var(--line)",
                          borderRadius: 4,
                        }}
                      />
                    )}
                    <h3
                      style={{
                        fontFamily: "var(--font-en-display)",
                        color: "var(--deep-red)",
                        fontSize: "1.3rem",
                        marginBottom: 4,
                      }}
                    >
                      {ev.name}
                    </h3>
                    <div
                      className="bn-body"
                      style={{
                        color: "var(--terracotta)",
                        fontSize: ".9rem",
                        marginBottom: 10,
                      }}
                    >
                      {formatDate(ev.timestamp)}
                    </div>
                    <p
                      style={{
                        color: "var(--ink-soft)",
                        fontSize: ".95rem",
                      }}
                    >
                      {(ev.description || "").slice(0, 120)}
                      {(ev.description || "").length > 120 ? "…" : ""}
                    </p>
                  </article>
                </ScrollReveal>
              ))}
            </div>
          )}

          <div style={{ textAlign: "center", marginTop: 32 }}>
            <Link to="/events" className="btn cursor-target">
              See all events
            </Link>
          </div>
        </div>
      </section>
    </PageTransition>
  );
};

export default Home;
import { useEffect, useState } from "react";
import PageTransition from "../components/PageTransition";
import Ornament from "../components/Ornament";
import Lightbox from "../components/Lightbox";
import { SkeletonCard } from "../components/Skeleton";
import { getEvents } from "../api";
import useScrollReveal from "../hooks/useScrollReveal";

/* ─── Scroll-Reveal wrapper ─── */
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

/* ─── Decorative Bengali characters banner ─── */
const AKSHARAS = ["ক", "খ", "গ", "ঘ", "ঙ", "চ", "ছ", "জ", "ঝ", "ঞ", "ট", "ঠ", "ড", "ঢ", "ণ", "ত", "থ", "দ"];

const FloatingBanner = () => (
  <div
    aria-hidden="true"
    style={{
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      height: 220,
      overflow: "hidden",
      pointerEvents: "none",
      zIndex: 0,
    }}
  >
    {AKSHARAS.map((ch, i) => (
      <span
        key={i}
        className="bn"
        style={{
          position: "absolute",
          top: `${8 + (i * 17) % 80}%`,
          left: `${(i * 13.7) % 95}%`,
          fontSize: `${0.9 + (i % 4) * 0.35}rem`,
          color: "var(--terracotta)",
          opacity: 0.06 + (i % 3) * 0.02,
          transform: `rotate(${-15 + (i * 11) % 30}deg)`,
          animation: `slow-drift ${5 + (i % 4)}s ease-in-out ${i * 0.3}s infinite`,
          userSelect: "none",
        }}
      >
        {ch}
      </span>
    ))}
  </div>
);

/* ─── Bengali calendar icon ─── */
const BengaliCalendarBadge = ({ date }) => (
  <span
    className="bn-body"
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      fontSize: "0.9rem",
      color: "var(--gold)",
      marginTop: 4,
    }}
    aria-label={`Event date: ${date}`}
  >
    <span style={{ fontSize: "1.1rem" }}>📅</span>
    <span>{date}</span>
  </span>
);

/* ─── Cultural motif decoration ─── */
const SectionMotif = () => (
  <div
    aria-hidden="true"
    style={{
      display: "flex",
      justifyContent: "center",
      gap: 12,
      marginBottom: 12,
      color: "var(--gold-soft)",
      opacity: 0.5,
      fontSize: "0.85rem",
      letterSpacing: "0.5em",
    }}
  >
    <span>✾</span>
    <span className="bn">অনুষ্ঠান</span>
    <span>✾</span>
  </div>
);

/* ─── Format date helper ─── */
const formatDate = (ts) => {
  if (!ts) return "";
  const n = typeof ts === "string" ? Number(ts) : ts;
  const d = new Date(n);
  if (isNaN(d.getTime())) return ts;
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" });
};

/* ─── Main Events Page ─── */
const Events = () => {
  const [events, setEvents] = useState(null);
  const [err, setErr] = useState(null);
  const [lightbox, setLightbox] = useState(null);

  const load = () => {
    setErr(null);
    setEvents(null);
    getEvents()
      .then((r) => setEvents(r.events || []))
      .catch((e) => setErr(e.message));
  };
  useEffect(load, []);

  return (
    <PageTransition>
      <section className="page" style={{ position: "relative", overflow: "hidden" }}>
        <FloatingBanner />

        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          {/* ── Page Header ── */}
          <ScrollReveal>
            <div className="page-header">
              <SectionMotif />
              <span className="eyebrow">অনুষ্ঠানসমূহ</span>
              <h1 className="section-title">Events</h1>
              <Ornament />
              <p className="section-subtitle">
                A year of culture, in one rolling calendar.
              </p>
            </div>
          </ScrollReveal>

          {/* ── Error state ── */}
          {err && (
            <div className="alert error" style={{ display: "flex", justifyContent: "space-between" }}>
              <span>{err}</span>
              <button
                className="btn ghost cursor-target"
                onClick={load}
                style={{ padding: "6px 14px" }}
              >
                Retry
              </button>
            </div>
          )}

          {/* ── Loading state ── */}
          {events === null && !err && (
            <div className="grid" style={{ gap: 28 }}>
              <SkeletonCard />
              <SkeletonCard />
            </div>
          )}

          {/* ── Empty state ── */}
          {events && events.length === 0 && (
            <div className="empty">No events yet. সাজানো হচ্ছে…</div>
          )}

          {/* ── Events grid ── */}
          {events && events.length > 0 && (
            <div className="grid" style={{ gap: 28 }}>
              {events.map((ev, i) => (
                <ScrollReveal key={ev.id} delay={0.08 * Math.min(i, 6)}>
                  <article
                    className="card event"
                    style={{
                      transition: "transform 0.4s cubic-bezier(0.22,1,0.36,1), box-shadow 0.4s ease",
                    }}
                  >
                    <div>
                      <h3>{ev.name}</h3>
                      <div className="when bn-body" style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        {formatDate(ev.timestamp)}
                      </div>
                      <BengaliCalendarBadge date={formatDate(ev.timestamp)} />
                      <p className="desc">{ev.description}</p>
                    </div>

                    {ev.gallery && ev.gallery.length > 0 && (
                      <div className="event-gallery">
                        {ev.gallery.slice(0, 4).map((url, j) => (
                          <div
                            key={j}
                            style={{
                              overflow: "hidden",
                              borderRadius: 2,
                              border: "1px solid var(--line)",
                            }}
                          >
                            <img
                              src={url}
                              alt={`${ev.name} gallery image ${j + 1}`}
                              loading="lazy"
                              className="cursor-target"
                              onClick={() => setLightbox(url)}
                              style={{
                                width: "100%",
                                aspectRatio: "1 / 1",
                                objectFit: "cover",
                                display: "block",
                                cursor: "zoom-in",
                                transition: "transform 0.5s cubic-bezier(0.22,1,0.36,1), filter 0.4s ease",
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.transform = "scale(1.06)";
                                e.currentTarget.style.filter = "brightness(1.05)";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.transform = "scale(1)";
                                e.currentTarget.style.filter = "brightness(1)";
                              }}
                            />
                          </div>
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

      <Lightbox src={lightbox} onClose={() => setLightbox(null)} />
    </PageTransition>
  );
};

export default Events;

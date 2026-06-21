import { useEffect, useState, useMemo } from "react";
import PageTransition from "../components/PageTransition";
import Ornament from "../components/Ornament";
import Lightbox from "../components/Lightbox";
import { SkeletonCard } from "../components/Skeleton";
import { getEvents, getCategories } from "../api";
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
  const [categories, setCategories] = useState([]);
  const [err, setErr] = useState(null);
  
  // Gallery Lightbox state
  const [lightboxImages, setLightboxImages] = useState(null);

  const load = () => {
    setErr(null);
    setEvents(null);
    Promise.all([getEvents(), getCategories()])
      .then(([rEvents, rCategories]) => {
        setEvents(rEvents.events || []);
        const sortedCats = (rCategories.categories || []).sort((a,b) => a.sort_order - b.sort_order);
        setCategories(sortedCats);
      })
      .catch((e) => setErr(e.message));
  };
  
  useEffect(load, []);

  const eventsByCategory = useMemo(() => {
    if (!events) return {};
    const grouped = {};
    
    // Initialize groups in sorted order
    categories.forEach(c => {
        grouped[c.name] = [];
    });
    grouped["Other Events"] = []; 

    events.forEach(ev => {
        const catName = ev.event_categories?.name;
        if (catName && grouped[catName]) {
            grouped[catName].push(ev);
        } else {
            grouped["Other Events"].push(ev);
        }
    });

    // Remove empty categories
    Object.keys(grouped).forEach(k => {
        if (grouped[k].length === 0) delete grouped[k];
    });

    return grouped;
  }, [events, categories]);

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

          {/* ── Events Grouped by Category ── */}
          {events && events.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "60px" }}>
              {Object.entries(eventsByCategory).map(([catName, catEvents]) => (
                  <div key={catName}>
                      <ScrollReveal>
                          <h2 style={{ 
                              fontFamily: "var(--font-en-display)", 
                              color: "var(--deep-red)", 
                              borderBottom: "1px solid var(--terracotta)", 
                              paddingBottom: "10px", 
                              marginBottom: "30px",
                              display: "inline-block"
                          }}>
                              {catName}
                          </h2>
                      </ScrollReveal>
                      
                      <div className="grid" style={{ gap: 28 }}>
                        {catEvents.map((ev, i) => (
                          <ScrollReveal key={ev.id} delay={0.08 * Math.min(i, 6)}>
                            <article
                              className="card event"
                              style={{
                                transition: "transform 0.4s cubic-bezier(0.22,1,0.36,1), box-shadow 0.4s ease",
                              }}
                            >
                              {/* Poster Image */}
                              {ev.poster_image && (
                                  <div 
                                      className="cursor-target"
                                      onClick={() => ev.gallery?.length > 0 ? setLightboxImages(ev.gallery) : null}
                                      style={{ 
                                          overflow: "hidden", 
                                          borderRadius: "8px",
                                          cursor: ev.gallery?.length > 0 ? "pointer" : "default",
                                          height: "100%"
                                      }}
                                  >
                                      <img 
                                          src={ev.poster_image} 
                                          alt={`${ev.name} Poster`} 
                                          style={{
                                              width: "100%",
                                              height: "auto",
                                              objectFit: "contain",
                                              display: "block",
                                              transition: "transform 0.5s ease"
                                          }}
                                          onMouseEnter={(e) => {
                                              if(ev.gallery?.length > 0) e.currentTarget.style.transform = "scale(1.03)";
                                          }}
                                          onMouseLeave={(e) => {
                                              e.currentTarget.style.transform = "scale(1)";
                                          }}
                                      />
                                  </div>
                              )}

                              <div style={{ display: "flex", flexDirection: "column", height: "100%", justifyContent: "space-between" }}>
                                <div>
                                  <h3>{ev.name}</h3>
                                  <div className="when bn-body" style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                    {formatDate(ev.timestamp)}
                                  </div>
                                  <BengaliCalendarBadge date={formatDate(ev.timestamp)} />
                                  <p className="desc" style={{ marginTop: "15px" }}>{ev.description}</p>
                                </div>

                                {/* Gallery Button */}
                                {ev.gallery && ev.gallery.length > 0 && (
                                  <button 
                                      className="btn ghost cursor-target" 
                                      style={{ marginTop: "24px", width: "100%", justifyContent: "center" }}
                                      onClick={() => setLightboxImages(ev.gallery)}
                                  >
                                      View Gallery ({ev.gallery.length} Images)
                                  </button>
                                )}
                              </div>
                            </article>
                          </ScrollReveal>
                        ))}
                      </div>
                  </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Lightbox images={lightboxImages} onClose={() => setLightboxImages(null)} />
    </PageTransition>
  );
};

export default Events;

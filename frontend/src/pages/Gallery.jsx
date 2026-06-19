import { useEffect, useMemo, useState } from "react";
import PageTransition from "../components/PageTransition";
import Ornament from "../components/Ornament";
import Lightbox from "../components/Lightbox";
import Skeleton from "../components/Skeleton";
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

/* ─── Gallery Image Card with Hover Overlay ─── */
const GalleryImageCard = ({ img, onClick }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="cursor-target"
      aria-label={`Open photo from ${img.caption}`}
      style={{
        position: "relative",
        background: "none",
        border: "1px solid var(--line)",
        padding: 0,
        overflow: "hidden",
        borderRadius: 4,
        display: "block",
        width: "100%",
        marginBottom: 16,
        cursor: "zoom-in",
        transition: "box-shadow 0.4s ease, transform 0.4s cubic-bezier(0.22,1,0.36,1)",
        boxShadow: hovered
          ? "0 16px 40px -12px rgba(122, 31, 26, 0.3)"
          : "0 2px 8px rgba(0,0,0,0.06)",
        transform: hovered ? "translateY(-3px)" : "translateY(0)",
      }}
    >
      <img
        src={img.url}
        alt={img.caption}
        loading="lazy"
        style={{
          width: "100%",
          display: "block",
          transition: "transform 0.5s cubic-bezier(0.22,1,0.36,1)",
          transform: hovered ? "scale(1.05)" : "scale(1)",
        }}
      />

      {/* Gradient overlay with caption */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(to top, rgba(44, 24, 16, 0.82) 0%, rgba(44, 24, 16, 0.3) 40%, transparent 100%)",
          opacity: hovered ? 1 : 0,
          transition: "opacity 0.4s ease",
          display: "flex",
          alignItems: "flex-end",
          padding: "16px 14px",
        }}
      >
        <span
          style={{
            color: "var(--bg-cream, #f5ecd9)",
            fontFamily: "var(--font-en-display)",
            fontSize: "0.95rem",
            letterSpacing: "0.02em",
            transform: hovered ? "translateY(0)" : "translateY(8px)",
            transition: "transform 0.4s cubic-bezier(0.22,1,0.36,1)",
          }}
        >
          {img.caption}
        </span>
      </div>
    </button>
  );
};

/* ─── Main Gallery Page ─── */
const Gallery = () => {
  const [events, setEvents] = useState(null);
  const [err, setErr] = useState(null);
  const [lightbox, setLightbox] = useState(null);

  useEffect(() => {
    getEvents()
      .then((r) => setEvents(r.events || []))
      .catch((e) => setErr(e.message));
  }, []);

  const images = useMemo(() => {
    if (!events) return [];
    return events.flatMap((ev) =>
      (ev.gallery || []).map((url) => ({ url, caption: ev.name }))
    );
  }, [events]);

  return (
    <PageTransition>
      <section className="page" style={{ position: "relative", overflow: "hidden" }}>
        {/* Decorative Bengali watermark */}
        <div
          aria-hidden="true"
          className="bn"
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            fontSize: "clamp(8rem, 20vw, 18rem)",
            color: "var(--terracotta)",
            opacity: 0.03,
            pointerEvents: "none",
            userSelect: "none",
            zIndex: 0,
            whiteSpace: "nowrap",
            lineHeight: 1,
          }}
        >
          চিত্রশালা
        </div>

        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          {/* ── Page Header ── */}
          <ScrollReveal>
            <div className="page-header">
              <span className="eyebrow">চিত্রশালা</span>
              <h1 className="section-title">Gallery</h1>
              <Ornament />
              <p className="section-subtitle">
                Moments from our stages, studios and street walks.
              </p>
            </div>
          </ScrollReveal>

          {/* ── Error ── */}
          {err && <div className="alert error">{err}</div>}

          {/* ── Loading ── */}
          {events === null && !err && (
            <div className="grid grid-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} height={220} />
              ))}
            </div>
          )}

          {/* ── Empty ── */}
          {events && images.length === 0 && (
            <div className="empty">No photos yet.</div>
          )}

          {/* ── Masonry Gallery Grid ── */}
          {images.length > 0 && (
            <div
              style={{
                columnCount: 3,
                columnGap: "16px",
              }}
            >
              <style>{`
                @media (max-width: 768px) {
                  .gallery-masonry { column-count: 2 !important; }
                }
                @media (max-width: 480px) {
                  .gallery-masonry { column-count: 1 !important; }
                }
              `}</style>
              <div
                className="gallery-masonry"
                style={{ columnCount: "inherit", columnGap: "inherit" }}
              >
                {images.map((img, i) => (
                  <ScrollReveal key={i} delay={0.06 * Math.min(i, 8)}>
                    <GalleryImageCard
                      img={img}
                      onClick={() => setLightbox(img.url)}
                    />
                  </ScrollReveal>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <Lightbox src={lightbox} onClose={() => setLightbox(null)} />
    </PageTransition>
  );
};

export default Gallery;

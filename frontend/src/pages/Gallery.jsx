import { useEffect, useMemo, useState } from "react";
import PageTransition from "../components/PageTransition";
import Ornament from "../components/Ornament";
import Lightbox from "../components/Lightbox";
import Skeleton from "../components/Skeleton";
import { getGallery } from "../api";
import useScrollReveal from "../hooks/useScrollReveal";
import InfiniteMenu from "../components/InfiniteMenu";

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

/* ─── Main Gallery Page ─── */
const Gallery = () => {
  const [galleryItems, setGalleryItems] = useState(null);
  const [err, setErr] = useState(null);
  const [lightbox, setLightbox] = useState(null);

  useEffect(() => {
    getGallery()
      .then((r) => setGalleryItems(r.gallery || []))
      .catch((e) => setErr(e.message));
  }, []);

  const menuItems = useMemo(() => {
    if (!galleryItems) return [];
    return galleryItems.map(img => ({
      image: img.image_url,
      link: img.image_url,
      title: img.caption || '',
      description: ''
    }));
  }, [galleryItems]);

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
          {galleryItems === null && !err && (
            <div className="grid grid-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} height={220} />
              ))}
            </div>
          )}

          {/* ── Empty ── */}
          {galleryItems && menuItems.length === 0 && (
            <div className="empty">No photos yet.</div>
          )}

          {/* ── Infinite Menu Gallery ── */}
          {menuItems.length > 0 && (
            <div style={{ height: '600px', position: 'relative', marginTop: '40px' }}>
              <InfiniteMenu items={menuItems} scale={1.0} />
            </div>
          )}
        </div>
      </section>

      <Lightbox src={lightbox} onClose={() => setLightbox(null)} />
    </PageTransition>
  );
};

export default Gallery;


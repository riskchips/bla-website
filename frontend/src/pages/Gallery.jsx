import { useEffect, useMemo, useState } from "react";
import PageTransition from "../components/PageTransition";
import Ornament from "../components/Ornament";
import Lightbox from "../components/Lightbox";
import Skeleton from "../components/Skeleton";
import { getEvents } from "../api";

const Gallery = () => {
  const [events, setEvents] = useState(null);
  const [err, setErr] = useState(null);
  const [lightbox, setLightbox] = useState(null);

  useEffect(() => {
    getEvents().then((r) => setEvents(r.events || [])).catch((e) => setErr(e.message));
  }, []);

  const images = useMemo(() => {
    if (!events) return [];
    return events.flatMap((ev) =>
      (ev.gallery || []).map((url) => ({ url, caption: ev.name }))
    );
  }, [events]);

  return (
    <PageTransition>
      <section className="page">
        <div className="container">
          <div className="page-header">
            <span className="eyebrow">চিত্রশালা</span>
            <h1 className="section-title">Gallery</h1>
            <Ornament />
            <p className="section-subtitle">Moments from our stages, studios and street walks.</p>
          </div>

          {err && <div className="alert error">{err}</div>}

          {events === null && !err && (
            <div className="grid grid-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} height={220} />
              ))}
            </div>
          )}

          {events && images.length === 0 && <div className="empty">No photos yet.</div>}

          {images.length > 0 && (
            <div className="grid grid-3">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setLightbox(img.url)}
                  className="cursor-target"
                  style={{
                    background: "none",
                    border: "1px solid var(--line)",
                    padding: 0,
                    overflow: "hidden",
                    borderRadius: 2,
                  }}
                  aria-label={`Open photo from ${img.caption}`}
                >
                  <img
                    src={img.url}
                    alt={img.caption}
                    loading="lazy"
                    style={{
                      width: "100%",
                      aspectRatio: "1 / 1",
                      objectFit: "cover",
                      display: "block",
                      transition: "transform .4s ease",
                    }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      </section>
      <Lightbox src={lightbox} onClose={() => setLightbox(null)} />
    </PageTransition>
  );
};

export default Gallery;

import { useEffect, useState } from "react";
import PageTransition from "../components/PageTransition";
import Ornament from "../components/Ornament";
import Lightbox from "../components/Lightbox";
import { SkeletonCard } from "../components/Skeleton";
import { getEvents } from "../api";

const formatDate = (ts) => {
  if (!ts) return "";
  const n = typeof ts === "string" ? Number(ts) : ts;
  const d = new Date(n);
  if (isNaN(d.getTime())) return ts;
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" });
};

const Events = () => {
  const [events, setEvents] = useState(null);
  const [err, setErr] = useState(null);
  const [lightbox, setLightbox] = useState(null);

  const load = () => {
    setErr(null); setEvents(null);
    getEvents().then((r) => setEvents(r.events || [])).catch((e) => setErr(e.message));
  };
  useEffect(load, []);

  return (
    <PageTransition>
      <section className="page">
        <div className="container">
          <div className="page-header">
            <span className="eyebrow">অনুষ্ঠানসমূহ</span>
            <h1 className="section-title">Events</h1>
            <Ornament />
            <p className="section-subtitle">A year of culture, in one rolling calendar.</p>
          </div>

          {err && (
            <div className="alert error" style={{ display: "flex", justifyContent: "space-between" }}>
              <span>{err}</span>
              <button className="btn ghost cursor-target" onClick={load} style={{ padding: "6px 14px" }}>Retry</button>
            </div>
          )}

          {events === null && !err && (
            <div className="grid" style={{ gap: 28 }}>
              <SkeletonCard /><SkeletonCard />
            </div>
          )}

          {events && events.length === 0 && <div className="empty">No events yet. সাজানো হচ্ছে…</div>}

          {events && events.length > 0 && (
            <div className="grid" style={{ gap: 28 }}>
              {events.map((ev, i) => (
                <article className="card event" key={i}>
                  <div>
                    <h3>{ev.name}</h3>
                    <div className="when bn-body">{formatDate(ev.timestamp)}</div>
                    <p className="desc">{ev.description}</p>
                  </div>
                  {ev.gallery && ev.gallery.length > 0 && (
                    <div className="event-gallery">
                      {ev.gallery.slice(0, 4).map((url, j) => (
                        <img
                          key={j}
                          src={url}
                          alt=""
                          loading="lazy"
                          className="cursor-target"
                          onClick={() => setLightbox(url)}
                        />
                      ))}
                    </div>
                  )}
                </article>
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

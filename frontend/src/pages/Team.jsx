import { useEffect, useState } from "react";
import PageTransition from "../components/PageTransition";
import Ornament from "../components/Ornament";
import { SkeletonCard } from "../components/Skeleton";
import { getTeam } from "../api";

const Team = () => {
  const [team, setTeam] = useState(null);
  const [err, setErr] = useState(null);

  const load = () => {
    setErr(null); setTeam(null);
    getTeam().then((r) => setTeam(r.team || [])).catch((e) => setErr(e.message));
  };
  useEffect(load, []);

  return (
    <PageTransition>
      <section className="page">
        <div className="container">
          <div className="page-header">
            <span className="eyebrow">আমাদের দল</span>
            <h1 className="section-title">The Team</h1>
            <Ornament />
            <p className="section-subtitle">The students who make BLA happen.</p>
          </div>

          {err && (
            <div className="alert error" style={{ display: "flex", justifyContent: "space-between" }}>
              <span>{err}</span>
              <button className="btn ghost cursor-target" onClick={load} style={{ padding: "6px 14px" }}>Retry</button>
            </div>
          )}

          {team === null && !err && (
            <div className="grid grid-3">
              <SkeletonCard /><SkeletonCard /><SkeletonCard />
            </div>
          )}

          {team && team.length === 0 && <div className="empty">Team will be announced soon.</div>}

          {team && team.length > 0 && (
            <div className="grid grid-3">
              {team.map((m, i) => (
                <article className="card team-card cursor-target" key={i}>
                  {m.image && (
                    <img className="photo" src={m.image} alt={m.name} loading="lazy" />
                  )}
                  <div className="meta">
                    <h3>{m.name}</h3>
                    <div className="role">{m.role}</div>
                    <p className="desc">{m.description}</p>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </PageTransition>
  );
};

export default Team;

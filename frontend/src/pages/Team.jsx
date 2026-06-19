import { useEffect, useState } from "react";
import PageTransition from "../components/PageTransition";
import Ornament from "../components/Ornament";
import { SkeletonCard } from "../components/Skeleton";
import { getTeam } from "../api";
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

/* ─── Section header decoration ─── */
const TeamHeaderDecor = () => (
  <div
    aria-hidden="true"
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      gap: 10,
      marginBottom: 10,
      color: "var(--gold-soft)",
      fontSize: "0.85rem",
      opacity: 0.55,
      letterSpacing: "0.4em",
    }}
  >
    <span>✾</span>
    <span className="bn" style={{ letterSpacing: "0.15em" }}>সদস্য</span>
    <span>✾</span>
  </div>
);

/* ─── Decorative name element ─── */
const NameDecor = () => (
  <span
    aria-hidden="true"
    style={{
      display: "inline-block",
      width: 24,
      height: 1.5,
      background: "linear-gradient(90deg, transparent, var(--gold), transparent)",
      margin: "6px auto 0",
      opacity: 0.5,
    }}
  />
);

/* ─── Enhanced Team Card ─── */
const TeamCard = ({ member }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <article
      className="card team-card cursor-target"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        transition: "transform 0.4s cubic-bezier(0.22,1,0.36,1), box-shadow 0.4s ease, border-color 0.4s ease",
        transform: hovered ? "translateY(-6px) scale(1.03)" : "translateY(0) scale(1)",
        boxShadow: hovered
          ? "0 20px 50px -16px rgba(122, 31, 26, 0.35), 0 0 0 2px var(--gold-soft)"
          : "0 2px 8px rgba(0,0,0,0.06)",
        borderColor: hovered ? "var(--gold-soft)" : "var(--line)",
      }}
    >
      {member.image && (
        <div style={{ overflow: "hidden", position: "relative" }}>
          <img
            className="photo"
            src={member.image}
            alt={member.name}
            loading="lazy"
            style={{
              transition: "transform 0.5s cubic-bezier(0.22,1,0.36,1)",
              transform: hovered ? "scale(1.06)" : "scale(1)",
            }}
          />
          {/* Gold shimmer overlay on hover */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(135deg, rgba(184,137,58,0.12) 0%, transparent 60%)",
              opacity: hovered ? 1 : 0,
              transition: "opacity 0.4s ease",
              pointerEvents: "none",
            }}
          />
        </div>
      )}
      <div className="meta">
        <h3>{member.name}</h3>
        <NameDecor />
        <div className="role">{member.role}</div>
        <p className="desc">{member.description}</p>
      </div>
    </article>
  );
};

/* ─── Main Team Page ─── */
const Team = () => {
  const [team, setTeam] = useState(null);
  const [err, setErr] = useState(null);

  const load = () => {
    setErr(null);
    setTeam(null);
    getTeam()
      .then((r) => setTeam(r.team || []))
      .catch((e) => setErr(e.message));
  };
  useEffect(load, []);

  return (
    <PageTransition>
      <section className="page">
        <div className="container">
          {/* ── Page Header ── */}
          <ScrollReveal>
            <div className="page-header">
              <TeamHeaderDecor />
              <span className="eyebrow">আমাদের দল</span>
              <h1 className="section-title">The Team</h1>
              <Ornament />
              <p className="section-subtitle">
                The students who make BLA happen.
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
          {team === null && !err && (
            <div className="grid grid-3">
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </div>
          )}

          {/* ── Empty state ── */}
          {team && team.length === 0 && (
            <div className="empty">Team will be announced soon.</div>
          )}

          {/* ── Team grid ── */}
          {team && team.length > 0 && (
            <div className="grid grid-3">
              {team.map((m, i) => (
                <ScrollReveal key={m.id} delay={0.08 * Math.min(i, 6)}>
                  <TeamCard member={m} />
                </ScrollReveal>
              ))}
            </div>
          )}
        </div>
      </section>
    </PageTransition>
  );
};

export default Team;

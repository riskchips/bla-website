import { useEffect, useState } from "react";
import PageTransition from "../components/PageTransition";
import Ornament from "../components/Ornament";
import { SkeletonCard } from "../components/Skeleton";
import { getTeam } from "../api";
import useScrollReveal from "../hooks/useScrollReveal";
import { motion } from "framer-motion";

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
    <motion.span 
      animate={{ rotate: 360 }} 
      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
    >✾</motion.span>
    <span className="bn" style={{ letterSpacing: "0.15em" }}>বর্তমান দল</span>
    <motion.span 
      animate={{ rotate: -360 }} 
      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
    >✾</motion.span>
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

/* ─── Cultural Background Motif ─── */
const CulturalMotif = () => (
  <motion.div
    aria-hidden="true"
    style={{
      position: "absolute",
      right: "-10%",
      top: "5%",
      opacity: 0.03,
      pointerEvents: "none",
      color: "var(--deep-red)",
      fontSize: "60vw",
      lineHeight: 1,
      zIndex: 0,
      userSelect: "none"
    }}
    animate={{ rotate: 360 }}
    transition={{ duration: 200, repeat: Infinity, ease: "linear" }}
  >
    ✾
  </motion.div>
);

/* ─── Enhanced Team Card ─── */
const TeamCard = ({ member }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
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
        zIndex: 1,
        position: "relative",
        background: "var(--card-bg, #fff)"
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
              objectFit: "cover"
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
    </motion.article>
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
      <section className="page" style={{ position: "relative", overflow: "hidden" }}>
        <CulturalMotif />
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          {/* ── Page Header ── */}
          <ScrollReveal>
            <div className="page-header">
              <TeamHeaderDecor />
              <span className="eyebrow">বর্তমান দল</span>
              <h1 className="section-title">Team</h1>
              <Ornament />
              {(!team || team.length > 0) && (
                <p className="section-subtitle">
                  The current team members behind BLA.
                </p>
              )}
            </div>
          </ScrollReveal>

          {/* ── Error state ── */}
          {err && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="alert error" 
              style={{ display: "flex", justifyContent: "space-between" }}
            >
              <span>{err}</span>
              <button
                className="btn ghost cursor-target"
                onClick={load}
                style={{ padding: "6px 14px" }}
              >
                Retry
              </button>
            </motion.div>
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
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="empty">
              Team will be announced soon.
            </motion.div>
          )}

          {/* ── Team Grid ── */}
          {team && team.length > 0 && (
            <div className="grid grid-3" style={{ marginTop: "40px" }}>
              {team.map((m, i) => (
                <ScrollReveal key={m.id} delay={0.05 * Math.min(i, 6)}>
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

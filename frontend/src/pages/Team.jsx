import { useEffect, useState } from "react";
import PageTransition from "../components/PageTransition";
import Ornament from "../components/Ornament";
import { SkeletonCard } from "../components/Skeleton";
import { getTeam } from "../api";
import useScrollReveal from "../hooks/useScrollReveal";
import { motion, AnimatePresence } from "framer-motion";

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
  <>
    <img src="/assets/flower.png" alt="" className="deco-flower" style={{ top: "2%", left: "auto", right: "-20px", opacity: 0.6, animationDelay: "0s" }} />
    <img src="/assets/flower2.png" alt="" className="deco-flower" style={{ top: "15%", left: "auto", right: "40px", width: "90px", transform: "rotate(-45deg)", opacity: 0.4, animationDelay: "1.5s" }} />
    <img src="/assets/flower.png" alt="" className="deco-flower" style={{ top: "35%", left: "-20px", right: "auto", width: "120px", transform: "rotate(30deg)", opacity: 0.5, animationDelay: "2s" }} />
    <img src="/assets/flower2.png" alt="" className="deco-flower" style={{ top: "55%", left: "40px", right: "auto", width: "80px", transform: "rotate(60deg)", opacity: 0.4, animationDelay: "1s" }} />
    <img src="/assets/flower.png" alt="" className="deco-flower" style={{ top: "75%", left: "auto", right: "-10px", width: "140px", transform: "rotate(-20deg)", opacity: 0.6, animationDelay: "0.5s" }} />
    <img src="/assets/flower2.png" alt="" className="deco-flower" style={{ top: "85%", left: "auto", right: "60px", width: "70px", transform: "rotate(120deg)", opacity: 0.5, animationDelay: "2.5s" }} />
  </>
);

/* ─── Helper for Bengali Initial ─── */
const getBengaliInitial = (name) => {
  if (!name) return "ব";
  const char = name.trim().charAt(0).toUpperCase();
  const map = {
    A: "অ", B: "ব", C: "চ", D: "দ", E: "এ", F: "ফ", G: "গ",
    H: "হ", I: "ই", J: "জ", K: "ক", L: "ল", M: "ম", N: "ন",
    O: "ও", P: "প", Q: "ক", R: "র", S: "স", T: "ত", U: "উ",
    V: "ভ", W: "ও", X: "জ", Y: "য", Z: "জ"
  };
  return map[char] || char;
};

/* ─── Collapsible Section ─── */
const CollapsibleSection = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <motion.div 
      layout
      style={{ 
        marginBottom: "20px",
        border: "1px solid var(--line)", 
        borderRadius: "12px", 
        overflow: "hidden", 
        background: "rgba(245, 236, 217, 0.6)",
        backdropFilter: "blur(10px)"
      }}
    >
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="cursor-target"
        style={{
          width: "100%", 
          padding: "24px", 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center",
          background: isOpen ? "rgba(184,137,58,0.15)" : "transparent",
          border: "none",
          borderBottom: isOpen ? "1px solid var(--line)" : "none",
          fontFamily: "var(--font-en-display)",
          fontSize: "1.5rem",
          color: "var(--deep-red)",
          textAlign: "left",
          transition: "background 0.3s ease"
        }}
      >
        <span>{title}</span>
        <motion.span 
          animate={{ rotate: isOpen ? 180 : 0 }} 
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          style={{ fontSize: "1.2rem", display: "inline-block", color: "var(--deep-red)" }}
        >
          ▼
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial="collapsed"
            animate="open"
            exit="collapsed"
            variants={{
              open: { opacity: 1, height: "auto" },
              collapsed: { opacity: 0, height: 0 }
            }}
            transition={{ duration: 0.5, ease: [0.04, 0.62, 0.23, 0.98] }}
          >
            <div style={{ padding: "24px" }}>
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

/* ─── Enhanced Team Card ─── */
const TeamCard = ({ member }) => {
  const [hovered, setHovered] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const isLong = member.description && member.description.length > 130;

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
        background: "#fff",
        display: "flex",
        flexDirection: "column",
        alignSelf: "flex-start"
      }}
    >
      <div style={{ overflow: "hidden", position: "relative" }}>
        {member.image ? (
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
        ) : (
          <div 
            className="photo" 
            style={{ 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center", 
              background: "var(--paper-dark)", 
              color: "var(--gold-soft)", 
              fontSize: "6rem", 
              fontFamily: "var(--font-bn-display)",
              opacity: 0.6 
            }}
          >
            {getBengaliInitial(member.name)}
          </div>
        )}
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
      <div className="meta" style={{ display: "flex", flexDirection: "column" }}>
        <h3>{member.name}</h3>
        <NameDecor />
        <div className="role">{member.role}</div>
        
        <motion.div 
          initial={false}
          animate={{ height: isExpanded ? "auto" : (isLong ? 120 : "auto") }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          style={{ position: "relative", overflow: "hidden" }}
        >
          <p className="desc" style={{ marginBottom: "10px" }}>
            {member.description}
          </p>
          <AnimatePresence>
            {isLong && !isExpanded && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  width: "100%",
                  height: "50px",
                  background: "linear-gradient(to bottom, rgba(255,255,255,0), #fff 90%)",
                  pointerEvents: "none"
                }}
              />
            )}
          </AnimatePresence>
        </motion.div>
        
        {isLong && (
          <div style={{ display: "flex", justifyContent: "center", marginTop: "4px", paddingBottom: "10px" }}>
            <button 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsExpanded(!isExpanded);
              }}
              className="cursor-target"
              style={{
                background: "none",
                border: "none",
                color: "var(--deep-red)",
                cursor: "pointer",
                fontFamily: "var(--font-en-display)",
                fontSize: "1.1rem",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "8px 16px",
                transition: "color 0.3s ease, transform 0.3s ease",
                textDecoration: "none"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "var(--gold)";
                e.currentTarget.style.transform = "translateY(1px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "var(--deep-red)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              {isExpanded ? "Show less" : "Show more"}
              <svg 
                width="14" height="14" viewBox="0 0 24 24" 
                fill="none" stroke="currentColor" strokeWidth="2.5" 
                strokeLinecap="round" strokeLinejoin="round" 
                style={{ 
                  transform: isExpanded ? "rotate(180deg)" : "none", 
                  transition: "transform 0.3s ease",
                  marginTop: isExpanded ? "0" : "2px"
                }}
              >
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>
          </div>
        )}
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
            <div style={{ display: "flex", flexDirection: "column", gap: "20px", marginTop: "40px" }}>
              {team.filter(m => !m.category || m.category === 'senior').length > 0 && (
                <CollapsibleSection title="Senior Core">
                  <div className="grid grid-3">
                    {team.filter(m => !m.category || m.category === 'senior').map((m, i) => (
                      <ScrollReveal key={m.id} delay={0.05 * Math.min(i, 6)}>
                        <TeamCard member={m} />
                      </ScrollReveal>
                    ))}
                  </div>
                </CollapsibleSection>
              )}

              {team.filter(m => m.category === 'junior').length > 0 && (
                <CollapsibleSection title="Executive Junior Core">
                  <div className="grid grid-3">
                    {team.filter(m => m.category === 'junior').map((m, i) => (
                      <ScrollReveal key={m.id} delay={0.05 * Math.min(i, 6)}>
                        <TeamCard member={m} />
                      </ScrollReveal>
                    ))}
                  </div>
                </CollapsibleSection>
              )}
            </div>
          )}
        </div>
      </section>
    </PageTransition>
  );
};

export default Team;

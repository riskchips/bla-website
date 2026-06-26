import { useEffect, useState, useMemo } from "react";
import PageTransition from "../components/PageTransition";
import Ornament from "../components/Ornament";
import { SkeletonCard } from "../components/Skeleton";
import { getBoard } from "../api";
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
    <span className="bn" style={{ letterSpacing: "0.15em" }}>সদস্য</span>
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
const Board = () => {
  const [team, setTeam] = useState(null);
  const [err, setErr] = useState(null);
  
  const currentYear = new Date().getFullYear();
  const currentBoardYear = `${currentYear}-${(currentYear + 1).toString().slice(2)}`;
  
  const [openBoards, setOpenBoards] = useState([currentBoardYear]);

  const load = () => {
    setErr(null);
    setTeam(null);
    getBoard()
      .then((r) => setTeam(r.team || []))
      .catch((e) => setErr(e.message));
  };
  useEffect(load, []);

  const groupedTeam = useMemo(() => {
    if (!team) return [];
    const grouped = {};
    team.forEach(member => {
        const year = member.board_year || "Unknown";
        if (!grouped[year]) grouped[year] = [];
        grouped[year].push(member);
    });
    // Sort years descending generally
    return Object.keys(grouped).sort((a,b) => b.localeCompare(a)).map(year => ({
        year,
        members: grouped[year]
    }));
  }, [team]);

  const toggleBoard = (year) => {
    setOpenBoards(prev => 
      prev.includes(year) ? prev.filter(y => y !== year) : [...prev, year]
    );
  };

  const getBoardLabel = (year) => {
    if (year === currentBoardYear) return "(Current Board)";
    if (year < currentBoardYear) return "(Ex Board)";
    return "(Future Board)";
  };

  return (
    <PageTransition>
      <section className="page" style={{ position: "relative", overflow: "hidden" }}>
        <CulturalMotif />
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          {/* ── Page Header ── */}
          <ScrollReveal>
            <div className="page-header">
              <TeamHeaderDecor />
              <span className="eyebrow">আমাদের দল</span>
              <h1 className="section-title">Board</h1>
              <Ornament />
              <p className="section-subtitle">
                The students who make BLA happen.
              </p>
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
              Board will be announced soon.
            </motion.div>
          )}

          {/* ── Team Accordions ── */}
          {groupedTeam.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {groupedTeam.map((group) => {
                const isOpen = openBoards.includes(group.year);
                return (
                  <motion.div 
                    key={group.year} 
                    layout
                    style={{ 
                      border: "1px solid var(--line)", 
                      borderRadius: "12px", 
                      overflow: "hidden", 
                      background: "rgba(245, 236, 217, 0.6)",
                      backdropFilter: "blur(10px)"
                    }}
                  >
                    <button 
                      className="cursor-target" 
                      onClick={() => toggleBoard(group.year)}
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
                      <span>
                        Board {group.year}
                        <span style={{ fontSize: "1rem", color: "var(--ink-soft)", marginLeft: "10px", fontWeight: "normal", fontFamily: "var(--font-en-body)" }}>
                          {getBoardLabel(group.year)}
                        </span>
                      </span>
                      <motion.span 
                        animate={{ rotate: isOpen ? 180 : 0 }} 
                        transition={{ type: "spring", stiffness: 200, damping: 15 }}
                        style={{ fontSize: "1.2rem", display: "inline-block" }}
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
                            <div className="grid grid-3">
                              {group.members.map((m, i) => (
                                <ScrollReveal key={m.id} delay={0.05 * Math.min(i, 6)}>
                                  <TeamCard member={m} />
                                </ScrollReveal>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </PageTransition>
  );
};

export default Board;

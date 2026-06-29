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

/* ─── Social Links Component ─── */
const SocialLinks = ({ github, linkedin, instagram, twitter }) => {
  if (!github && !linkedin && !instagram && !twitter) return null;
  
  const iconStyle = {
    color: "var(--deep-red)",
    width: "18px",
    height: "18px",
    transition: "transform 0.3s ease, color 0.3s ease",
  };
  
  return (
    <div style={{ display: "flex", gap: "12px", justifyContent: "center", marginTop: "12px", marginBottom: "8px" }}>
      {github && (
        <a href={github} target="_blank" rel="noopener noreferrer" aria-label="GitHub"
           onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.children[0].style.color = "var(--gold)"; }}
           onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.children[0].style.color = "var(--deep-red)"; }}
        >
          <svg style={iconStyle} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
        </a>
      )}
      {linkedin && (
        <a href={linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"
           onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.children[0].style.color = "var(--gold)"; }}
           onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.children[0].style.color = "var(--deep-red)"; }}
        >
          <svg style={iconStyle} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
        </a>
      )}
      {instagram && (
        <a href={instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram"
           onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.children[0].style.color = "var(--gold)"; }}
           onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.children[0].style.color = "var(--deep-red)"; }}
        >
          <svg style={iconStyle} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
        </a>
      )}
      {twitter && (
        <a href={twitter} target="_blank" rel="noopener noreferrer" aria-label="Twitter"
           onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.children[0].style.color = "var(--gold)"; }}
           onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.children[0].style.color = "var(--deep-red)"; }}
        >
          <svg style={iconStyle} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>
        </a>
      )}
    </div>
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
        <SocialLinks github={member.github_link} linkedin={member.linkedin_link} instagram={member.instagram_link} twitter={member.twitter_link} />
        
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

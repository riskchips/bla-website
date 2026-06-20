import { useState } from "react";
import { motion } from "framer-motion";
import PageTransition from "../components/PageTransition";
import Ornament from "../components/Ornament";
import AlpanaDivider from "../components/AlpanaDivider";
import useScrollReveal from "../hooks/useScrollReveal";

/* ─── Scroll Reveal wrapper ─── */
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

/* ─── Pillar data ─── */
const pillars = [
  {
    icon: "ক",
    title: "Literature",
    desc: "Open mics, recitations, poetry circles and writing workshops.",
  },
  {
    icon: "চ",
    title: "Art & Drawing",
    desc: "Sketchwalks, alpana sessions and exhibitions across the year.",
  },
  {
    icon: "ট",
    title: "Music & Dance",
    desc: "Rabindra Sangeet, classical, folk, and contemporary performances.",
  },
  {
    icon: "প",
    title: "Community",
    desc: "Festivals, talent showcases and the warmth of an old adda.",
  },
];

/* ─── Cultural arts ─── */
const culturalArts = [
  { emoji: "💃", en: "Dance", bn: "নৃত্য" },
  { emoji: "📚", en: "Literature", bn: "সাহিত্য" },
  { emoji: "🎵", en: "Music", bn: "সঙ্গীত" },
  { emoji: "🎨", en: "Art", bn: "চিত্রকলা" },
];

const About = () => {
  const [hoveredPillar, setHoveredPillar] = useState(null);

  return (
    <PageTransition>
      {/* Inline styles for scroll-reveal and decorative elements */}
      <style>{`
        .scroll-reveal {
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.7s ease-out, transform 0.7s ease-out;
        }
        .scroll-reveal.visible {
          opacity: 1;
          transform: translateY(0);
        }
        .about-deco {
          position: absolute;
          font-family: var(--font-bn-display);
          color: var(--terracotta);
          opacity: 0.05;
          pointer-events: none;
          z-index: 0;
        }
        .cultural-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          margin-top: 40px;
        }
        .cultural-item {
          text-align: center;
          padding: 28px 16px;
          background: linear-gradient(135deg, var(--paper) 0%, var(--paper-dark) 100%);
          border: 1px solid var(--line);
          border-radius: 8px;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .cultural-item:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 32px -12px rgba(122, 31, 26, 0.2);
        }
        .cultural-emoji {
          font-size: 2.5rem;
          margin-bottom: 8px;
          display: block;
        }
        .cultural-en {
          font-family: var(--font-en-display);
          color: var(--deep-red);
          font-size: 1.1rem;
          margin-bottom: 2px;
        }
        .cultural-bn {
          font-family: var(--font-bn-display);
          color: var(--ink-soft);
          font-size: 0.95rem;
        }
        @media (max-width: 620px) {
          .cultural-grid { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>

      <section className="page" style={{ position: "relative" }}>
        {/* Background decorative Bengali characters */}
        <span className="about-deco" style={{ top: 80, left: 30, fontSize: "8rem" }} aria-hidden="true">
          ব
        </span>
        <span className="about-deco" style={{ top: 300, right: 20, fontSize: "6rem" }} aria-hidden="true">
          ল
        </span>
        <span className="about-deco" style={{ bottom: 200, left: 50, fontSize: "7rem" }} aria-hidden="true">
          স
        </span>

        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          {/* ═══ Page Header ═══ */}
          <ScrollReveal>
            <div className="page-header">
              <span className="eyebrow">আমাদের কথা</span>
              <h1 className="section-title">About the Association</h1>
              <Ornament />
              <p className="section-subtitle">
                A cultural home, not a corporate club.
              </p>
            </div>
          </ScrollReveal>

          {/* ═══ Prose Section ═══ */}
          <ScrollReveal>
            <div className="prose">
              <p>
                The Bengali Literary Association —{" "}
                <span className="bn">ঐকতান</span> — started simply: a few students missing the familiar sound of Bengali around campus. It quickly grew into a vibrant cultural hub open to anyone, regardless of where they're from or what language they speak.
              </p>
              <p>
                We're all about celebrating what makes Bengali culture so rich—whether that's getting lost in a poem, jamming to Rabindra Sangeet, painting together, or just sharing a good adda over a cup of chai. From big festivals like Rabindra Jayanti to casual open mics and sketchwalks, everything we do is driven entirely by students.
              </p>
              <p>
                There's no strict formality here. It's just about community. If you appreciate a good tune, a moving story, or just want a place to hang out and connect, you've found your spot.
              </p>
            </div>
          </ScrollReveal>

          <AlpanaDivider />

          {/* ═══ Pillars Section ═══ */}
          <ScrollReveal>
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <span className="eyebrow">আমাদের স্তম্ভ</span>
              <h2 className="section-title" style={{ fontSize: "2rem" }}>
                Our Pillars
              </h2>
            </div>
          </ScrollReveal>

          <div className="pillars">
            {pillars.map((p, idx) => (
              <ScrollReveal key={p.title} delay={idx * 0.12}>
                <motion.div
                  className="pillar cursor-target"
                  onMouseEnter={() => setHoveredPillar(p.title)}
                  onMouseLeave={() => setHoveredPillar(null)}
                  whileHover={{ scale: 1.03 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <div
                    className="icon bn"
                    style={{
                      transition: "transform 0.3s ease",
                      transform:
                        hoveredPillar === p.title
                          ? "translateY(-6px) scale(1.15)"
                          : "translateY(0) scale(1)",
                    }}
                  >
                    {p.icon}
                  </div>
                  <h4>{p.title}</h4>
                  <p>{p.desc}</p>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>

          <AlpanaDivider />

          {/* ═══ Cultural Arts Section ═══ */}
          <ScrollReveal>
            <div style={{ textAlign: "center", marginBottom: 8 }}>
              <span className="eyebrow">আমাদের ধারা</span>
              <h2 className="section-title" style={{ fontSize: "1.8rem" }}>
                The Arts We Celebrate
              </h2>
              <Ornament />
            </div>
          </ScrollReveal>

          <div className="cultural-grid">
            {culturalArts.map((art, idx) => (
              <ScrollReveal key={art.en} delay={idx * 0.1}>
                <motion.div
                  className="cultural-item cursor-target"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <span className="cultural-emoji">{art.emoji}</span>
                  <div className="cultural-en">{art.en}</div>
                  <div className="cultural-bn">{art.bn}</div>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>

          <AlpanaDivider />

          {/* ═══ Promise Section ═══ */}
          <ScrollReveal>
            <div className="prose">
              <h3 className="italic-en">Our Promise</h3>
              <p>
                We promise to keep things authentic, student-led, and welcoming. Whether you want to take the stage, share your art, or just grab a seat and listen, there's always room for you here.
              </p>
              <p className="bn">— শব্দে শব্দে বাংলা, সুরে সুরে আমরা।</p>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </PageTransition>
  );
};

export default About;

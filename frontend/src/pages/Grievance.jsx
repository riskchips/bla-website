import { useState } from "react";
import PageTransition from "../components/PageTransition";
import Ornament from "../components/Ornament";
import TurnstileField from "../components/TurnstileField";
import { submitHelp, HELP_CATEGORIES } from "../api";
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

/* ─── Warm success animation ─── */
const SuccessAnimation = () => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      marginBottom: 20,
    }}
  >
    <div
      style={{
        width: 72,
        height: 72,
        borderRadius: "50%",
        background: "linear-gradient(135deg, var(--gold), var(--gold-soft))",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        animation: "golden-glow-pulse 2s ease-in-out infinite",
        marginBottom: 16,
      }}
    >
      <svg
        width="36"
        height="36"
        viewBox="0 0 24 24"
        fill="none"
        stroke="var(--paper)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path
          d="M5 13l4 4L19 7"
          style={{
            strokeDasharray: 48,
            strokeDashoffset: 48,
            animation: "checkmark-draw 0.6s 0.3s ease forwards",
          }}
        />
      </svg>
    </div>
    {/* Lotus decorations */}
    <div
      aria-hidden="true"
      style={{
        display: "flex",
        gap: 8,
        color: "var(--gold-soft)",
        fontSize: "1.2rem",
        opacity: 0.6,
      }}
    >
      <span>✾</span>
      <span>🪷</span>
      <span>✾</span>
    </div>
  </div>
);

/* ─── Decorative Bengali watermark ─── */
const GrievanceWatermark = () => (
  <div
    aria-hidden="true"
    className="bn"
    style={{
      position: "absolute",
      top: 24,
      right: -8,
      fontSize: "6rem",
      color: "var(--terracotta)",
      opacity: 0.03,
      pointerEvents: "none",
      userSelect: "none",
      lineHeight: 1,
      transform: "rotate(-10deg)",
      zIndex: 0,
    }}
  >
    সহায়তা
  </div>
);

/* ─── Validation ─── */
const validate = ({ name, email, phone, category, subject, details }) => {
  if (!name || name.trim().length < 2) return "Please enter your name.";
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Please enter a valid email.";
  if (phone && !/^[0-9+\-\s()]{7,15}$/.test(phone)) return "Please enter a valid phone number.";
  if (!category || !HELP_CATEGORIES.includes(category)) return "Please pick a category.";
  if (!subject || subject.trim().length < 3) return "Add a short subject.";
  if (!details || details.trim().length < 10) return "Tell us a bit more (min 10 characters).";
  return null;
};

/* ─── Main Grievance Page ─── */
const Grievance = () => {
  const [form, setForm] = useState({
    name: "", email: "", phone: "", category: "", subject: "", details: "",
  });
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    const v = validate(form);
    if (v) { setError(v); return; }
    if (!token) { setError("Please complete the captcha."); return; }
    setLoading(true);
    try {
      await submitHelp({ ...form, turnstileToken: token });
      setSuccess(true);
      setForm({ name: "", email: "", phone: "", category: "", subject: "", details: "" });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <section className="page" style={{ position: "relative", overflow: "hidden" }}>
        {/* Added Decorative Images */}
        {/* Flower Cluster */}
        <img src="/assets/flower.png" alt="" className="deco-flower" style={{ top: "5%", left: "auto", right: "-10px", opacity: 0.6, animationDelay: "0s" }} />
        <img src="/assets/flower2.png" alt="" className="deco-flower" style={{ top: "15%", left: "auto", right: "40px", width: "90px", transform: "rotate(-45deg)", opacity: 0.4, animationDelay: "1.5s" }} />
        <img src="/assets/flower.png" alt="" className="deco-flower" style={{ top: "25%", left: "auto", right: "-20px", width: "70px", transform: "rotate(30deg)", opacity: 0.5, animationDelay: "2s" }} />
        <img src="/assets/design.png" alt="" className="deco-design-motif" style={{ bottom: "5%", left: "50%", opacity: 0.15 }} />
        <div className="container" style={{ maxWidth: 720, position: "relative", zIndex: 1 }}>
          {/* ── Page Header ── */}
          <ScrollReveal>
            <div className="page-header">
              <div
                aria-hidden="true"
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: 8,
                  marginBottom: 8,
                  color: "var(--gold-soft)",
                  opacity: 0.55,
                  fontSize: "0.85rem",
                }}
              >
                <span>✾</span>
                <span>🤝</span>
                <span>✾</span>
              </div>
              <span className="eyebrow">অভিযোগ ও সহায়তা</span>
              <h1 className="section-title">Grievance Portal</h1>
              <Ornament />
              <p className="section-subtitle">
                Found a problem? Need help? Have a suggestion? Tell us here.
              </p>
            </div>
          </ScrollReveal>

          {/* ── Encouraging Bengali message ── */}
          <ScrollReveal delay={0.1}>
            <div
              style={{
                textAlign: "center",
                marginBottom: 32,
                padding: "14px 20px",
                borderLeft: "3px solid var(--gold-soft)",
                borderRight: "3px solid var(--gold-soft)",
                maxWidth: 520,
                margin: "0 auto 32px",
                background: "rgba(184, 137, 58, 0.04)",
                borderRadius: 2,
              }}
            >
              <p
                className="bn"
                style={{
                  color: "var(--ink-soft)",
                  fontSize: "1.05rem",
                  margin: 0,
                  lineHeight: 1.8,
                }}
              >
                আপনার কথা আমাদের কাছে গুরুত্বপূর্ণ
              </p>
              <p
                className="italic-en"
                style={{
                  color: "var(--ink-soft)",
                  fontSize: "0.9rem",
                  margin: "6px 0 0",
                  opacity: 0.7,
                }}
              >
                Your voice matters to us.
              </p>
            </div>
          </ScrollReveal>

          {/* ── Form / Success ── */}
          <ScrollReveal delay={0.15}>
            {success ? (
              <div className="card" style={{ textAlign: "center", position: "relative" }}>
                <SuccessAnimation />
                <h3 style={{ color: "var(--deep-red)" }}>Received · ধন্যবাদ</h3>
                <p style={{ color: "var(--ink-soft)" }}>
                  Your request has been recorded. A member of the team will look into it.
                </p>
                <button
                  className="btn cursor-target"
                  onClick={() => setSuccess(false)}
                >
                  Submit another
                </button>
              </div>
            ) : (
              <form
                onSubmit={onSubmit}
                className="card"
                style={{ position: "relative", overflow: "hidden" }}
              >
                <GrievanceWatermark />

                {error && <div className="alert error">{error}</div>}

                <div className="field">
                  <label className="label">
                    Name <span className="bn">নাম</span>
                  </label>
                  <input
                    className="input"
                    value={form.name}
                    onChange={set("name")}
                    required
                    maxLength={100}
                    id="grievance-name"
                    aria-label="Your name"
                  />
                </div>
                <div className="field">
                  <label className="label">
                    Email <span className="bn">ইমেল</span>
                  </label>
                  <input
                    className="input"
                    type="email"
                    value={form.email}
                    onChange={set("email")}
                    maxLength={255}
                    id="grievance-email"
                    aria-label="Your email"
                  />
                </div>
                <div className="field">
                  <label className="label">
                    Phone <span className="bn">ফোন</span>
                  </label>
                  <input
                    className="input"
                    value={form.phone}
                    onChange={set("phone")}
                    maxLength={15}
                    id="grievance-phone"
                    aria-label="Your phone number"
                  />
                </div>
                <div className="field">
                  <label className="label">
                    Category <span className="bn">বিভাগ</span>
                  </label>
                  <select
                    className="select"
                    value={form.category}
                    onChange={set("category")}
                    required
                    id="grievance-category"
                    aria-label="Issue category"
                  >
                    <option value="">— Select a category —</option>
                    {HELP_CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div className="field">
                  <label className="label">
                    Subject <span className="bn">বিষয়</span>
                  </label>
                  <input
                    className="input"
                    value={form.subject}
                    onChange={set("subject")}
                    required
                    maxLength={150}
                    id="grievance-subject"
                    aria-label="Subject"
                  />
                </div>
                <div className="field">
                  <label className="label">
                    Details <span className="bn">বিস্তারিত</span>
                  </label>
                  <textarea
                    className="textarea"
                    value={form.details}
                    onChange={set("details")}
                    required
                    maxLength={1500}
                    id="grievance-details"
                    aria-label="Details about your issue"
                  />
                </div>

                <TurnstileField onVerify={setToken} onExpire={() => setToken(null)} />

                <button type="submit" className="btn cursor-target" disabled={loading}>
                  {loading ? "Submitting…" : "Submit Request"}
                </button>
              </form>
            )}
          </ScrollReveal>
        </div>
      </section>
    </PageTransition>
  );
};

export default Grievance;

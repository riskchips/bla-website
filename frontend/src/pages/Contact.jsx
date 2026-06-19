import { useState } from "react";
import PageTransition from "../components/PageTransition";
import Ornament from "../components/Ornament";
import TurnstileField from "../components/TurnstileField";
import { submitContact } from "../api";
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

/* ─── Success celebration animation ─── */
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
  </div>
);

/* ─── Decorative Bengali watermark ─── */
const ContactWatermark = () => (
  <div
    aria-hidden="true"
    className="bn"
    style={{
      position: "absolute",
      top: 20,
      right: -10,
      fontSize: "7rem",
      color: "var(--terracotta)",
      opacity: 0.03,
      pointerEvents: "none",
      userSelect: "none",
      lineHeight: 1,
      transform: "rotate(-12deg)",
      zIndex: 0,
    }}
  >
    যোগাযোগ
  </div>
);

/* ─── Validation ─── */
const validate = ({ name, email, phone, details }) => {
  if (!name || name.trim().length < 2) return "Please enter your name.";
  if (name.trim().length > 100) return "Name is too long.";
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Please enter a valid email.";
  if (phone && !/^[0-9+\-\s()]{7,15}$/.test(phone)) return "Please enter a valid phone number.";
  if (!details || details.trim().length < 10) return "Tell us a bit more (min 10 characters).";
  if (details.trim().length > 1000) return "Message is too long (max 1000).";
  return null;
};

/* ─── Main Contact Page ─── */
const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", phone: "", details: "" });
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
      await submitContact({ ...form, turnstileToken: token });
      setSuccess(true);
      setForm({ name: "", email: "", phone: "", details: "" });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <section className="page" style={{ position: "relative", overflow: "hidden" }}>
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
                <span>✉</span>
                <span>✾</span>
              </div>
              <span className="eyebrow">যোগাযোগ</span>
              <h1 className="section-title">Contact Us</h1>
              <Ornament />
              <p className="section-subtitle">
                For collaborations, club inquiries or to simply say hello.
              </p>
            </div>
          </ScrollReveal>

          {/* ── Tagore quote ── */}
          <ScrollReveal delay={0.1}>
            <div
              style={{
                textAlign: "center",
                marginBottom: 32,
                padding: "14px 20px",
                borderLeft: "3px solid var(--gold-soft)",
                borderRight: "3px solid var(--gold-soft)",
                maxWidth: 480,
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
                  fontStyle: "normal",
                }}
              >
                কথায় কথায় কাটে সময় — হৃদয় রহে শূন্য।
              </p>
            </div>
          </ScrollReveal>

          {/* ── Form / Success ── */}
          <ScrollReveal delay={0.15}>
            {success ? (
              <div className="card" style={{ textAlign: "center", position: "relative" }}>
                <SuccessAnimation />
                <h3 style={{ color: "var(--deep-red)" }}>Thank you · ধন্যবাদ</h3>
                <p style={{ color: "var(--ink-soft)" }}>
                  Your message has reached us. We'll get back to you soon.
                </p>
                <button
                  className="btn cursor-target"
                  onClick={() => setSuccess(false)}
                >
                  Send another
                </button>
              </div>
            ) : (
              <form
                onSubmit={onSubmit}
                className="card"
                style={{ position: "relative", overflow: "hidden" }}
              >
                <ContactWatermark />

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
                    id="contact-name"
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
                    id="contact-email"
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
                    id="contact-phone"
                    aria-label="Your phone number"
                  />
                </div>
                <div className="field">
                  <label className="label">
                    Message <span className="bn">বার্তা</span>
                  </label>
                  <textarea
                    className="textarea"
                    value={form.details}
                    onChange={set("details")}
                    required
                    maxLength={1000}
                    id="contact-message"
                    aria-label="Your message"
                  />
                </div>

                <TurnstileField onVerify={setToken} onExpire={() => setToken(null)} />

                <button type="submit" className="btn cursor-target" disabled={loading}>
                  {loading ? "Sending…" : "Send Message"}
                </button>
              </form>
            )}
          </ScrollReveal>
        </div>
      </section>
    </PageTransition>
  );
};

export default Contact;

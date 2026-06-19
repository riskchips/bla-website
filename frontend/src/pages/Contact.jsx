import { useState } from "react";
import PageTransition from "../components/PageTransition";
import Ornament from "../components/Ornament";
import TurnstileField from "../components/TurnstileField";
import { submitContact } from "../api";

const validate = ({ name, email, phone, details }) => {
  if (!name || name.trim().length < 2) return "Please enter your name.";
  if (name.trim().length > 100) return "Name is too long.";
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Please enter a valid email.";
  if (phone && !/^[0-9+\-\s()]{7,15}$/.test(phone)) return "Please enter a valid phone number.";
  if (!details || details.trim().length < 10) return "Tell us a bit more (min 10 characters).";
  if (details.trim().length > 1000) return "Message is too long (max 1000).";
  return null;
};

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
      <section className="page">
        <div className="container" style={{ maxWidth: 720 }}>
          <div className="page-header">
            <span className="eyebrow">যোগাযোগ</span>
            <h1 className="section-title">Contact Us</h1>
            <Ornament />
            <p className="section-subtitle">
              For collaborations, club inquiries or to simply say hello.
            </p>
          </div>

          {success ? (
            <div className="card">
              <h3 style={{ color: "var(--deep-red)" }}>Thank you · ধন্যবাদ</h3>
              <p style={{ color: "var(--ink-soft)" }}>
                Your message has reached us. We'll get back to you soon.
              </p>
              <button className="btn cursor-target" onClick={() => setSuccess(false)}>Send another</button>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="card">
              {error && <div className="alert error">{error}</div>}

              <div className="field">
                <label className="label">Name <span className="bn">নাম</span></label>
                <input className="input" value={form.name} onChange={set("name")} required maxLength={100} />
              </div>
              <div className="field">
                <label className="label">Email <span className="bn">ইমেল</span></label>
                <input className="input" type="email" value={form.email} onChange={set("email")} maxLength={255} />
              </div>
              <div className="field">
                <label className="label">Phone <span className="bn">ফোন</span></label>
                <input className="input" value={form.phone} onChange={set("phone")} maxLength={15} />
              </div>
              <div className="field">
                <label className="label">Message <span className="bn">বার্তা</span></label>
                <textarea className="textarea" value={form.details} onChange={set("details")} required maxLength={1000} />
              </div>

              <TurnstileField onVerify={setToken} onExpire={() => setToken(null)} />

              <button type="submit" className="btn cursor-target" disabled={loading}>
                {loading ? "Sending…" : "Send Message"}
              </button>
            </form>
          )}
        </div>
      </section>
    </PageTransition>
  );
};

export default Contact;

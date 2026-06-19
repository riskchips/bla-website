import { useState } from "react";
import PageTransition from "../components/PageTransition";
import Ornament from "../components/Ornament";
import TurnstileField from "../components/TurnstileField";
import { submitHelp, HELP_CATEGORIES } from "../api";

const validate = ({ name, email, phone, category, subject, details }) => {
  if (!name || name.trim().length < 2) return "Please enter your name.";
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Please enter a valid email.";
  if (phone && !/^[0-9+\-\s()]{7,15}$/.test(phone)) return "Please enter a valid phone number.";
  if (!category || !HELP_CATEGORIES.includes(category)) return "Please pick a category.";
  if (!subject || subject.trim().length < 3) return "Add a short subject.";
  if (!details || details.trim().length < 10) return "Tell us a bit more (min 10 characters).";
  return null;
};

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
      <section className="page">
        <div className="container" style={{ maxWidth: 720 }}>
          <div className="page-header">
            <span className="eyebrow">অভিযোগ ও সহায়তা</span>
            <h1 className="section-title">Grievance Portal</h1>
            <Ornament />
            <p className="section-subtitle">
              Found a problem? Need help? Have a suggestion? Tell us here.
            </p>
          </div>

          {success ? (
            <div className="card">
              <h3 style={{ color: "var(--deep-red)" }}>Received · ধন্যবাদ</h3>
              <p style={{ color: "var(--ink-soft)" }}>
                Your request has been recorded. A member of the team will look into it.
              </p>
              <button className="btn cursor-target" onClick={() => setSuccess(false)}>Submit another</button>
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
                <label className="label">Category <span className="bn">বিভাগ</span></label>
                <select className="select" value={form.category} onChange={set("category")} required>
                  <option value="">— Select a category —</option>
                  {HELP_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="field">
                <label className="label">Subject <span className="bn">বিষয়</span></label>
                <input className="input" value={form.subject} onChange={set("subject")} required maxLength={150} />
              </div>
              <div className="field">
                <label className="label">Details <span className="bn">বিস্তারিত</span></label>
                <textarea className="textarea" value={form.details} onChange={set("details")} required maxLength={1500} />
              </div>

              <TurnstileField onVerify={setToken} onExpire={() => setToken(null)} />

              <button type="submit" className="btn cursor-target" disabled={loading}>
                {loading ? "Submitting…" : "Submit Request"}
              </button>
            </form>
          )}
        </div>
      </section>
    </PageTransition>
  );
};

export default Grievance;

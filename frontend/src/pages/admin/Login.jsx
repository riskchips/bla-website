import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ADMIN_KEY = "bla_admin_token";

const Login = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem(ADMIN_KEY);
    if (token) {
      fetch("/api/admin/verify", {
        method: "POST",
        headers: { "Authorization": token }
      })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          navigate("/admin-bla-x7ke/dashboard", { replace: true });
        } else {
          setChecking(false);
          localStorage.removeItem(ADMIN_KEY);
        }
      })
      .catch(() => setChecking(false));
    } else {
      setChecking(false);
    }
  }, [navigate]);

  const submit = async (e) => {
    e.preventDefault();
    if (!password || password.length < 4) { setError("Enter the admin password."); return; }
    
    try {
      const res = await fetch("/api/admin/verify", {
        method: "POST",
        headers: { "Authorization": password }
      });
      
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError("Invalid password.");
        return;
      }
      
      localStorage.setItem(ADMIN_KEY, password);
      navigate("/admin-bla-x7ke/dashboard", { replace: true });
    } catch (err) {
      setError("Failed to contact server.");
    }
  };

  if (checking) return <div style={{ minHeight: "100vh", background: "var(--bg-cream)" }} />;

  return (
    <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, background: "var(--bg-cream)" }}>
      <form onSubmit={submit} className="card" style={{ width: "100%", maxWidth: 400 }}>
        <h1 style={{ color: "var(--deep-red)", fontFamily: "var(--font-en-display)", marginBottom: 4 }}>Admin Access</h1>
        <p style={{ color: "var(--ink-soft)", marginBottom: 24, fontSize: ".9rem" }}>
          Restricted area. Authorized personnel only.
        </p>
        {error && <div className="alert error">{error}</div>}
        <div className="field">
          <label className="label">Password</label>
          <input
            type="password"
            className="input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoFocus
            autoComplete="current-password"
          />
        </div>
        <button type="submit" className="btn cursor-target" style={{ width: "100%" }}>Sign in</button>
      </form>
    </main>
  );
};

export default Login;

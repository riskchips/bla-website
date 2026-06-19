import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ADMIN_KEY = "bla_admin_token";

const Login = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const submit = (e) => {
    e.preventDefault();
    if (!password || password.length < 4) { setError("Enter the admin password."); return; }
    localStorage.setItem(ADMIN_KEY, password);
    navigate("/admin-bla-x7k2/dashboard", { replace: true });
  };

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

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ADMIN_KEY = "bla_admin_token";

const Dashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem(ADMIN_KEY)) {
      navigate("/admin-bla-x7k2", { replace: true });
    }
  }, [navigate]);

  const logout = () => {
    localStorage.removeItem(ADMIN_KEY);
    navigate("/admin-bla-x7k2", { replace: true });
  };

  const panels = [
    { title: "Contacts", desc: "View contact submissions (GET /api/get/contact)" },
    { title: "Help Requests", desc: "View grievances (GET /api/view/help)" },
    { title: "Notifications", desc: "Manage public notifications" },
    { title: "Events", desc: "Manage events.json" },
    { title: "Team", desc: "Manage team.json" },
  ];

  return (
    <main style={{ minHeight: "100vh", background: "var(--bg-cream)", padding: "40px 24px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
          <div>
            <h1 style={{ color: "var(--deep-red)", margin: 0, fontFamily: "var(--font-en-display)" }}>Admin Dashboard</h1>
            <p style={{ color: "var(--ink-soft)", margin: "4px 0 0" }}>BLA — internal control panel</p>
          </div>
          <button className="btn ghost cursor-target" onClick={logout}>Logout</button>
        </header>

        <div className="grid grid-3">
          {panels.map((p) => (
            <article className="card cursor-target" key={p.title}>
              <h3 style={{ color: "var(--deep-red)", fontFamily: "var(--font-en-display)" }}>{p.title}</h3>
              <p style={{ color: "var(--ink-soft)", fontSize: ".95rem" }}>{p.desc}</p>
              <p style={{ color: "var(--terracotta)", fontSize: ".85rem", marginTop: 14 }}>Ready for API wiring.</p>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
};

export default Dashboard;

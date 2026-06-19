import { Link } from "react-router-dom";
import PageTransition from "../components/PageTransition";

const NotFound = () => (
  <PageTransition>
    <section className="page" style={{ textAlign: "center" }}>
      <div className="container">
        <div className="bn" style={{ fontSize: "5rem", color: "var(--deep-red)", lineHeight: 1 }}>৪০৪</div>
        <h1 className="section-title" style={{ marginTop: 8 }}>Page not found</h1>
        <p style={{ color: "var(--ink-soft)" }}>The page you're looking for doesn't exist.</p>
        <div style={{ marginTop: 20 }}>
          <Link to="/" className="btn cursor-target">Back home</Link>
        </div>
      </div>
    </section>
  </PageTransition>
);

export default NotFound;

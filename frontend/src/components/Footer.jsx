import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="footer">
    <div className="container">
      <div className="footer-grid">
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
            <img src="/assets/logo.png" alt="" style={{ width: 40, height: 40 }} />
            <div>
              <div style={{ fontFamily: "var(--font-en-display)", color: "var(--deep-red)", fontWeight: 600 }}>
                Bengali Literary Association
              </div>
              <div className="bn" style={{ color: "var(--ink-soft)", fontSize: 14 }}>
                বাংলা সাহিত্য সংঘ
              </div>
            </div>
          </div>
          <p style={{ color: "var(--ink-soft)", maxWidth: 380 }}>
            A cultural sanctuary for literature, music, dance and art — built by students,
            for students, rooted in Bengali heritage.
          </p>
        </div>

        <div>
          <h4>Explore</h4>
          <ul>
            <li><Link to="/about" className="cursor-target">About</Link></li>
            <li><Link to="/events" className="cursor-target">Events</Link></li>
            <li><Link to="/gallery" className="cursor-target">Gallery</Link></li>
            <li><Link to="/team" className="cursor-target">Team</Link></li>
          </ul>
        </div>

        <div>
          <h4>Connect</h4>
          <ul>
            <li><Link to="/contact" className="cursor-target">Contact</Link></li>
            <li><Link to="/grievance" className="cursor-target">Grievance Portal</Link></li>
            <li><Link to="/terms" className="cursor-target">Terms</Link></li>
            <li><Link to="/privacy" className="cursor-target">Privacy</Link></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Bengali Literary Association · All rights reserved.</span>
        <span className="bn">শব্দে শব্দে বাংলা</span>
      </div>
    </div>
  </footer>
);

export default Footer;

import { useState } from "react";
import { NavLink, Link } from "react-router-dom";

const links = [
  { to: "/", label: "Home", end: true },
  { to: "/about", label: "About" },
  { to: "/events", label: "Events" },
  { to: "/gallery", label: "Gallery" },
  { to: "/team", label: "Team" },
  { to: "/contact", label: "Contact" },
  { to: "/grievance", label: "Grievance" },
];

const Nav = () => {
  const [open, setOpen] = useState(false);
  return (
    <header className="nav">
      <div className="nav-inner">
        <Link to="/" className="nav-brand cursor-target" onClick={() => setOpen(false)}>
          <img src="/assets/logo.png" alt="BLA logo" />
          <span className="nav-brand-text">
            <span className="en">Bengali Literary Association</span>
            <span className="bn">বাংলা সাহিত্য সংঘ</span>
          </span>
        </Link>
        <button
          className="nav-toggle cursor-target"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          ☰
        </button>
        <nav className={`nav-links ${open ? "open" : ""}`} aria-label="Primary">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) => `cursor-target ${isActive ? "active" : ""}`}
              onClick={() => setOpen(false)}
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Nav;

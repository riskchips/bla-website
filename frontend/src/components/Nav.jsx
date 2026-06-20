import { useState, useEffect } from "react";
import { NavLink, Link } from "react-router-dom";

const links = [
  { to: "/", label: "Home", end: true },
  { to: "/about", label: "About" },
  { to: "/events", label: "Events" },
  { to: "/gallery", label: "Gallery" },
  { to: "/board", label: "Board" },
  { to: "/contact", label: "Contact" },
  { to: "/grievance", label: "Grievance" },
];

const Nav = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`nav ${scrolled ? "nav-scrolled" : ""}`}
      style={
        scrolled
          ? {
              padding: 0,
              backdropFilter: "saturate(180%) blur(14px)",
              WebkitBackdropFilter: "saturate(180%) blur(14px)",
              background: "rgba(245, 236, 217, 0.96)",
              boxShadow: "0 2px 24px rgba(107, 29, 29, 0.08)",
            }
          : undefined
      }
    >
      <div
        className="nav-inner"
        style={
          scrolled
            ? { padding: "10px 24px", transition: "padding 0.3s ease" }
            : { transition: "padding 0.3s ease" }
        }
      >
        <Link
          to="/"
          className="nav-brand cursor-target"
          onClick={() => setOpen(false)}
        >
          <img
            src="/assets/logo.png"
            alt="BLA logo"
            style={{
              transition: "transform 0.3s ease",
              borderRadius: "50%",
              width: "44px",
              height: "44px",
              transform: scrolled ? "scale(0.92)" : "scale(1)",
            }}
          />
          <span className="nav-brand-text">
            <span className="en">Bengali Literary Association</span>
            <span className="bn">ঐকতান</span>
          </span>
        </Link>

        <button
          className="nav-toggle cursor-target"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          style={{
            transition: "transform 0.3s ease",
            transform: open ? "rotate(90deg)" : "rotate(0deg)",
          }}
        >
          {open ? "✕" : "☰"}
        </button>

        <nav
          className={`nav-links ${open ? "open" : ""}`}
          aria-label="Primary"
          style={{
            transition: "opacity 0.3s ease, transform 0.3s ease",
          }}
        >
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                `cursor-target ${isActive ? "active" : ""}`
              }
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

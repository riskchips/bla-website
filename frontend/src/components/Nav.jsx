import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import GlassSurface from "./GlassSurface";

const links = [
  { to: "/", label: "Home", exact: true },
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
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const location = useLocation();

  // Close mobile menu on route change
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  // scrolled = past hero dark section → switch to maroon/dark text
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 120);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // When on home page at top → dark bg behind nav → use cream text
  const isHome = location.pathname === "/";
  const onDarkBg = isHome && !scrolled;

  return (
    <header
      className={`glass-nav ${scrolled ? "glass-nav--scrolled" : ""} ${onDarkBg ? "glass-nav--dark-bg" : "glass-nav--light-bg"}`}
    >
      {/* GlassSurface — exact ReactBits preset */}
      <GlassSurface
        width="100%"
        height="auto"
        borderRadius={scrolled ? 28 : 50}
        borderWidth={0.07}
        brightness={50}
        opacity={0.93}
        blur={11}
        displace={0.5}
        backgroundOpacity={0.1}
        saturation={1}
        distortionScale={-180}
        redOffset={0}
        greenOffset={10}
        blueOffset={20}
        className="glass-nav__surface"
      >
        <div className="glass-nav__inner">
          {/* Brand */}
          <Link
            to="/"
            className="glass-nav__brand cursor-target"
            onClick={() => setOpen(false)}
          >
            <img
              src="/assets/logo.png"
              alt="BLA logo"
              className="glass-nav__logo"
            />
            <div className="glass-nav__brand-text">
              <span className="glass-nav__brand-en glass-nav__brand-en--full">
                Bengali Literary Association
              </span>
              <span className="glass-nav__brand-en glass-nav__brand-en--short">
                BLA
              </span>
              <span className="glass-nav__brand-bn">ঐকতান</span>
            </div>
          </Link>

          {/* Mobile toggle */}
          <button
            className="glass-nav__toggle cursor-target"
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <motion.span
              animate={{ rotate: open ? 90 : 0 }}
              transition={{ duration: 0.2 }}
              style={{ display: "inline-block" }}
            >
              {open ? "✕" : "☰"}
            </motion.span>
          </button>

          {/* Desktop links */}
          <nav
            className="glass-nav__links"
            onMouseLeave={() => setHoveredIndex(null)}
          >
            {links.map((l, index) => {
              const isActive = l.exact
                ? location.pathname === l.to
                : location.pathname.startsWith(l.to);

              return (
                <Link
                  key={l.to}
                  to={l.to}
                  className={`glass-nav__link cursor-target ${isActive ? "glass-nav__link--active" : ""}`}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onClick={() => setOpen(false)}
                >
                  <AnimatePresence>
                    {hoveredIndex === index && !isActive && (
                      <motion.span
                        className="glass-nav__link-hover"
                        layoutId="nav-hover"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                      />
                    )}
                  </AnimatePresence>

                  {isActive && (
                    <motion.span
                      className="glass-nav__link-active"
                      layoutId="nav-active-pill"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}

                  <span className="glass-nav__link-label">
                    {l.label}
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>
      </GlassSurface>

      {/* Mobile dropdown — outside GlassSurface to avoid distortion */}
      <AnimatePresence>
        {open && (
          <motion.nav
            className="glass-nav__mobile"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
          >
            {links.map((l) => {
              const isActive = l.exact
                ? location.pathname === l.to
                : location.pathname.startsWith(l.to);

              return (
                <Link
                  key={l.to}
                  to={l.to}
                  className={`glass-nav__mobile-link cursor-target ${isActive ? "glass-nav__mobile-link--active" : ""}`}
                  onClick={() => setOpen(false)}
                >
                  {l.label}
                </Link>
              );
            })}
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Nav;


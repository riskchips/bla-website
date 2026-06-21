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
  const [pastHero, setPastHero] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const location = useLocation();

  // Close mobile menu on route change
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  // scrolled = shrink navbar
  // pastHero = switch from cream text to dark text
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 120);
      setPastHero(window.scrollY > Math.max(window.innerHeight * 0.8, 400));
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // When on home page at top → dark bg behind nav → use cream text
  const isHome = location.pathname === "/";
  const onDarkBg = isHome && !pastHero;

  return (
    <header
      className={`glass-nav ${scrolled ? "glass-nav--scrolled" : ""} ${onDarkBg ? "glass-nav--dark-bg" : "glass-nav--light-bg"}`}
    >
      {/* GlassSurface — exact ReactBits preset */}
      <GlassSurface
        width="100%"
        height="auto"
        borderRadius={32}
        borderWidth={0.2}
        brightness={61}
        opacity={1}
        blur={30}
        displace={0.8}
        backgroundOpacity={0.1}
        saturation={3}
        distortionScale={90}
        redOffset={36}
        greenOffset={23}
        blueOffset={30}
        className="glass-nav__surface"
      >
        <div className="glass-nav__inner">
          {/* Brand */}
          <Link
            to="/"
            className="glass-nav__brand cursor-target"
            onClick={() => setOpen(false)}
          >
            <div className="glass-nav__logo-wrapper">
              <img
                src="/assets/logo_light.png"
                alt="BLA logo light"
                className="glass-nav__logo glass-nav__logo--light"
              />
              <img
                src="/assets/logo_dark.png"
                alt="BLA logo dark"
                className="glass-nav__logo glass-nav__logo--dark"
              />
            </div>
            <div className="glass-nav__brand-text">
              <span className="glass-nav__brand-en glass-nav__brand-en--full">
                Bengali Literary Association
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


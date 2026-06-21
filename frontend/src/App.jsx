import React, { Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Nav from './components/Nav';
import Footer from './components/Footer';
import TargetCursor from './components/TargetCursor';
import FloatingParticles from './components/FloatingParticles';
import EasterEggs from './components/EasterEggs';
import DecorativeAlpana from './components/DecorativeAlpana';

// Lazy loaded routes for performance
const Home = React.lazy(() => import('./pages/Home'));
const About = React.lazy(() => import('./pages/About'));
const Events = React.lazy(() => import('./pages/Events'));
const Gallery = React.lazy(() => import('./pages/Gallery'));
const Board = React.lazy(() => import('./pages/Board'));
const Contact = React.lazy(() => import('./pages/Contact'));
const Grievance = React.lazy(() => import('./pages/Grievance'));
const Terms = React.lazy(() => import('./pages/Terms'));
const Privacy = React.lazy(() => import('./pages/Privacy'));
const NotFound = React.lazy(() => import('./pages/NotFound'));
const AdminLogin = React.lazy(() => import('./pages/admin/Login'));
const AdminDashboard = React.lazy(() => import('./pages/admin/Dashboard'));

// Admin route — intentionally obscure so it cannot be guessed.
// Not linked from anywhere in the public site.
const ADMIN_ROOT = '/admin-bla-x7ke';

// A simple loading fallback for Suspense
const PageLoader = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'var(--bg)' }}>
    <div className="spinner" style={{ width: '40px', height: '40px', border: '3px solid var(--line)', borderTopColor: 'var(--maroon)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
    <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
  </div>
);

const App = () => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith(ADMIN_ROOT);

  return (
    <>
      <FloatingParticles count={18} />
      <EasterEggs />
      <DecorativeAlpana />
      <TargetCursor targetSelector=".cursor-target" spinDuration={2.5} hideDefaultCursor={false} />
      {!isAdmin && <Nav />}
      <AnimatePresence mode="wait">
        <Suspense fallback={<PageLoader />}>
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/events" element={<Events />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/board" element={<Board />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/grievance" element={<Grievance />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path={ADMIN_ROOT} element={<AdminLogin />} />
            <Route path={`${ADMIN_ROOT}/dashboard`} element={<AdminDashboard />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </AnimatePresence>
      {!isAdmin && <Footer />}
    </>
  );
};

export default App;

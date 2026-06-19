import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Nav from './components/Nav';
import Footer from './components/Footer';
import TargetCursor from './components/TargetCursor';
import FloatingParticles from './components/FloatingParticles';
import EasterEggs from './components/EasterEggs';

import Home from './pages/Home';
import About from './pages/About';
import Events from './pages/Events';
import Gallery from './pages/Gallery';
import Team from './pages/Team';
import Contact from './pages/Contact';
import Grievance from './pages/Grievance';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import NotFound from './pages/NotFound';
import AdminLogin from './pages/admin/Login';
import AdminDashboard from './pages/admin/Dashboard';

// Admin route — intentionally obscure so it cannot be guessed.
// Not linked from anywhere in the public site.
const ADMIN_ROOT = '/admin-bla-x7ke';

const App = () => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith(ADMIN_ROOT);

  return (
    <>
      <FloatingParticles count={18} />
      <EasterEggs />
      <TargetCursor targetSelector=".cursor-target" spinDuration={2.5} hideDefaultCursor={false} />
      {!isAdmin && <Nav />}
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/events" element={<Events />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/team" element={<Team />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/grievance" element={<Grievance />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path={ADMIN_ROOT} element={<AdminLogin />} />
          <Route path={`${ADMIN_ROOT}/dashboard`} element={<AdminDashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AnimatePresence>
      {!isAdmin && <Footer />}
    </>
  );
};

export default App;

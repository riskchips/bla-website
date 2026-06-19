import { motion } from 'framer-motion';

const PageTransition = ({ children }) => (
  <motion.main
    initial={{ opacity: 0, y: 24, scale: 0.99 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, y: -12, scale: 0.99 }}
    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
  >
    {children}
  </motion.main>
);

export default PageTransition;

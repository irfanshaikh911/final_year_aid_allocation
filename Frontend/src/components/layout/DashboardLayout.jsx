import { Outlet, useLocation } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from './Sidebar';
import DashboardNavbar from './DashboardNavbar';
import { useAppStore } from '../../store/appStore';

export default function DashboardLayout() {
  const { sidebarOpen } = useAppStore();
  const location = useLocation();
  const mainRef = useRef(null);

  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollTo(0, 0);
    }
  }, [location.pathname]);

  return (
    <div className="h-screen flex bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Container — margin synced with sidebar width via motion */}
      <motion.div
        animate={{ marginLeft: sidebarOpen ? 232 : 60 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className="flex-1 flex flex-col min-w-0 overflow-hidden"
      >
        {/* Tricolour strip */}
        <div className="tricolour-strip flex-shrink-0 z-40" />

        {/* Navbar */}
        <DashboardNavbar />

        {/* Body */}
        <main
          ref={mainRef}
          className="flex-1 overflow-y-auto custom-scroll"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="h-full"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </motion.div>
    </div>
  );
}

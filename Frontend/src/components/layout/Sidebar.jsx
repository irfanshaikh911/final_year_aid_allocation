import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Map, Radio, Package, Zap, Bot, ChevronLeft, ChevronRight
} from 'lucide-react';
import { useAppStore } from '../../store/appStore';
import logo from '../../assets/logo.png';

const navItems = [
  { label: 'Dashboard',          icon: LayoutDashboard, path: '/dashboard' },
  { label: 'Live Map',           icon: Map,              path: '/map' },
  { label: 'Drone Feed',         icon: Radio,            path: '/drone' },
  { label: 'Inventory',          icon: Package,          path: '/inventory' },
  { label: 'AI Strategy Engine', icon: Zap,              path: '/ai-engine' },
  { label: 'DAVI Assistant',     icon: Bot,              path: '/chatbot' },
];

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};
const itemAnim = {
  hidden: { opacity: 0, x: -12 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3, ease: 'easeOut' } },
};

export default function Sidebar() {
  const { sidebarOpen, setSidebarOpen } = useAppStore();
  const location = useLocation();

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 z-20 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        animate={{ width: sidebarOpen ? 232 : 60 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className="fixed top-0 left-0 h-full z-30 flex flex-col overflow-hidden bg-white border-r border-slate-200 shadow-sm"
      >
        {/* Logo area */}
        <div className="flex items-center gap-2.5 px-3.5 py-4 border-b border-slate-100 flex-shrink-0">
          <div className="flex-shrink-0 w-8 h-8 rounded-lg overflow-hidden border border-orange-200 bg-orange-50">
            <img src={logo} alt="DAVI" className="w-full h-full object-contain p-0.5" />
          </div>
          <AnimatePresence>
            {sidebarOpen && (
              <motion.div
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.2 }}
                className="min-w-0 flex-1 overflow-hidden"
              >
                <p className="text-navy font-bold text-sm leading-tight truncate">DAVI VISION</p>
                <p className="text-slate-400 text-[9px] tracking-widest uppercase truncate">Disaster Command</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-3 overflow-hidden">
          <motion.ul
            variants={stagger}
            initial="visible"
            animate="visible"
            className="space-y-0.5"
          >
            {navItems.map(({ label, icon: Icon, path }) => {
              const isActive = location.pathname === path;
              return (
                <motion.li key={path} variants={itemAnim}>
                  <Link
                    to={path}
                    title={!sidebarOpen ? label : undefined}
                    className={`sidebar-link ${isActive ? 'active' : ''}`}
                  >
                    <Icon className="w-[18px] h-[18px] flex-shrink-0" />
                    <AnimatePresence>
                      {sidebarOpen && (
                        <motion.span
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: 'auto' }}
                          exit={{ opacity: 0, width: 0 }}
                          transition={{ duration: 0.18 }}
                          className="truncate"
                        >
                          {label}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </Link>
                </motion.li>
              );
            })}
          </motion.ul>
        </nav>

        {/* System status */}
        <div className="flex-shrink-0 px-2.5 py-2.5 border-t border-slate-100">
          <div className={`flex items-center gap-2 px-2 py-1.5 rounded-lg bg-green-50 ${!sidebarOpen ? 'justify-center' : ''}`}>
            <span className="relative flex-shrink-0">
              <span className="block w-2 h-2 rounded-full bg-green-500" />
              <span className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-60" />
            </span>
            <AnimatePresence>
              {sidebarOpen && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-[10px] text-green-700 font-semibold tracking-wide uppercase"
                >
                  Systems Live
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Collapse / Expand button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="flex-shrink-0 flex items-center justify-center h-9 border-t border-slate-100 text-slate-400 hover:text-navy hover:bg-slate-50 transition-all duration-200"
          aria-label="Toggle sidebar"
        >
          {sidebarOpen
            ? <ChevronLeft className="w-4 h-4" />
            : <ChevronRight className="w-4 h-4" />
          }
        </button>
      </motion.aside>
    </>
  );
}

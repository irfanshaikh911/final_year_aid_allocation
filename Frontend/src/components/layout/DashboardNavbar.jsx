import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, AlertTriangle, User, ChevronDown, Menu } from 'lucide-react';
import { useAppStore } from '../../store/appStore';
import { formatDate, formatTime } from '../../utils/formatters';
import logo from '../../assets/logo.png';

export default function DashboardNavbar() {
  const { toggleSidebar, alerts } = useAppStore();
  const [time, setTime] = useState(new Date());
  const [showNotifs, setShowNotifs] = useState(false);
  const criticalCount = alerts.filter(a => a.type === 'critical').length;

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <header className="h-14 bg-white/90 backdrop-blur-md border-b border-slate-200 flex items-center px-4 gap-4 z-10 flex-shrink-0 shadow-sm">
      {/* Hamburger */}
      <button
        onClick={toggleSidebar}
        className="text-slate-500 hover:text-orange-500 transition-colors p-1.5 rounded-lg hover:bg-orange-50"
        aria-label="Toggle sidebar"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Logo + Title */}
      <div className="hidden sm:flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-lg overflow-hidden border border-orange-200 bg-orange-50 flex-shrink-0">
          <img src={logo} alt="DAVI" className="w-full h-full object-contain p-0.5" />
        </div>
        <div>
          <span className="text-navy font-bold text-sm tracking-wide">DAVI VISION</span>
          <span className="text-slate-400 text-xs hidden md:inline ml-2">| Command Center</span>
        </div>
      </div>

      <div className="flex-1" />

      {/* Date / Time */}
      <div className="hidden md:flex flex-col items-end">
        <span className="text-navy text-xs font-semibold tabular-nums">{formatTime(time)}</span>
        <span className="text-slate-400 text-[10px]">{formatDate(time)}</span>
      </div>

      {/* Emergency Status */}
      <div className="hidden sm:flex items-center gap-1.5 bg-red-50 border border-red-200 rounded-lg px-3 py-1.5">
        <span className="relative flex-shrink-0">
          <span className="block w-1.5 h-1.5 rounded-full bg-red-500" />
          <span className="absolute inset-0 rounded-full bg-red-400 animate-ping opacity-70" />
        </span>
        <span className="text-red-600 text-[10px] font-bold tracking-widest uppercase">Emergency Active</span>
      </div>

      {/* Notifications */}
      <div className="relative">
        <button
          onClick={() => setShowNotifs(!showNotifs)}
          className="relative text-slate-500 hover:text-orange-500 transition-colors p-1.5 rounded-lg hover:bg-orange-50"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5" />
          {criticalCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[8px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
              {criticalCount}
            </span>
          )}
        </button>

        <AnimatePresence>
          {showNotifs && (
            <motion.div
              initial={{ opacity: 0, y: -6, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.97 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-11 w-72 bg-white rounded-xl shadow-xl border border-slate-200 z-50 overflow-hidden"
            >
              <div className="bg-navy px-4 py-2.5 flex items-center justify-between">
                <span className="text-white text-xs font-semibold uppercase tracking-wider">Active Alerts</span>
                <span className="text-[10px] font-bold text-red-300 bg-red-500/20 px-2 py-0.5 rounded-full">
                  {criticalCount} Critical
                </span>
              </div>
              <div className="max-h-64 overflow-y-auto custom-scroll">
                {alerts.slice(0, 4).map((a) => (
                  <div key={a.id} className="px-4 py-3 border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className={`w-4 h-4 mt-0.5 flex-shrink-0 ${a.type === 'critical' ? 'text-red-500' : 'text-amber-500'}`} />
                      <div>
                        <p className="text-xs text-gray-700 leading-relaxed">{a.message}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">{a.zone} · {a.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-4 py-2.5 bg-slate-50 text-center border-t border-slate-100">
                <span className="text-xs text-navy font-semibold cursor-pointer hover:text-orange-500 transition-colors">View All Alerts →</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* User */}
      <button className="flex items-center gap-2 group">
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center shadow-sm">
          <User className="w-4 h-4 text-white" />
        </div>
        <div className="hidden md:flex flex-col items-start">
          <span className="text-xs text-navy font-semibold leading-tight group-hover:text-orange-500 transition-colors">Ctrl. Rajesh K.</span>
          <span className="text-[10px] text-slate-400 leading-tight">NDRF Admin</span>
        </div>
        <ChevronDown className="w-3 h-3 text-slate-400 hidden md:block" />
      </button>
    </header>
  );
}

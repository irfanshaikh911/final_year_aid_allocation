import { AlertTriangle, X, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../../store/appStore';

export default function AlertPanel() {
  const { alerts, dismissAlert } = useAppStore();
  const criticalCount = alerts.filter(a => a.type === 'critical').length;

  const typeConfig = {
    critical: {
      icon: AlertTriangle,
      iconCls: 'text-red-500 animate-pulse',
      label: 'CRITICAL',
      labelCls: 'bg-red-100 text-red-700',
      cls: 'alert-item',
    },
    warning: {
      icon: AlertTriangle,
      iconCls: 'text-amber-500',
      label: 'WARNING',
      labelCls: 'bg-amber-100 text-amber-700',
      cls: 'alert-item-warning',
    },
    info: {
      icon: Info,
      iconCls: 'text-blue-500',
      label: 'INFO',
      labelCls: 'bg-blue-100 text-blue-700',
      cls: 'flex items-start gap-3 p-3 rounded-lg border-l-4 bg-blue-50 border-blue-400 mb-2 hover:shadow-sm hover:-translate-y-0.5 transition-all duration-300',
    },
  };

  return (
    <div className="content-card h-full flex flex-col">
      <div className="section-header flex-shrink-0">
        <AlertTriangle className="w-4 h-4 text-red-500" />
        <h2 className="section-title">Live Alerts</h2>
        {criticalCount > 0 && (
          <span className="ml-auto text-[10px] font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded-full">
            {criticalCount} Critical
          </span>
        )}
      </div>

      <div className="flex-1 overflow-y-auto min-h-0 custom-scroll space-y-0 pr-1">
        {alerts.length === 0 && (
          <div className="py-8 text-center text-slate-400 text-sm">No active alerts</div>
        )}
        <AnimatePresence>
          {alerts.map((alert, i) => {
            const cfg = typeConfig[alert.type] || typeConfig.info;
            const Icon = cfg.icon;
            return (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10, height: 0 }}
                transition={{ delay: i * 0.04, duration: 0.25 }}
                className={cfg.cls}
              >
                <Icon className={`w-4 h-4 flex-shrink-0 mt-0.5 ${cfg.iconCls}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className={`inline-block text-[9px] font-bold tracking-wider uppercase px-1.5 py-0.5 rounded-full ${cfg.labelCls}`}>
                      {cfg.label}
                    </span>
                    <span className="text-[10px] text-slate-400">{alert.time}</span>
                  </div>
                  <p className="text-xs text-gray-700 leading-relaxed">{alert.message}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Zone: {alert.zone}</p>
                </div>
                <button
                  onClick={() => dismissAlert(alert.id)}
                  className="text-slate-300 hover:text-red-500 transition-colors flex-shrink-0"
                  aria-label="Dismiss"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}

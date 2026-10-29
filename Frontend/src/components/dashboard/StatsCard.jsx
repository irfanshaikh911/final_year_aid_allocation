import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { motion } from 'framer-motion';
import { formatNumber } from '../../utils/formatters';

const colorMap = {
  navy:   { icon: 'bg-navy text-white',         border: 'border-blue-100',  val: 'text-navy' },
  saffron:{ icon: 'bg-orange-500 text-white',    border: 'border-orange-100',val: 'text-orange-600' },
  red:    { icon: 'bg-red-600 text-white',       border: 'border-red-100',   val: 'text-red-700' },
  green:  { icon: 'bg-green-600 text-white',     border: 'border-green-100', val: 'text-green-700' },
};

export default function StatsCard({ label, value, unit = '', icon: Icon, trend, trendValue, color = 'navy', className = '' }) {
  const c = colorMap[color] || colorMap.navy;
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
  const trendColor = trend === 'up' ? 'text-red-500' : trend === 'down' ? 'text-green-600' : 'text-slate-400';

  return (
    <motion.div
      whileHover={{ y: -3, boxShadow: '0 8px 24px rgba(0,0,0,0.09)' }}
      transition={{ duration: 0.22 }}
      className={`bg-white rounded-xl border ${c.border} border border-slate-200 p-5 shadow-sm ${className}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 truncate">{label}</p>
          <div className="flex items-baseline gap-1.5">
            <motion.span
              className={`text-2xl font-bold leading-none ${c.val}`}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, ease: 'backOut' }}
            >
              {typeof value === 'number' ? formatNumber(value) : value}
            </motion.span>
            {unit && <span className="text-sm text-slate-400">{unit}</span>}
          </div>
          {trendValue && (
            <div className={`flex items-center gap-1 mt-1.5 ${trendColor}`}>
              <TrendIcon className="w-3 h-3" />
              <span className="text-xs font-medium">{trendValue}</span>
            </div>
          )}
        </div>

        {Icon && (
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm ${c.icon}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
    </motion.div>
  );
}

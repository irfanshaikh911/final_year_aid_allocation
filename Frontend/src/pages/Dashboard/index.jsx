import React from 'react';
import { motion } from 'framer-motion';
import { Users, Map, Truck, Shield, Activity } from 'lucide-react';
import { useAppStore } from '../../store/appStore';
import StatsCard from '../../components/dashboard/StatsCard';
import AlertPanel from '../../components/dashboard/AlertPanel';
import LiveMap from '../../components/map/LiveMap';

const activityLogs = [
  { time: '14:32:10', type: 'dispatch', msg: 'Convoy 4 dispatched to Sangamwadi' },
  { time: '14:30:05', type: 'drone',    msg: 'Drone-1 Alpha battery critical (18%)' },
  { time: '14:28:44', type: 'alert',    msg: 'Water level rising at Deccan Riverbed' },
  { time: '14:25:12', type: 'system',   msg: 'AI Allocation #421 approved by Cmdr. Rajesh' },
  { time: '14:20:00', type: 'dispatch', msg: 'Medical supplies reached Wagholi staging area' },
  { time: '14:15:33', type: 'drone',    msg: 'Drone-4 Delta launched for Kharadi sweep' },
  { time: '14:10:19', type: 'alert',    msg: 'Communication restored with RES-05 Bravo' },
];

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

const logColors = {
  dispatch: { dot: 'bg-green-500',  text: 'text-green-700',  badge: 'bg-green-100 text-green-700' },
  drone:    { dot: 'bg-blue-500',   text: 'text-blue-700',   badge: 'bg-blue-100 text-blue-700' },
  alert:    { dot: 'bg-red-500',    text: 'text-red-700',    badge: 'bg-red-100 text-red-700' },
  system:   { dot: 'bg-amber-500',  text: 'text-amber-700',  badge: 'bg-amber-100 text-amber-700' },
};

export default function DashboardPage() {
  const { stats } = useAppStore();

  return (
    <div className="p-5 space-y-5 min-h-full">

      {/* Header */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible">
        <h1 className="text-xl font-bold text-navy">Pune District Command Center</h1>
        <p className="text-sm text-slate-500 mt-0.5">Real-time situational awareness · District Disaster Management Authority</p>
      </motion.div>

      {/* Stats Row */}
      <motion.div
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        variants={stagger}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={fadeUp}>
          <StatsCard label="Total Affected People" value={stats.affectedPeople} icon={Users}  color="red"    trend="up"   trendValue="+45 in last 2h" />
        </motion.div>
        <motion.div variants={fadeUp}>
          <StatsCard label="Active Disaster Zones" value={stats.activeZones}    icon={Map}    color="saffron" trend="up"   trendValue="+1 since morning" />
        </motion.div>
        <motion.div variants={fadeUp}>
          <StatsCard label="Aid Dispatched (units)" value={stats.aidDispatched}  icon={Truck}  color="navy"   trend="up"   trendValue="+12 today" />
        </motion.div>
        <motion.div variants={fadeUp}>
          <StatsCard label="Rescue Teams Active"   value={stats.rescueTeams}    icon={Shield} color="green"  trend="down" trendValue="1 on standby" />
        </motion.div>
      </motion.div>

      {/* Middle Row: Alerts + Map */}
      <motion.div
        className="grid grid-cols-1 lg:grid-cols-5 gap-4"
        variants={stagger}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={fadeUp} className="lg:col-span-2">
          <AlertPanel />
        </motion.div>

        <motion.div variants={fadeUp} className="lg:col-span-3 content-card p-0 overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Map className="w-4 h-4 text-navy" />
              <span className="section-title">Disaster Zone Map</span>
              <span className="ml-auto text-[10px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded">Pune District</span>
            </div>
          </div>
          <div style={{ height: '300px' }}>
            <LiveMap mini={true} />
          </div>
        </motion.div>
      </motion.div>

      {/* Activity Log */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="content-card"
      >
        <div className="section-header mb-4">
          <Activity className="w-4 h-4 text-navy" />
          <h2 className="section-title">Operational Activity Log</h2>
          <div className="ml-auto flex items-center gap-1.5">
            <span className="relative">
              <span className="block w-2 h-2 rounded-full bg-green-500" />
              <span className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-60" />
            </span>
            <span className="text-[10px] font-mono text-slate-400">Live Sync</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scroll pr-2 space-y-3 max-h-60">
          {activityLogs.map((log, i) => {
            const c = logColors[log.type] || logColors.system;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05, duration: 0.28 }}
                className="flex gap-3 text-sm"
              >
                <span className="text-slate-400 font-mono text-xs w-16 flex-shrink-0">{log.time}</span>
                <div className="relative flex-1 pb-3 border-l-2 border-slate-100 pl-4">
                  <span className={`absolute left-[-5px] top-1.5 w-2 h-2 rounded-full ${c.dot}`} />
                  <div className={`inline-block px-2 py-0.5 rounded-full border text-[10px] font-bold uppercase tracking-wider mb-1 ${c.badge}`}>
                    {log.type}
                  </div>
                  <p className="text-gray-700">{log.msg}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}

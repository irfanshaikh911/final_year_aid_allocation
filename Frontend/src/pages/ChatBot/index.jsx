import React from 'react';
import { Bot, Radio, Truck, Database, Activity, Wifi, ShieldAlert, Zap, Users, MapPin } from 'lucide-react';
import ChatPanel from '../../components/chatbot/ChatPanel';
import { useAppStore } from '../../store/appStore';
import { humanClusters, resources, drones } from '../../components/map/puneData';

export default function ChatBotPage() {
  const { inventory, stats } = useAppStore();

  const criticalZones = humanClusters.filter(c => c.severity === 'critical' && c.people > 0);
  const liveDrones = drones.filter(d => d.status === 'live');

  return (
    <div className="p-4 md:p-6 bg-surface min-h-full animate-fade-in relative overflow-hidden flex flex-col xl:flex-row gap-6">

      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none opacity-20" style={{ backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
      <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* ── SIDE HUD (Left) ── */}
      <div className="flex-1 xl:flex-[2] flex flex-col gap-5 relative z-10">
        
        {/* Compact Header */}
        <div className="bg-gradient-to-br from-navy to-[#0a192f] rounded-3xl shadow-xl overflow-hidden border border-navy-500/50 relative">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Bot className="w-32 h-32 text-saffron" />
          </div>
          <div className="p-6 relative z-10">
            <div className="flex justify-between items-start gap-4">
              <div className="flex items-center gap-3">
                <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-saffron to-amber-600 text-white shadow-lg shadow-saffron/30 flex-shrink-0">
                  <Bot className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
                  </span>
                </div>
                <div>
                  <h1 className="text-2xl font-heading font-black text-white tracking-tight leading-none">DAVI Intelligence</h1>
                  <p className="text-blue-300/80 text-[10px] font-bold tracking-widest uppercase mt-1">Disaster AI Virtual Intelligence</p>
                </div>
              </div>
              <div className="flex flex-col gap-1.5 flex-shrink-0">
                <div className="flex items-center gap-2 bg-black/30 px-2.5 py-1 rounded border border-white/10">
                  <span className="w-1.5 h-1.5 rounded-full bg-saffron animate-pulse" />
                  <span className="text-[9px] font-bold text-blue-100 tracking-widest">LIVE RAG ONLINE</span>
                </div>
                <div className="flex items-center gap-2 bg-black/30 px-2.5 py-1 rounded border border-white/10">
                  <span className="w-1.5 h-1.5 rounded-full bg-india-green animate-pulse" />
                  <span className="text-[9px] font-bold text-blue-100 tracking-widest">GROQ LLM ACTIVE</span>
                </div>
              </div>
            </div>
            
            {/* Mini Stats Row */}
            <div className="mt-5 grid grid-cols-4 gap-2 pt-4 border-t border-white/10">
              <div className="flex flex-col">
                <span className="text-[9px] text-gray-400 uppercase font-bold">Zones</span>
                <span className="text-sm font-black text-white">{humanClusters.filter(c => c.people > 0).length}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] text-gray-400 uppercase font-bold">Stranded</span>
                <span className="text-sm font-black text-red-400">{stats.affectedPeople}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] text-gray-400 uppercase font-bold">Drones</span>
                <span className="text-sm font-black text-blue-400">{liveDrones.length}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] text-gray-400 uppercase font-bold">Deployments</span>
                <span className="text-sm font-black text-green-400">{resources.length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Critical Zones Alert */}
        <div className="bg-gradient-to-br from-red-950/90 to-[#1a0505] border border-red-800/40 rounded-3xl p-5 shadow-xl backdrop-blur-xl animate-slide-in hover:shadow-red-900/20 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading font-black text-white text-xs uppercase tracking-widest flex items-center gap-2">
              <Zap className="w-4 h-4 text-red-400 animate-pulse" /> Critical Zones
            </h3>
            <span className="text-[9px] font-bold text-red-200 bg-red-500/20 px-2 py-1 rounded-full border border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.3)]">
              {criticalZones.length} HIGH ALERT
            </span>
          </div>
          <div className="space-y-2">
            {criticalZones.slice(0, 3).map((z, i) => (
              <div key={z.id} className="flex items-center justify-between bg-black/40 rounded-xl px-3 py-2 border border-red-800/30 hover:bg-black/60 transition-colors" style={{ animationDelay: `${i * 100}ms` }}>
                <div>
                  <p className="text-white text-xs font-bold font-heading">{z.zone}</p>
                  <p className="text-red-300/80 text-[10px] font-medium mt-0.5">{z.people} individuals stranded</p>
                </div>
                <span className="text-[9px] font-black text-red-200 bg-red-900/60 px-2 py-0.5 rounded uppercase tracking-wider border border-red-800/50">CRITICAL</span>
              </div>
            ))}
            {criticalZones.length === 0 && (
              <div className="bg-green-950/40 border border-green-800/30 rounded-xl px-3 py-2 flex items-center justify-center">
                <p className="text-green-400 text-[10px] font-semibold tracking-wide">All zones currently secured</p>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Live Inventory */}
          <div className="bg-white/80 backdrop-blur-xl border border-surface-300 rounded-3xl p-5 shadow-card hover:shadow-card-hover transition-all duration-300">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-surface-200">
              <h3 className="font-heading font-black text-navy text-[10px] uppercase tracking-widest flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-saffron" /> Inventory
              </h3>
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-india-green animate-pulse" />
                <span className="text-[8px] font-mono font-bold text-gray-500 tracking-widest">SYNCED</span>
              </div>
            </div>
            <div className="space-y-3">
              {inventory.slice(0, 4).map(inv => {
                const pct = Math.min(100, Math.max(0, (inv.available / 500) * 100));
                const isCrit = inv.available < 200;
                return (
                  <div key={inv.id} className="group/item">
                    <div className="flex justify-between items-end mb-1">
                      <span className="text-[10px] font-bold text-gray-700 uppercase tracking-wide group-hover/item:text-navy transition-colors">{inv.resource}</span>
                      <span className={`text-[10px] font-black ${isCrit ? 'text-india-red' : 'text-navy'}`}>{inv.available} <span className="font-medium text-gray-400">u</span></span>
                    </div>
                    <div className="h-1.5 w-full bg-surface-200 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all duration-1000 ${isCrit ? 'bg-india-red shadow-[0_0_10px_rgba(239,68,68,0.6)]' : 'bg-gradient-to-r from-navy to-blue-500'}`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Drone Telemetry */}
          <div className="bg-white/80 backdrop-blur-xl border border-surface-300 rounded-3xl p-5 shadow-card hover:shadow-card-hover transition-all duration-300">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-surface-200">
              <h3 className="font-heading font-black text-navy text-[10px] uppercase tracking-widest flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-saffron" /> Drones
              </h3>
              <div className="flex items-center gap-1">
                <Wifi className="w-2.5 h-2.5 text-india-green animate-pulse" />
                <span className="text-[8px] font-mono font-bold text-gray-500 tracking-widest">{liveDrones.length} LIVE</span>
              </div>
            </div>
            <div className="space-y-2">
              {drones.slice(0, 3).map(drone => (
                <div key={drone.id} className="flex items-center justify-between bg-surface-50 border border-surface-200 px-3 py-2 rounded-xl hover:bg-white transition-colors group/drone">
                  <div>
                    <p className="text-[10px] font-black text-navy uppercase group-hover/drone:text-blue-600 transition-colors">{drone.name}</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <span className={`text-[9px] font-bold ${drone.battery < 20 ? 'text-india-red' : 'text-india-green'}`}>BAT {drone.battery}%</span>
                    </div>
                  </div>
                  <span className={`text-[8px] font-black px-2 py-1 rounded-lg uppercase tracking-wider
                    ${drone.status === 'live' ? 'bg-green-100/80 text-india-green border border-green-200' : 'bg-amber-100/80 text-amber-700 border border-amber-200'}`}>
                    {drone.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* ── CHAT PANEL (Right) ── */}
      <div className="w-full xl:flex-[3] relative z-10 flex flex-col">
        <div className="sticky top-4 h-[calc(100vh-8rem)] min-h-[600px] bg-white rounded-[2rem] shadow-2xl border border-surface-300 overflow-hidden flex flex-col transform transition-all duration-500 hover:shadow-[0_20px_40px_-15px_rgba(11,31,58,0.2)]">
          <ChatPanel />
        </div>
      </div>

    </div>
  );
}

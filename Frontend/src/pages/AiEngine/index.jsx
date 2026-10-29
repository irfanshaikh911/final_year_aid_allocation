import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, Activity, Users, MapPin, Truck, AlertTriangle, ShieldCheck, Cpu, ChevronRight, BarChart3 } from 'lucide-react';
import { humanClusters } from '../../components/map/puneData';
import { useAppStore } from '../../store/appStore';

export default function AiEngine() {
  const navigate = useNavigate();
  const { dispatchedClusters, stats } = useAppStore();
  const [simulating, setSimulating] = useState(false);
  
  const activeClusters = humanClusters.filter(c => c.people > 0);

  const handleSimulate = () => {
    setSimulating(true);
    setTimeout(() => setSimulating(false), 2500);
  };

  return (
    <div className="p-6 md:p-8 space-y-8 bg-surface min-h-full animate-fade-in relative overflow-hidden">
      
      {/* Decorative Background Grid & Glows */}
      <div className="absolute inset-0 pointer-events-none opacity-20" style={{ backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[30rem] h-[30rem] bg-saffron/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Header section with Premium Glassmorphism */}
      <div className="relative z-10 bg-gradient-to-br from-navy to-[#0a192f] rounded-3xl shadow-2xl overflow-hidden border border-navy-500/50 group">
        <div className="absolute top-0 right-0 p-12 opacity-10 transform group-hover:scale-110 transition-transform duration-1000">
          <Cpu className="w-64 h-64 text-saffron" />
        </div>
        
        <div className="relative z-10 p-8 md:p-10 flex flex-col md:flex-row gap-8 justify-between items-start md:items-center">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-4">
              <span className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-saffron to-amber-600 text-white shadow-lg shadow-saffron/30">
                <Zap className="w-6 h-6" />
              </span>
              <h1 className="text-4xl md:text-5xl font-heading font-black text-white tracking-tight">Strategy Engine</h1>
            </div>
            <p className="text-blue-100/70 text-sm md:text-base leading-relaxed max-w-xl">
              Autonomous comparative analysis of all active disaster zones. The neural engine constantly evaluates severity indices, volumetric water levels, and logistics distances to synthesize optimal deployment plans.
            </p>
          </div>

          <div className="flex-shrink-0 w-full md:w-auto">
            <button 
              onClick={handleSimulate}
              disabled={simulating}
              className={`w-full md:w-auto relative overflow-hidden flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-bold text-white transition-all duration-300 shadow-xl
                ${simulating ? 'bg-navy-400 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 hover:shadow-indigo-500/25 hover:-translate-y-1'}`}
            >
              {simulating ? (
                <>
                  <div className="absolute inset-0 bg-white/20 animate-pulse" />
                  <Activity className="w-5 h-5 animate-spin" />
                  <span>Synthesizing Global Plan...</span>
                </>
              ) : (
                <>
                  <BarChart3 className="w-5 h-5" />
                  <span>Simulate Global Allocation</span>
                </>
              )}
            </button>
          </div>
        </div>
        
        {/* Quick Stats Banner */}
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/10 border-t border-white/10 bg-black/20 backdrop-blur-md">
          {[
            { label: 'Active Zones', val: stats.activeZones, icon: MapPin, color: 'text-saffron' },
            { label: 'Total Stranded', val: stats.affectedPeople, icon: Users, color: 'text-red-400' },
            { label: 'Pending AI Plans', val: activeClusters.filter(c => !dispatchedClusters[c.id]).length, icon: Activity, color: 'text-blue-400' },
            { label: 'Secured Zones', val: Object.keys(dispatchedClusters).length, icon: ShieldCheck, color: 'text-green-400' },
          ].map((stat, i) => (
            <div key={i} className="px-8 py-5 flex items-center gap-4 hover:bg-white/5 transition-colors">
              <stat.icon className={`w-8 h-8 ${stat.color} opacity-80`} />
              <div>
                <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">{stat.label}</p>
                <p className="text-2xl font-black font-heading text-white">{stat.val}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Grid Map / List */}
      <div className="relative z-10 space-y-6 pt-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-heading font-black text-navy flex items-center gap-2">
            <Activity className="w-6 h-6 text-saffron" />
            Live Zonal Processing Queue
          </h2>
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 bg-white px-3 py-1.5 rounded-full shadow-sm border border-surface-300">
            <span className="w-2 h-2 rounded-full bg-india-green animate-pulse" />
            Live Sync Active
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6">
          {activeClusters.map(cluster => {
            const isDispatched = dispatchedClusters[cluster.id];
            const isCritical = cluster.severity === 'critical';

            return (
              <div 
                key={cluster.id} 
                className={`group relative bg-white/80 backdrop-blur-md border rounded-2xl p-6 transition-all duration-500 overflow-hidden
                  ${isDispatched ? 'border-green-300 shadow-[0_4px_20px_-4px_rgba(34,197,94,0.2)]' : 
                    isCritical ? 'border-red-300 shadow-[0_8px_30px_-4px_rgba(239,68,68,0.2)] hover:shadow-[0_12px_40px_-4px_rgba(239,68,68,0.3)] hover:-translate-y-1' : 
                    'border-surface-300 shadow-sm hover:shadow-lg hover:-translate-y-1'}`}
              >
                
                {/* Background pulse for critical */}
                {!isDispatched && isCritical && (
                  <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-2xl -mr-10 -mt-10 animate-pulse-slow" />
                )}

                <div className="relative z-10 flex flex-col h-full justify-between gap-6">
                  {/* Top Section */}
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-heading font-black text-navy text-xl">{cluster.name}</h3>
                      {isCritical && !isDispatched && (
                        <span className="flex items-center gap-1.5 bg-gradient-to-r from-red-500 to-rose-600 text-white text-[10px] font-bold px-2.5 py-1 rounded shadow-md uppercase tracking-wider animate-pulse">
                          <AlertTriangle className="w-3 h-3" /> Critical
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-500 font-medium">
                      <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {cluster.id}</span>
                      <span className="w-1 h-1 rounded-full bg-gray-300" />
                      <span className="text-navy/70 bg-navy/5 px-2 py-0.5 rounded">Sensors: {cluster.detectedBy}</span>
                    </div>
                  </div>

                  {/* Mid Section Data */}
                  <div className="grid grid-cols-3 gap-2 bg-surface-50 rounded-xl p-3 border border-surface-200">
                    <div className="text-center">
                      <p className="text-[10px] uppercase text-gray-400 font-bold tracking-wider mb-0.5">Stranded</p>
                      <p className="font-black text-navy text-xl">{cluster.people}</p>
                    </div>
                    <div className="text-center border-l border-surface-200">
                      <p className="text-[10px] uppercase text-gray-400 font-bold tracking-wider mb-0.5">Water</p>
                      <p className="font-black text-navy text-xl">{cluster.waterLevel}</p>
                    </div>
                    <div className="text-center border-l border-surface-200">
                      <p className="text-[10px] uppercase text-gray-400 font-bold tracking-wider mb-0.5">ETA Hub</p>
                      <p className="font-black text-navy text-sm mt-1 truncate px-1">{cluster.nearestWarehouse}</p>
                    </div>
                  </div>

                  {/* Action Section */}
                  <div className="mt-auto pt-2">
                    {isDispatched ? (
                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 text-india-green px-4 py-3 rounded-xl border border-green-200 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <Truck className="w-5 h-5 animate-pulse-slow" />
                          <span className="text-xs font-black uppercase tracking-widest">{isDispatched.status}</span>
                        </div>
                        <span className="text-[10px] font-bold bg-green-200/50 px-2 py-1 rounded text-green-700">Live Track</span>
                      </div>
                    ) : (
                      <button 
                        onClick={() => navigate(`/allocation-detail/${cluster.id}`)}
                        className="w-full bg-navy hover:bg-blue-900 text-white font-bold py-3 px-4 rounded-xl text-xs shadow-lg shadow-navy/20 transition-all flex items-center justify-between group/btn"
                      >
                        <div className="flex items-center gap-2">
                          <Zap className="w-4 h-4 text-saffron group-hover/btn:scale-110 transition-transform" />
                          <span>Generate AI Strategy</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-blue-300 group-hover/btn:translate-x-1 transition-transform" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

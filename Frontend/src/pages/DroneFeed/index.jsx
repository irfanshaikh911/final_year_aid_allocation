import { AlertTriangle, Radio, RefreshCw } from 'lucide-react';
import { useAppStore } from '../../store/appStore';
import DroneFeedCard from '../../components/drone/DroneFeedCard';
import { humanClusters } from '../../components/map/puneData';

export default function DroneFeedPage() {
  const { droneFeeds } = useAppStore();
  const liveCount = droneFeeds.filter(d => d.status === 'live').length;
  
  const totalDetected = humanClusters.reduce((acc, c) => acc + c.people, 0);
  const criticalCount = humanClusters.filter(c => c.severity === 'critical').length;

  return (
    <div className="p-5 space-y-4 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Radio className="w-5 h-5 text-navy" />
            <h1 className="text-xl font-heading font-bold text-navy">Drone Surveillance Feed</h1>
          </div>
          <p className="text-sm text-gray-500 mt-0.5">
            AI-powered aerial monitoring · {liveCount} of {droneFeeds.length} drones online
          </p>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="flex items-center gap-1.5">
            <span className="status-dot-live" />
            <span className="text-xs text-india-green font-semibold">{liveCount} Live</span>
          </div>
          <button className="inline-flex items-center gap-1.5 text-xs text-gray-600 hover:text-navy px-3 py-1.5 border border-surface-300 rounded-md bg-white hover:bg-surface-100 transition-colors">
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh All
          </button>
        </div>
      </div>

      {/* Alert Banner */}
      <div className="flex items-center gap-3 px-4 py-3 bg-red-50 border border-india-red/30 rounded-lg">
        <AlertTriangle className="w-4 h-4 text-india-red flex-shrink-0 animate-pulse-slow" />
        <p className="text-sm text-india-red font-medium">
          <strong>Drone-2 Bravo (Kharadi)</strong> detected large civilian gathering — Zone Kharadi River Bank · 134 persons · Immediate rescue dispatch recommended
        </p>
        <span className="text-[10px] text-india-red/60 ml-auto flex-shrink-0">12 min ago</span>
      </div>

      {/* Status Summary Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Drones Online', value: liveCount, color: 'text-india-green' },
          { label: 'Under Maintenance', value: droneFeeds.filter(d => d.status === 'maintenance').length, color: 'text-amber-600' },
          { label: 'Total Humans Detected', value: totalDetected, color: 'text-navy' },
          { label: 'Critical Zones Monitored', value: criticalCount, color: 'text-india-red' },
        ].map((item) => (
          <div key={item.label} className="content-card py-3">
            <p className="text-[10px] text-gray-500 uppercase tracking-wide">{item.label}</p>
            <p className={`text-2xl font-bold font-heading mt-1 ${item.color}`}>{item.value}</p>
          </div>
        ))}
      </div>

      {/* 2x2 Grid of Feeds */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {droneFeeds.map((drone) => (
          <DroneFeedCard key={drone.id} drone={drone} />
        ))}
      </div>

      {/* Footer note */}
      <p className="text-xs text-gray-400 text-center">
        All drone feeds are AI-analyzed in real-time · Human detection powered by DAVI Vision Computer Vision Engine v2.1
      </p>
    </div>
  );
}

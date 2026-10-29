import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Package, Droplets, Cross, Fuel, Zap, Plus, Tent, LifeBuoy, Layers, Thermometer, Truck, Clock } from 'lucide-react';
import { useAppStore } from '../../store/appStore';
import InventoryTable from '../../components/inventory/InventoryTable';
import RecommendationCard from '../../components/dashboard/RecommendationCard';
import { formatNumber } from '../../utils/formatters';
import { humanClusters } from '../../components/map/puneData';

// Default styles for specific resources, with a fallback for new items
const resourceStyles = {
  'Food Packets': { icon: Package, color: 'saffron' },
  'Drinking Water': { icon: Droplets, color: 'navy' },
  'Medical Kits': { icon: Cross, color: 'red' },
  'Fuel (Diesel)': { icon: Fuel, color: 'green' },
  'Tarpaulin Sheets': { icon: Layers, color: 'cyan' },
  'Rescue Boats': { icon: LifeBuoy, color: 'blue' },
  'Blankets/Warm Gear': { icon: Thermometer, color: 'purple' },
  'Tents': { icon: Tent, color: 'teal' },
};

const getResourceStyle = (resource, index) => {
  if (resourceStyles[resource]) return resourceStyles[resource];
  const colors = ['saffron', 'navy', 'red', 'green', 'cyan', 'blue', 'purple', 'teal'];
  return { icon: Package, color: colors[index % colors.length] };
};

const colorMap = {
  saffron: { bg: 'bg-saffron', text: 'text-white', ring: 'ring-saffron/20' },
  navy: { bg: 'bg-navy', text: 'text-white', ring: 'ring-navy/20' },
  red: { bg: 'bg-india-red', text: 'text-white', ring: 'ring-india-red/20' },
  green: { bg: 'bg-india-green', text: 'text-white', ring: 'ring-india-green/20' },
  cyan: { bg: 'bg-cyan-600', text: 'text-white', ring: 'ring-cyan-600/20' },
  blue: { bg: 'bg-blue-500', text: 'text-white', ring: 'ring-blue-500/20' },
  purple: { bg: 'bg-purple-600', text: 'text-white', ring: 'ring-purple-600/20' },
  teal: { bg: 'bg-teal-600', text: 'text-white', ring: 'ring-teal-600/20' },
};

export default function InventoryPage() {
  const { inventory, recommendations, dispatchedClusters } = useAppStore();
  const [filteredCount, setFilteredCount] = useState(inventory.length);
  const [loadingRec, setLoadingRec] = useState(false);

  const navigate = useNavigate();

  const hasCritical = (resource) =>
    inventory.some(i => i.resource === resource && i.critical);

  const handleGenerateRec = (cluster) => {
    navigate(`/allocation-detail/${cluster.id}`);
  };

  return (
    <div className="p-5 space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-heading font-bold text-navy">Inventory & AI Allocation</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            District warehouse stock levels · AI-driven dispatch recommendations for Pune
          </p>
        </div>
        <Link to="/inventory/add" className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Inventory
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...new Set(inventory.map(i => i.resource))].map((resource, index) => {
          const items = inventory.filter(i => i.resource === resource);
          const total = items.reduce((s, i) => s + i.available, 0);
          const wCount = new Set(items.map(i => i.warehouse)).size;
          const warehouseText = `${wCount} warehouse${wCount === 1 ? '' : 's'}`;
          const isCritical = items.some(i => i.critical);
          const unit = items[0]?.unit || 'units';
          
          const style = getResourceStyle(resource, index);
          const Icon = style.icon;
          const col = colorMap[style.color];
          
          return (
            <div key={resource} className={`stat-card relative overflow-hidden ${isCritical ? 'ring-2 ring-india-red' : ''}`}>
              {isCritical && (
               <div className="absolute top-2 right-2">
                 <span className="badge-critical text-[9px]">LOW STOCK</span>
               </div>
              )}
              <div className={`w-10 h-10 rounded-lg ${col.bg} flex items-center justify-center mb-3`}>
                <Icon className={`w-5 h-5 ${col.text}`} />
              </div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">{resource}</p>
              <p className="text-2xl font-bold font-heading text-navy">{formatNumber(total)}</p>
              <p className="text-xs text-gray-400 mt-1">{unit} · {warehouseText}</p>
            </div>
          );
        })}
      </div>

      {/* Main content area */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* Inventory Table */}
        <div className="lg:col-span-3 space-y-3">
          <div className="section-header">
            <Package className="w-4 h-4 text-navy" />
            <h2 className="section-title">Warehouse Inventory</h2>
            <span className="ml-auto text-[10px] text-gray-400 bg-surface-200 px-2 py-0.5 rounded font-mono">
              {filteredCount} records
            </span>
          </div>
          <InventoryTable onFilterChange={setFilteredCount} />
        </div>

        {/* AI Allocation Panel */}
        <div className="lg:col-span-2 space-y-3">
          <div className="section-header">
            <Zap className="w-4 h-4 text-saffron" />
            <h2 className="section-title">AI Allocation Queue</h2>
            <span className={`ml-auto text-[10px] px-2 py-0.5 rounded font-semibold
              ${recommendations.filter(r => r.status === 'pending').length > 0
                ? 'bg-amber-100 text-amber-700'
                : 'bg-green-100 text-india-green'}`}>
              {recommendations.filter(r => r.status === 'pending').length} Pending
            </span>
          </div>
          
          <div className="space-y-3">
            {/* Display active recommendations */}
            {recommendations.map((rec) => (
              <RecommendationCard key={rec.id} rec={rec} />
            ))}

            {/* Display human clusters as queue items */}
            {humanClusters.filter(c => c.people > 0).map(cluster => {
              const dispatchData = dispatchedClusters[cluster.id];
              return (
                <div key={cluster.id} className={`border rounded-lg p-3 shadow-sm flex items-center justify-between ${dispatchData ? 'bg-green-50 border-green-200' : 'bg-white border-surface-300'}`}>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-heading font-bold text-navy text-sm">{cluster.zone}</span>
                      {cluster.severity === 'critical' && !dispatchData && (
                        <span className="bg-red-100 text-india-red text-[9px] font-bold px-1.5 py-0.5 rounded uppercase">Critical Priority</span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 font-medium">
                      Humans Stranded: <span className="text-navy font-bold">{cluster.people}</span>
                    </p>
                  </div>
                  
                  {dispatchData ? (
                    <div className="flex items-center gap-2 bg-green-100 text-india-green px-3 py-1.5 rounded border border-green-200">
                      <Truck className="w-4 h-4 animate-pulse-slow" />
                      <div className="text-right">
                        <p className="text-[10px] font-bold uppercase tracking-wider">{dispatchData.status}</p>
                        <p className="text-[9px] font-mono opacity-80 flex items-center gap-1 justify-end"><Clock className="w-2.5 h-2.5" /> ETA 15m</p>
                      </div>
                    </div>
                  ) : loadingRec === cluster.id ? (
                    <div className="flex items-center gap-1.5 text-blue-600">
                      <Zap className="w-3.5 h-3.5 animate-spin" />
                      <span className="text-[10px] font-mono animate-pulse">Analyzing...</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleGenerateRec(cluster)}
                      className="flex items-center gap-1 bg-navy hover:bg-blue-900 text-white text-[10px] font-bold py-1.5 px-3 rounded transition-colors"
                    >
                      <Zap className="w-3 h-3 text-saffron" />
                      Recommend
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

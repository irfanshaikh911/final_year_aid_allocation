import { useState, useEffect } from 'react';
import {
  Layers, Users, Package, Truck, Radio, Shield,
  Thermometer, Activity, CheckCircle, XCircle, Edit3,
  MapPin, AlertTriangle, Clock, Zap, ChevronDown, ChevronRight,
} from 'lucide-react';
import LiveMap from '../../components/map/LiveMap';
import { operationalLogs, severityConfig } from '../../components/map/puneData';
import { useAppStore } from '../../store/appStore';
import { formatTime } from '../../utils/formatters';

/* ── Default filter state ────────────────────────────────────────────── */
const DEFAULT_FILTERS = {
  showHumans:     true,
  showWarehouses: true,
  showTrucks:     true,
  showDrones:     true,
  showTeams:      true,
  heatCrowd:      false,
  heatSeverity:   false,
  heatDemand:     false,
  severity:       'all',
  time:           'live',
  district:       'all',
};

const LAYER_TOGGLES = [
  { key: 'showHumans',     icon: Users,       label: 'Human Clusters' },
  { key: 'showTeams',      icon: Shield,      label: 'Rescue Teams' },
  { key: 'showWarehouses', icon: Package,     label: 'Warehouses' },
  { key: 'showTrucks',     icon: Truck,       label: 'Aid Trucks / Boats' },
  { key: 'showDrones',     icon: Radio,       label: 'Drone Coverage' },
];

const HEAT_TOGGLES = [
  { key: 'heatCrowd',    label: 'Crowd Density', color: 'bg-red-500' },
  { key: 'heatSeverity', label: 'Disaster Severity', color: 'bg-orange-500' },
  { key: 'heatDemand',   label: 'Demand Hotspots', color: 'bg-yellow-500' },
];

const LOG_COLORS = {
  alert:    'text-india-red    bg-red-50    border-red-200',
  ai:       'text-saffron      bg-amber-50  border-amber-200',
  dispatch: 'text-blue-600    bg-blue-50   border-blue-200',
  approval: 'text-india-green bg-green-50  border-green-200',
};

const riskBadge = {
  High:     'badge-critical',
  Moderate: 'badge-warning',
  Low:      'badge-normal',
  Blocked:  'badge-critical',
  Limited:  'badge-warning',
  Open:     'badge-normal',
};

/* ── Main page ───────────────────────────────────────────────────────── */
export default function LiveMapPage() {
  const [filters, setFilters]         = useState(DEFAULT_FILTERS);
  const [selectedZone, setSelectedZone] = useState(null);
  const [approvalStatus, setApproval]  = useState({}); // zoneId → 'approved'|'rejected'
  const [tick, setTick]               = useState(new Date());
  const { approveRecommendation, rejectRecommendation } = useAppStore();

  // Live clock
  useEffect(() => {
    const t = setInterval(() => setTick(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const toggle = (key) => setFilters((f) => ({ ...f, [key]: !f[key] }));
  const set    = (key, val) => setFilters((f) => ({ ...f, [key]: val }));

  const handleApprove = (zone) => {
    setApproval((p) => ({ ...p, [zone.id]: 'approved' }));
  };
  const handleReject = (zone) => {
    setApproval((p) => ({ ...p, [zone.id]: 'rejected' }));
  };

  return (
    <div className="h-full flex flex-col bg-surface-100 overflow-hidden">

      {/* ── Page Header ──────────────────────────────────────────────── */}
      <div className="flex-shrink-0 bg-navy px-4 py-2.5 flex items-center gap-4 border-b border-navy-500">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-saffron" />
          <span className="text-white font-heading font-bold text-sm">PUNE DISTRICT GIS · DISASTER INTELLIGENCE</span>
        </div>
        <div className="flex items-center gap-1.5 ml-2">
          <span className="status-dot-live" />
          <span className="text-[10px] text-india-green font-semibold uppercase tracking-wider">Live</span>
        </div>
        <div className="ml-auto flex items-center gap-4">
          <div className="hidden md:flex items-center gap-1.5 bg-red-900/40 border border-india-red/50 rounded px-3 py-1">
            <AlertTriangle className="w-3 h-3 text-india-red animate-pulse" />
            <span className="text-[10px] text-india-red font-bold uppercase tracking-wide">Emergency Active</span>
          </div>
          <span className="text-blue-200 text-xs font-mono">{formatTime(tick)} IST</span>
        </div>
      </div>

      {/* ── 3-col body ──────────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden min-h-0">

        {/* ═══════════════ LEFT FILTER PANEL ════════════════════════ */}
        <aside className="w-64 flex-shrink-0 bg-white border-r border-surface-300 overflow-y-auto custom-scroll flex flex-col">

          {/* Layers */}
          <div className="px-3 py-3 border-b border-surface-200">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-1">
              <Layers className="w-3 h-3" /> Map Layers
            </p>
            <div className="space-y-1.5">
              {LAYER_TOGGLES.map(({ key, icon: Icon, label }) => (
                <label key={key} className="flex items-center gap-2.5 cursor-pointer group">
                  <button
                    onClick={() => toggle(key)}
                    className={`relative w-9 h-5 rounded-full flex-shrink-0 transition-colors ${filters[key] ? 'bg-navy' : 'bg-gray-200'}`}
                  >
                    <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${filters[key] ? 'translate-x-4' : ''}`} />
                  </button>
                  <Icon className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                  <span className="text-xs text-gray-700">{label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Heatmaps */}
          <div className="px-3 py-3 border-b border-surface-200">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-1">
              <Thermometer className="w-3 h-3" /> Heatmap Layers
            </p>
            <div className="space-y-1.5">
              {HEAT_TOGGLES.map(({ key, label, color }) => (
                <label key={key} className="flex items-center gap-2.5 cursor-pointer">
                  <button
                    onClick={() => toggle(key)}
                    className={`relative w-9 h-5 rounded-full flex-shrink-0 transition-colors ${filters[key] ? 'bg-navy' : 'bg-gray-200'}`}
                  >
                    <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${filters[key] ? 'translate-x-4' : ''}`} />
                  </button>
                  <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${color}`} />
                  <span className="text-xs text-gray-700">{label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Severity Filter */}
          <div className="px-3 py-3 border-b border-surface-200">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Severity Filter</p>
            <div className="space-y-1">
              {[
                { v: 'all',      label: '📍 All Zones' },
                { v: 'critical', label: '🔴 Critical' },
                { v: 'high',     label: '🟠 High' },
                { v: 'moderate', label: '🟡 Moderate' },
                { v: 'low',      label: '🟢 Low' },
              ].map(({ v, label }) => (
                <button key={v} onClick={() => set('severity', v)}
                  className={`w-full text-left px-2.5 py-1.5 rounded text-xs font-medium transition-colors
                    ${filters.severity === v ? 'bg-navy text-white' : 'text-gray-600 hover:bg-surface-200'}`}>
                  {label}
                </button>
              ))}
            </div>
          </div>



          {/* Legend */}
          <div className="px-3 py-3 mt-auto border-t border-surface-200 bg-surface-100">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Legend</p>
            <div className="space-y-1.5">
              {[
                ['#D32F2F', '● Critical Zone'],
                ['#FF9933', '● High Severity'],
                ['#F59E0B', '● Moderate Zone'],
                ['#138808', '● Safe / Low'],
                ['#000080', '■ Warehouse'],
                ['#FF9933', '■ Aid Truck'],
                ['#3B82F6', '● Rescue Boat'],
                ['#8B5CF6', '● Drone'],
              ].map(([c, l]) => (
                <div key={l} className="flex items-center gap-2">
                  <span className="text-xs font-bold" style={{ color: c }}>{l.slice(0, 1)}</span>
                  <span className="text-xs text-gray-600">{l.slice(2)}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* ═══════════════ MAIN MAP ══════════════════════════════════ */}
        <div className="flex-1 relative overflow-hidden">
          <LiveMap filters={filters} onZoneSelect={setSelectedZone} />

          {/* Map badge overlay */}
          <div className="absolute bottom-3 left-3 z-[500] flex flex-col gap-1.5 pointer-events-none">
            <div className="bg-white/95 border border-surface-300 rounded px-2.5 py-1.5 text-[10px] font-mono text-navy shadow-sm">
              📍 Pune District · 18.5204°N 73.8567°E
            </div>
            <div className="bg-white/95 border border-surface-300 rounded px-2.5 py-1.5 text-[10px] font-mono text-gray-600 shadow-sm">
              © OpenStreetMap · DAVI VISION GIS v2.1
            </div>
          </div>
        </div>

        {/* ═══════════════ RIGHT INTELLIGENCE PANEL ════════════════ */}
        <aside className="w-80 flex-shrink-0 bg-white border-l border-surface-300 flex flex-col overflow-hidden">

          {/* Panel Header */}
          <div className="bg-navy px-4 py-2.5 flex-shrink-0">
            <p className="text-white text-xs font-bold font-heading uppercase tracking-wider">Intelligence Panel</p>
            <p className="text-blue-300 text-[10px]">Click a zone marker to load details</p>
          </div>

          <div className="flex-1 overflow-y-auto custom-scroll min-h-0">

            {/* ── ZONE DETAILS ──────────────────────────────── */}
            {selectedZone ? (
              <div className="animate-fade-in">
                {/* Zone ID strip */}
                <div className={`px-4 py-3 border-b border-surface-200 ${selectedZone.severity === 'critical' ? 'bg-red-50' : selectedZone.severity === 'high' ? 'bg-amber-50' : 'bg-surface-100'}`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Selected Zone</span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full uppercase ${
                      selectedZone.severity === 'critical' ? 'bg-red-100 text-india-red' :
                      selectedZone.severity === 'high'     ? 'bg-amber-100 text-amber-700' :
                                                             'bg-yellow-100 text-yellow-700'}`}>
                      {selectedZone.severity}
                    </span>
                  </div>
                  <p className="font-heading font-bold text-navy text-sm">{selectedZone.id}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{selectedZone.name}</p>
                </div>

                {/* Zone data grid */}
                <div className="px-4 py-3 border-b border-surface-200">
                  <div className="grid grid-cols-2 gap-x-3 gap-y-3">
                    {[
                      { label: 'People Stranded', value: `${selectedZone.people} (${selectedZone.children} children)` },
                      { label: 'Flood Level',     value: selectedZone.waterLevel },
                      { label: 'Medical Risk',    value: selectedZone.medicalRisk,   badge: riskBadge[selectedZone.medicalRisk] },
                      { label: 'Road Access',     value: selectedZone.roadAccess,    badge: riskBadge[selectedZone.roadAccess] },
                      { label: 'Nearest WH',      value: selectedZone.nearestWarehouse },
                      { label: 'AI Score',        value: `${selectedZone.aiScore}%`, bold: true },
                      { label: 'Detected By',     value: selectedZone.detectedBy },
                      { label: 'Last Update',     value: selectedZone.lastUpdate },
                    ].map(({ label, value, badge, bold }) => (
                      <div key={label}>
                        <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-0.5">{label}</p>
                        {badge
                          ? <span className={badge}>{value}</span>
                          : <p className={`text-xs text-navy ${bold ? 'font-bold text-saffron' : 'font-semibold'}`}>{value}</p>
                        }
                      </div>
                    ))}
                  </div>
                </div>

                {/* AI Recommendation */}
                {selectedZone.rec && (
                  <div className="px-4 py-3 border-b border-surface-200">
                    <div className="flex items-center gap-1.5 mb-2">
                      <Zap className="w-3.5 h-3.5 text-saffron" />
                      <span className="text-xs font-bold text-navy">AI Recommended Dispatch</span>
                    </div>

                    <div className="bg-surface-100 rounded-lg p-2.5 mb-2 space-y-1">
                      {selectedZone.rec.items.map((item) => (
                        <div key={item.r} className="flex justify-between items-center">
                          <span className="text-xs text-gray-600">{item.r}</span>
                          <span className="text-xs font-bold text-navy">{item.q}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center gap-3 text-[11px] mb-3">
                      <span className="text-gray-500">ETA: <strong className="text-navy">{selectedZone.rec.eta}</strong></span>
                      <span className="text-gray-500">Conf: <strong className="text-india-green">{selectedZone.rec.confidence}%</strong></span>
                      <span className={`ml-auto font-bold uppercase text-xs ${selectedZone.rec.priority === 'HIGH' ? 'text-india-red' : 'text-amber-600'}`}>
                        {selectedZone.rec.priority}
                      </span>
                    </div>

                    {/* Confidence bar */}
                    <div className="w-full bg-gray-200 rounded-full h-1.5 mb-3">
                      <div className="bg-india-green h-1.5 rounded-full" style={{ width: `${selectedZone.rec.confidence}%` }} />
                    </div>

                    {/* Action buttons */}
                    {approvalStatus[selectedZone.id] === 'approved' ? (
                      <div className="flex items-center gap-1.5 text-india-green text-xs font-semibold bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                        <CheckCircle className="w-3.5 h-3.5" /> Dispatch Approved & Initiated
                      </div>
                    ) : approvalStatus[selectedZone.id] === 'rejected' ? (
                      <div className="flex items-center gap-1.5 text-gray-500 text-xs font-semibold bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
                        <XCircle className="w-3.5 h-3.5" /> Recommendation Rejected
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <button onClick={() => handleApprove(selectedZone)} className="btn-success flex-1 justify-center text-xs py-1.5">
                          <CheckCircle className="w-3.5 h-3.5" /> Approve
                        </button>
                        <button onClick={() => handleReject(selectedZone)} className="btn-danger flex-1 justify-center text-xs py-1.5">
                          <XCircle className="w-3.5 h-3.5" /> Reject
                        </button>
                        <button className="btn-outline flex-shrink-0 text-xs py-1.5 px-2.5">
                          <Edit3 className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              /* Default state — no zone selected */
              <div className="px-4 py-4 border-b border-surface-200 bg-surface-100">
                <div className="flex items-start gap-2 text-gray-400">
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <p className="text-xs leading-relaxed">Click a zone marker on the map to load operational intelligence and AI dispatch recommendations.</p>
                </div>

                {/* Summary stats */}
                <div className="grid grid-cols-2 gap-2 mt-3">
                  {[
                    { label: 'Active Zones',  val: 7,    color: 'text-india-red'   },
                    { label: 'Total Stranded',val: '595', color: 'text-saffron'     },
                    { label: 'Rescue Teams',  val: 3,    color: 'text-navy'        },
                    { label: 'Drones Live',   val: 3,    color: 'text-india-green' },
                  ].map(({ label, val, color }) => (
                    <div key={label} className="bg-white border border-surface-300 rounded-lg p-2.5">
                      <p className="text-[10px] text-gray-400 uppercase tracking-wide">{label}</p>
                      <p className={`text-xl font-bold font-heading ${color}`}>{val}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── OPERATIONAL LOG ──────────────────────────── */}
            <div className="px-4 py-3">
              <div className="flex items-center gap-1.5 mb-3">
                <Activity className="w-3.5 h-3.5 text-navy" />
                <span className="text-xs font-bold text-navy">Operational Log</span>
                <span className="ml-auto status-dot-live" />
                <span className="text-[10px] font-mono text-gray-400">Live</span>
              </div>

              <div className="space-y-2">
                {operationalLogs.map((log, i) => (
                  <div key={i} className="flex gap-2 text-xs">
                    <span className="text-gray-400 font-mono text-[10px] w-10 flex-shrink-0 mt-0.5">{log.time}</span>
                    <div className="flex-1">
                      <div className={`inline-flex items-center px-1.5 py-0.5 rounded border text-[9px] font-bold uppercase tracking-wide mb-0.5 ${LOG_COLORS[log.type]}`}>
                        {log.type}
                      </div>
                      <p className="text-gray-700 leading-snug">{log.msg}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet.heat';
import {
  humanClusters, warehouses, resources, drones,
  heatCrowd, heatSeverity, heatDemand, severityConfig,
} from './puneData';

/* ── helpers ───────────────────────────────────────────────────────── */
const getHumanIcon = (severity) => {
  const isCrit = severity === 'critical';
  const size = isCrit ? 26 : (severity === 'high' ? 22 : 18);
  const emoji = isCrit ? '🆘' : '⚠️';
  const bg = severityConfig[severity]?.color || '#FF9933';
  return L.divIcon({
    className: '',
    html: `<div class="marker-pulse-${severity}" style="width:${size}px;height:${size}px;background:${bg};border:2px solid white;border-radius:50%;box-shadow:0 0 8px ${bg};display:flex;align-items:center;justify-content:center;font-size:${size*0.55}px;color:white;">${emoji}</div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2]
  });
};

const getWarehouseIcon = (color) => L.divIcon({
  className: '',
  html: `<div style="width:28px;height:28px;background:${color};border:2px solid white;border-radius:6px;box-shadow:0 3px 8px rgba(0,0,0,0.4);display:flex;align-items:center;justify-content:center;font-size:16px;">🏭</div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 14]
});

const getResourceIcon = (type) => {
  const config = {
    truck: { e: '🚚', bg: '#3B82F6' },
    boat: { e: '🚤', bg: '#0EA5E9' },
    ambulance: { e: '🚑', bg: '#D32F2F' },
    team: { e: '🛡️', bg: '#138808' },
  };
  const c = config[type] || { e: '📦', bg: '#6B7280' };
  return L.divIcon({
    className: '',
    html: `<div style="width:26px;height:26px;background:${c.bg};border:2px solid white;border-radius:50%;box-shadow:0 2px 6px rgba(0,0,0,0.4);display:flex;align-items:center;justify-content:center;font-size:14px;">${c.e}</div>`,
    iconSize: [26, 26],
    iconAnchor: [13, 13]
  });
};

const getDroneIcon = () => L.divIcon({
  className: '',
  html: `<div style="width:24px;height:24px;background:#8B5CF6;border:2px solid white;border-radius:50%;box-shadow:0 0 10px #8B5CF6;display:flex;align-items:center;justify-content:center;font-size:14px;">🚁</div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 12]
});

const popupHtml = (z) => `
<div style="font-family:Inter,sans-serif;min-width:220px;overflow:hidden;border-radius:8px;">
  <div style="background:#0B1F3A;color:white;padding:10px 14px;">
    <p style="font-size:11px;color:#93C5FD;margin:0 0 2px;text-transform:uppercase;letter-spacing:.06em;">Zone ID</p>
    <p style="font-weight:700;font-size:14px;margin:0;">${z.id}</p>
    <p style="font-size:11px;color:#BAC8E8;margin:2px 0 0;">${z.name}</p>
  </div>
  <div style="padding:10px 14px;background:#fff;">
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;font-size:12px;">
      <div><span style="color:#6B7280;">People</span><br><strong style="color:#0B1F3A;">${z.people}</strong> (${z.children} children)</div>
      <div><span style="color:#6B7280;">Severity</span><br><strong style="color:${severityConfig[z.severity]?.color}">${z.severity.toUpperCase()}</strong></div>
      <div><span style="color:#6B7280;">Water Level</span><br><strong>${z.waterLevel}</strong></div>
      <div><span style="color:#6B7280;">Medical Risk</span><br><strong>${z.medicalRisk}</strong></div>
      <div><span style="color:#6B7280;">Road Access</span><br><strong>${z.roadAccess}</strong></div>
      <div><span style="color:#6B7280;">Nearest WH</span><br><strong>${z.nearestWarehouse}</strong></div>
    </div>
    <div style="margin-top:8px;padding-top:8px;border-top:1px solid #EEF0F5;font-size:11px;color:#6B7280;">
      AI Score: <strong style="color:#FF9933">${z.aiScore}%</strong> &nbsp;·&nbsp; ${z.detectedBy} &nbsp;·&nbsp; ${z.lastUpdate}
    </div>
  </div>
</div>`;

const resourcePopup = (r) => `
<div style="font-family:Inter,sans-serif;min-width:190px;border-radius:8px;overflow:hidden;">
  <div style="background:#0B1F3A;color:white;padding:8px 12px;">
    <p style="font-weight:700;font-size:13px;margin:0;">${r.name}</p>
    <span style="font-size:10px;color:#93C5FD;text-transform:uppercase;">${r.type}</span>
  </div>
  <div style="padding:8px 12px;font-size:12px;background:#fff;">
    ${r.route ? `<p style="margin:3px 0;"><b>Route:</b> ${r.route}</p>` : ''}
    ${r.eta ? `<p style="margin:3px 0;"><b>ETA:</b> ${r.eta}</p>` : ''}
    ${r.cargo ? `<p style="margin:3px 0;"><b>Cargo:</b> ${r.cargo}</p>` : ''}
    ${r.members ? `<p style="margin:3px 0;"><b>Members:</b> ${r.members}</p>` : ''}
    <p style="margin:4px 0 0;font-weight:600;color:${r.status === 'ACTIVE' || r.status === 'DEPLOYED' ? '#138808' : '#FF9933'}">${r.status}</p>
  </div>
</div>`;

const warehousePopup = (w) => `
<div style="font-family:Inter,sans-serif;min-width:190px;border-radius:8px;overflow:hidden;">
  <div style="background:#000080;color:white;padding:8px 12px;">
    <p style="font-weight:700;font-size:13px;margin:0;">${w.name}</p>
    <span style="font-size:10px;color:#BAC8E8;text-transform:uppercase;">Warehouse · ${w.stock} Stock</span>
  </div>
  <div style="padding:8px 12px;font-size:12px;background:#fff;">
    <p style="margin:3px 0;">🍱 Food Packets: <b>${w.food?.toLocaleString()}</b></p>
    <p style="margin:3px 0;">💧 Water: <b>${w.water?.toLocaleString()}L</b></p>
    <p style="margin:3px 0;">🏥 Medical Kits: <b>${w.medical}</b></p>
  </div>
</div>`;

export default function LiveMap({ filters, onZoneSelect }) {
  const mapRef = useRef(null);
  const mapInst = useRef(null);
  const layerRefs = useRef({});

  useEffect(() => {
    if (!mapRef.current || mapInst.current) return;

    const map = L.map(mapRef.current, {
      center: [18.52, 73.85],
      zoom: 11,
      zoomControl: false,
      attributionControl: true,
    });
    mapInst.current = map;

    // Zoom control — top right
    L.control.zoom({ position: 'topright' }).addTo(map);

    // Tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap · DAVI VISION',
      maxZoom: 18,
    }).addTo(map);

    // ── Human Cluster Layer ────────────────────────────────
    const humanLayer = L.layerGroup();
    humanClusters.forEach((z) => {
      const marker = L.marker([z.lat, z.lng], { icon: getHumanIcon(z.severity) })
        .bindPopup(popupHtml(z), { maxWidth: 260 })
        .on('click', () => onZoneSelect && onZoneSelect(z));
      humanLayer.addLayer(marker);

      // Flood radius
      L.circle([z.lat, z.lng], {
        radius: z.severity === 'critical' ? 2200 : z.severity === 'high' ? 1600 : 1000,
        color: severityConfig[z.severity]?.color,
        fillColor: severityConfig[z.severity]?.fill,
        fillOpacity: 0.12, weight: 1.5,
      }).addTo(humanLayer);
    });
    humanLayer.addTo(map);
    layerRefs.current.humans = humanLayer;

    // ── Warehouse Layer ───────────────────────────────────
    const whLayer = L.layerGroup();
    warehouses.forEach((w) => {
      const color = w.stock === 'Critical' ? '#D32F2F' : w.stock === 'High' ? '#138808' : '#FF9933';
      L.marker([w.lat, w.lng], { icon: getWarehouseIcon(color) })
        .bindPopup(warehousePopup(w), { maxWidth: 220 })
        .addTo(whLayer);
    });
    whLayer.addTo(map);
    layerRefs.current.warehouses = whLayer;

    // ── Resource Layer ────────────────────────────────────
    const resLayer = L.layerGroup();
    resources.filter(r => r.type !== 'team').forEach((r) => {
      L.marker([r.lat, r.lng], { icon: getResourceIcon(r.type) })
        .bindPopup(resourcePopup(r), { maxWidth: 220 })
        .addTo(resLayer);
    });
    resLayer.addTo(map);
    layerRefs.current.trucks = resLayer;

    // ── Drone Layer ───────────────────────────────────────
    const droneLayer = L.layerGroup();
    drones.forEach((d) => {
      L.marker([d.lat, d.lng], { icon: getDroneIcon() })
        .bindTooltip(`<strong>${d.name}</strong> · ${d.battery}% bat · ${d.altitude}`)
        .addTo(droneLayer);
      L.circle([d.lat, d.lng], {
        radius: d.radius,
        color: '#8B5CF6', fillColor: '#8B5CF6',
        fillOpacity: 0.07, weight: 1, dashArray: '4 4',
      }).addTo(droneLayer);
    });
    droneLayer.addTo(map);
    layerRefs.current.drones = droneLayer;

    // ── Rescue Teams (separate toggle) ───────────────────
    const teamLayer = L.layerGroup();
    resources.filter(r => r.type === 'team').forEach((r) => {
      L.marker([r.lat, r.lng], { icon: getResourceIcon(r.type) })
        .bindPopup(resourcePopup(r)).addTo(teamLayer);
    });
    teamLayer.addTo(map);
    layerRefs.current.teams = teamLayer;

    // ── Heatmap Layers ────────────────────────────────────
    const heatCrowdLayer = L.heatLayer(heatCrowd, { radius: 35, blur: 22, maxZoom: 13, gradient: { 0.3: '#138808', 0.5: '#F59E0B', 0.75: '#FF9933', 1.0: '#D32F2F' } });
    const heatSevLayer   = L.heatLayer(heatSeverity, { radius: 45, blur: 28, maxZoom: 13, gradient: { 0.2: '#3B82F6', 0.5: '#F59E0B', 0.8: '#FF9933', 1.0: '#D32F2F' } });
    const heatDemLayer   = L.heatLayer(heatDemand,   { radius: 40, blur: 25, maxZoom: 13, gradient: { 0.3: '#138808', 0.6: '#F59E0B', 1.0: '#D32F2F' } });
    layerRefs.current.heatCrowd    = heatCrowdLayer;
    layerRefs.current.heatSeverity = heatSevLayer;
    layerRefs.current.heatDemand   = heatDemLayer;
    // None on by default; toggled via filters

    // ── Scale control ─────────────────────────────────────
    L.control.scale({ position: 'bottomright', imperial: false }).addTo(map);

    return () => { map.remove(); mapInst.current = null; };
  }, []);

  // ── Sync layer visibility to filters ──────────────────
  useEffect(() => {
    const map = mapInst.current;
    if (!map) return;
    const { lr } = { lr: layerRefs.current };
    const toggle = (layer, on) => {
      if (!layer) return;
      if (on && !map.hasLayer(layer)) map.addLayer(layer);
      if (!on && map.hasLayer(layer)) map.removeLayer(layer);
    };
    if (!filters) return;
    toggle(lr.humans,      filters.showHumans      !== false);
    toggle(lr.warehouses,  filters.showWarehouses   !== false);
    toggle(lr.trucks,      filters.showTrucks       !== false);
    toggle(lr.drones,      filters.showDrones       !== false);
    toggle(lr.teams,       filters.showTeams        !== false);
    toggle(lr.heatCrowd,   filters.heatCrowd        === true);
    toggle(lr.heatSeverity,filters.heatSeverity     === true);
    toggle(lr.heatDemand,  filters.heatDemand       === true);

    // Filter humans dynamically based on severity and district
    if (lr.humans) {
      lr.humans.clearLayers();
      humanClusters.forEach((z) => {
        if (filters.severity && filters.severity !== 'all' && z.severity !== filters.severity) return;
        if (filters.district && filters.district !== 'all' && z.zone !== filters.district) return;
        
        const marker = L.marker([z.lat, z.lng], { icon: getHumanIcon(z.severity) })
          .bindPopup(popupHtml(z), { maxWidth: 260 })
          .on('click', () => onZoneSelect && onZoneSelect(z));
        lr.humans.addLayer(marker);

        L.circle([z.lat, z.lng], {
          radius: z.severity === 'critical' ? 2200 : z.severity === 'high' ? 1600 : 1000,
          color: severityConfig[z.severity]?.color,
          fillColor: severityConfig[z.severity]?.fill,
          fillOpacity: 0.12, weight: 1.5,
        }).addTo(lr.humans);
      });
    }
  }, [filters, onZoneSelect]);

  return (
    <div ref={mapRef} className="w-full h-full" />
  );
}

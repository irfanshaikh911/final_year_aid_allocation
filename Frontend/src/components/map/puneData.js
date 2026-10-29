// ─── Human Clusters (Strictly along Mula-Mutha Rivers) ────────────────────────
export const humanClusters = [
  {
    id: 'PN-SANGAM-01', name: 'Sangamwadi Riverside Slums',
    lat: 18.5364, lng: 73.8682,
    people: 134, children: 17, severity: 'critical',
    waterLevel: '3.2m', medicalRisk: 'High', roadAccess: 'Blocked',
    nearestWarehouse: '4.5 km', detectedBy: 'Drone-1 Alpha',
    aiScore: 91, lastUpdate: '14:22 IST', zone: 'Sangamwadi',
    rec: { items: [{ r: 'Rescue Boats', q: 2 }, { r: 'Food Packets', q: 1200 }, { r: 'Medical Kits', q: 20 }], confidence: 92, eta: '18 mins', priority: 'HIGH' },
  },
  {
    id: 'PN-DECCAN-02', name: 'Deccan Riverbed Path',
    lat: 18.5141, lng: 73.8421,
    people: 82, children: 8, severity: 'high',
    waterLevel: '2.1m', medicalRisk: 'Moderate', roadAccess: 'Limited',
    nearestWarehouse: '3.2 km', detectedBy: 'Drone-4 Delta',
    aiScore: 78, lastUpdate: '14:18 IST', zone: 'Deccan',
    rec: { items: [{ r: 'Earth Movers', q: 1 }, { r: 'Food Packets', q: 600 }, { r: 'Water', q: '400L' }], confidence: 84, eta: '25 mins', priority: 'HIGH' },
  },
  {
    id: 'PN-YERAWADA-03', name: 'Yerawada Bridge Flood Zone',
    lat: 18.5445, lng: 73.8822,
    people: 47, children: 5, severity: 'moderate',
    waterLevel: '1.4m', medicalRisk: 'Low', roadAccess: 'Open',
    nearestWarehouse: '6.1 km', detectedBy: 'Drone-2 Bravo',
    aiScore: 62, lastUpdate: '14:15 IST', zone: 'Yerawada',
    rec: { items: [{ r: 'Food Packets', q: 400 }, { r: 'Water', q: '200L' }, { r: 'Tarpaulins', q: 50 }], confidence: 75, eta: '15 mins', priority: 'MEDIUM' },
  },
  {
    id: 'PN-AUNDH-04', name: 'Aundh Riverside',
    lat: 18.5580, lng: 73.8050,
    people: 31, children: 4, severity: 'high',
    waterLevel: '2.8m', medicalRisk: 'High', roadAccess: 'Limited',
    nearestWarehouse: '5.5 km', detectedBy: 'Drone-4 Delta',
    aiScore: 74, lastUpdate: '14:10 IST', zone: 'Aundh',
    rec: { items: [{ r: 'Rescue Boats', q: 1 }, { r: 'Medical Kits', q: 8 }, { r: 'Food Packets', q: 250 }], confidence: 79, eta: '30 mins', priority: 'HIGH' },
  },
  {
    id: 'PN-KHARADI-05', name: 'Kharadi River Bank',
    lat: 18.5440, lng: 73.9360,
    people: 68, children: 12, severity: 'high',
    waterLevel: '2.9m', medicalRisk: 'High', roadAccess: 'Blocked',
    nearestWarehouse: '4.2 km', detectedBy: 'Drone-1 Alpha',
    aiScore: 83, lastUpdate: '14:05 IST', zone: 'Kharadi',
    rec: { items: [{ r: 'Rescue Teams', q: 2 }, { r: 'Food Packets', q: 500 }, { r: 'Medical Kits', q: 12 }], confidence: 88, eta: '45 mins', priority: 'HIGH' },
  },
  {
    id: 'PN-SHIVAJI-06', name: 'Shivajinagar Mutha Banks',
    lat: 18.5274, lng: 73.8510,
    people: 210, children: 38, severity: 'critical',
    waterLevel: '3.8m', medicalRisk: 'High', roadAccess: 'Blocked',
    nearestWarehouse: '4.8 km', detectedBy: 'Ground Survey',
    aiScore: 94, lastUpdate: '14:20 IST', zone: 'Shivajinagar',
    rec: { items: [{ r: 'Food Packets', q: 1800 }, { r: 'Water', q: '1200L' }, { r: 'Rescue Boats', q: 3 }], confidence: 95, eta: '10 mins', priority: 'CRITICAL' },
  },
  {
    id: 'PN-DAPODI-07', name: 'Dapodi Mula Confluence',
    lat: 18.5830, lng: 73.8290,
    people: 23, children: 3, severity: 'moderate',
    waterLevel: '1.1m', medicalRisk: 'Low', roadAccess: 'Open',
    nearestWarehouse: '8.8 km', detectedBy: 'Aerial Survey',
    aiScore: 55, lastUpdate: '13:58 IST', zone: 'Dapodi',
    rec: { items: [{ r: 'Food Packets', q: 180 }, { r: 'Water', q: '100L' }], confidence: 68, eta: '55 mins', priority: 'LOW' },
  },
];

// ─── Warehouses (Safe, High Ground / Outskirts) ─────────────────────────────
export const warehouses = [
  { id: 'WH-WAGHOLI', lat: 18.5800, lng: 73.9700, name: 'Wagholi Central Safe-Hub', stock: 'High', food: 4200, water: 8500, medical: 540 },
  { id: 'WH-KATRAJ', lat: 18.4526, lng: 73.8524, name: 'Katraj Hill Depot', stock: 'Critical', food: 120, water: 2100, medical: 18 },
  { id: 'WH-KOTHRUD', lat: 18.5074, lng: 73.8077, name: 'Kothrud Medical Reserve', stock: 'Medium', food: 650, water: 3200, medical: 280 },
];

// ─── Moving Resources ────────────────────────────────────────────────────────
export const resources = [
  { id: 'AT-07', type: 'truck', lat: 18.5700, lng: 73.9500, name: 'Aid Truck AT-07', route: 'Wagholi Hub → Kharadi', eta: '18 mins', cargo: 'Food:1200, Water:800L', status: 'EN ROUTE' },
  { id: 'AT-12', type: 'truck', lat: 18.4700, lng: 73.8500, name: 'Aid Truck AT-12', route: 'Katraj Depot → Deccan', eta: '9 mins', cargo: 'Food:600, Tarpaulins:50', status: 'EN ROUTE' },
  { id: 'RB-03', type: 'boat', lat: 18.5300, lng: 73.8600, name: 'Rescue Boat RB-03', route: 'Sangamwadi Confluence', eta: '8 mins', cargo: 'Rescue Team Alpha (8)', status: 'ACTIVE' },
  { id: 'AMB-02', type: 'ambulance', lat: 18.5150, lng: 73.8200, name: 'Ambulance AMB-02', route: 'Kothrud → Shivajinagar', eta: '12 mins', cargo: 'Medical Kit + Paramedics', status: 'EN ROUTE' },
  { id: 'RES-ALPHA', type: 'team', lat: 18.5364, lng: 73.8682, name: 'Rescue Team Alpha', members: 12, status: 'DEPLOYED', zone: 'Sangamwadi' },
  { id: 'RES-BRAVO', type: 'team', lat: 18.5274, lng: 73.8510, name: 'Rescue Team Bravo', members: 8, status: 'DEPLOYED', zone: 'Shivajinagar' },
  { id: 'RES-CHARLIE', type: 'team', lat: 18.5440, lng: 73.9360, name: 'Rescue Team Charlie', members: 10, status: 'STANDBY', zone: 'Kharadi' },
];

// ─── Drone Coverage ──────────────────────────────────────────────────────────
export const drones = [
  { id: 'DRONE-1', name: 'Drone-1 Alpha', lat: 18.5364, lng: 73.8682, status: 'live', battery: 78, altitude: '120m', signal: 'Strong', radius: 1500 },
  { id: 'DRONE-2', name: 'Drone-2 Bravo', lat: 18.5440, lng: 73.9360, status: 'live', battery: 42, altitude: '85m', signal: 'Medium', radius: 1200 },
  { id: 'DRONE-4', name: 'Drone-4 Delta', lat: 18.5141, lng: 73.8421, status: 'live', battery: 91, altitude: '150m', signal: 'Strong', radius: 1800 },
];

// ─── Heatmap Points (Focused on the Rivers) ──────────────────────────────────
export const heatCrowd = [
  [18.5364, 73.8682, 1.0], [18.5380, 73.8700, 0.8], [18.5350, 73.8650, 0.7],
  [18.5141, 73.8421, 0.7], [18.5160, 73.8450, 0.5],
  [18.5445, 73.8822, 0.4], [18.5460, 73.8850, 0.3],
  [18.5580, 73.8050, 0.4], [18.5600, 73.8100, 0.3],
  [18.5440, 73.9360, 0.6], [18.5420, 73.9300, 0.5],
  [18.5274, 73.8510, 0.9], [18.5250, 73.8480, 0.7],
];

export const heatSeverity = [
  [18.5364, 73.8682, 1.0], [18.5274, 73.8510, 0.9], [18.5141, 73.8421, 0.8],
  [18.5440, 73.9360, 0.7], [18.5580, 73.8050, 0.6],
  [18.5830, 73.8290, 0.7], [18.5445, 73.8822, 0.7],
];

export const heatDemand = [
  [18.5364, 73.8682, 1.0], [18.5141, 73.8421, 0.8],
  [18.5580, 73.8050, 0.9], [18.5440, 73.9360, 0.7],
  [18.5445, 73.8822, 0.5], [18.5274, 73.8510, 0.6],
  [18.5830, 73.8290, 0.3],
];

// ─── Operational Logs ───────────────────────────────────────────────────────
export const operationalLogs = [
  { time: '14:32', type: 'alert', msg: 'Water level +0.4m at Sangamwadi Confluence — now 3.6m' },
  { time: '14:30', type: 'dispatch', msg: 'Aid Truck AT-07 dispatched from Wagholi Hub' },
  { time: '14:28', type: 'ai', msg: 'AI raised PN-SHIVAJI-06 priority to CRITICAL (score: 94)' },
  { time: '14:26', type: 'dispatch', msg: 'Rescue Team Alpha deployed to Sangamwadi' },
  { time: '14:24', type: 'alert', msg: 'Road blockage confirmed — Deccan riverside road closed' },
  { time: '14:22', type: 'ai', msg: 'Drone-1 Alpha detected 17 children in PN-SANGAM-01' },
  { time: '14:20', type: 'approval', msg: 'Cmdr. Rajesh approved allocation for Shivajinagar' },
  { time: '14:18', type: 'alert', msg: 'Communication loss — RES-07 near Yerawada. Last GPS logged.' },
  { time: '14:16', type: 'dispatch', msg: 'Rescue Boat RB-03 launched from Sangamwadi' },
  { time: '14:14', type: 'ai', msg: 'AI recommended 2 boats for PN-SANGAM-01 (confidence 92%)' },
];

// ─── Severity config ─────────────────────────────────────────────────────────
export const severityConfig = {
  critical: { color: '#D32F2F', fill: '#D32F2F', label: 'Critical', pulse: true },
  high:     { color: '#FF9933', fill: '#FF9933', label: 'High',     pulse: false },
  moderate: { color: '#F59E0B', fill: '#F59E0B', label: 'Moderate', pulse: false },
  low:      { color: '#138808', fill: '#138808', label: 'Low',      pulse: false },
};

import { create } from 'zustand';
import { humanClusters, resources } from '../components/map/puneData';

const totalStranded = humanClusters.reduce((sum, c) => sum + c.people, 0);
const activeZonesCount = humanClusters.filter(c => c.people > 0).length;
const rescueTeamsCount = resources.length; // Active resources/teams

export const useAppStore = create((set, get) => ({
  // Sidebar state
  sidebarOpen: true,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),

  // Active page
  activePage: 'dashboard',
  setActivePage: (page) => set({ activePage: page }),

  // Alert panel
  alerts: [
    { id: 1, type: 'critical', message: 'Severe flooding detected in Sangamwadi Catchment Area', time: '2 min ago', zone: 'Sangamwadi' },
    { id: 2, type: 'warning', message: 'Food stock below critical threshold at Katraj Hill Depot', time: '8 min ago', zone: 'Katraj' },
    { id: 3, type: 'critical', message: 'Drone-2 detected large civilian gathering — Kharadi river banks', time: '12 min ago', zone: 'Kharadi' },
    { id: 4, type: 'warning', message: 'Rescue team RES-07 communication loss — Last seen: Deccan Riverbed', time: '18 min ago', zone: 'Deccan' },
    { id: 5, type: 'info', message: 'AI allocation approved for Shivajinagar Zone — ETA 10 mins', time: '25 min ago', zone: 'Shivajinagar' },
  ],
  dismissAlert: (id) => set((s) => ({ alerts: s.alerts.filter(a => a.id !== id) })),

  // AI Recommendations (dynamic)
  recommendations: [],
  dispatchedClusters: {},
  markClusterDispatched: (clusterId, data) => set((s) => ({
    dispatchedClusters: { ...s.dispatchedClusters, [clusterId]: data }
  })),
  addRecommendation: (rec) => set((s) => ({ recommendations: [rec, ...s.recommendations] })),
  updateRecommendationStatus: (id, status) => set((s) => ({
    recommendations: s.recommendations.map((r) => (r.id === id ? { ...r, status } : r))
  })),
  approveRecommendation: (id) =>
    set((s) => ({
      recommendations: s.recommendations.map((r) => r.id === id ? { ...r, status: 'approved' } : r),
    })),
  rejectRecommendation: (id) =>
    set((s) => ({
      recommendations: s.recommendations.map((r) => r.id === id ? { ...r, status: 'rejected' } : r),
    })),

  // Inventory
  inventory: [],
  fetchInventory: async () => {
    try {
      const res = await fetch('http://localhost:8000/api/inventory');
      const data = await res.json();
      set({ inventory: data });
    } catch (err) {
      console.error('Failed to fetch inventory:', err);
    }
  },
  addInventoryItem: async (item) => {
    try {
      const res = await fetch('http://localhost:8000/api/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      });
      if (res.ok) {
        const savedItem = await res.json();
        set((state) => {
          const exists = state.inventory.some(i => i.id === savedItem.id);
          if (exists) {
            return {
              inventory: state.inventory.map(i => i.id === savedItem.id ? savedItem : i)
            };
          }
          return { inventory: [...state.inventory, savedItem] };
        });
      }
    } catch (err) {
      console.error('Failed to add inventory item:', err);
    }
  },

  // Stats
  stats: {
    affectedPeople: totalStranded,
    activeZones: activeZonesCount,
    aidDispatched: 142,
    rescueTeams: rescueTeamsCount,
  },

  // Drone feeds
  droneFeeds: [
    {
      id: 1,
      name: 'Drone-1 Alpha (Sangamwadi)',
      zone: 'Sangamwadi',
      status: 'live',
      lat: 18.5364,
      lng: 73.8682,
      battery: 78,
      altitude: '120m',
      signal: 'Strong',
      detections: { humans: 87, severity: 'Critical', blockedRoads: 5, waterLevel: '4.2m' },
    },
    {
      id: 2,
      name: 'Drone-2 Bravo (Kharadi)',
      zone: 'Kharadi',
      status: 'live',
      lat: 18.5440,
      lng: 73.9360,
      battery: 42,
      altitude: '85m',
      signal: 'Medium',
      detections: { humans: 134, severity: 'High', blockedRoads: 3, waterLevel: '2.8m' },
    },
    {
      id: 3,
      name: 'Drone-3 Charlie (Deccan)',
      zone: 'Deccan',
      status: 'maintenance',
      lat: 18.5141,
      lng: 73.8421,
      battery: 12,
      altitude: '0m',
      signal: 'Weak',
      detections: { humans: 0, severity: 'Moderate', blockedRoads: 1, waterLevel: '1.1m' },
    },
    {
      id: 4,
      name: 'Drone-4 Delta (Aundh)',
      zone: 'Aundh',
      status: 'live',
      lat: 18.5580,
      lng: 73.8050,
      battery: 91,
      altitude: '150m',
      signal: 'Strong',
      detections: { humans: 42, severity: 'High', blockedRoads: 2, waterLevel: '3.5m' },
    },
  ],

  // Chat
  chatMessages: [
    {
      id: 1,
      role: 'assistant',
      text: 'DAVI Intelligence ready. How can I assist with disaster coordination?',
      time: '14:00',
    },
  ],
  addChatMessage: (msg) =>
    set((s) => ({ chatMessages: [...s.chatMessages, { ...msg, id: Date.now() }] })),

  // Map filters
  mapFilters: {
    showWarehouses: true,
    showRescueTeams: true,
    showDrones: true,
    showHeatmap: false,
    severityFilter: 'all',
  },
  setMapFilter: (key, value) =>
    set((s) => ({ mapFilters: { ...s.mapFilters, [key]: value } })),
}));

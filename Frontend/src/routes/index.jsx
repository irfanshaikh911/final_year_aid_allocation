import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import LandingPage from '../pages/Landing';
import DashboardPage from '../pages/Dashboard';
import LiveMapPage from '../pages/LiveMap';
import DroneFeedPage from '../pages/DroneFeed';
import InventoryPage from '../pages/Inventory';
import AddInventoryPage from '../pages/Inventory/AddInventory';
import AllocationDetail from '../pages/AllocationDetail';
import AiEngine from '../pages/AiEngine';
import ChatBotPage from '../pages/ChatBot';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Landing */}
      <Route path="/" element={<LandingPage />} />

      {/* Dashboard Layout */}
      <Route element={<DashboardLayout />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/map" element={<LiveMapPage />} />
        <Route path="/drone" element={<DroneFeedPage />} />
        <Route path="/inventory" element={<InventoryPage />} />
        <Route path="/inventory/add" element={<AddInventoryPage />} />
        <Route path="/allocation-detail/:clusterId" element={<AllocationDetail />} />
        <Route path="/ai-engine" element={<AiEngine />} />
        <Route path="/chatbot" element={<ChatBotPage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

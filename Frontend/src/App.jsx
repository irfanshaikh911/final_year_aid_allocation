import { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes';
import { useAppStore } from './store/appStore';

export default function App() {
  const { fetchInventory } = useAppStore();

  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

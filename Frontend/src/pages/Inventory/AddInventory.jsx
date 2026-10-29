import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, ArrowLeft, Save, X } from 'lucide-react';
import { useAppStore } from '../../store/appStore';

const UNITS = ['units', 'litres', 'kits', 'sets'];

export default function AddInventoryPage() {
  const navigate = useNavigate();
  const { inventory, addInventoryItem } = useAppStore();

  const RESOURCE_TYPES = [...new Set(inventory.map(i => i.resource))];
  const WAREHOUSES = [...new Set(inventory.map(i => i.warehouse))];

  // Provide fallback options if inventory is empty
  const defaultResource = RESOURCE_TYPES.length > 0 ? RESOURCE_TYPES[0] : 'Food Packets';
  const defaultWarehouse = WAREHOUSES.length > 0 ? WAREHOUSES[0] : 'WH-Shivajinagar';

  const [formData, setFormData] = useState({
    resource: defaultResource,
    warehouse: defaultWarehouse,
    available: '',
    inTransit: '',
    unit: UNITS[0],
    critical: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Parse numeric fields
    const newItem = {
      ...formData,
      available: parseInt(formData.available, 10) || 0,
      inTransit: parseInt(formData.inTransit, 10) || 0,
    };

    addInventoryItem(newItem);
    navigate('/inventory');
  };

  return (
    <div className="p-5 space-y-5 animate-fade-in max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/inventory')}
          className="p-2 hover:bg-surface-200 rounded-full transition-colors"
          aria-label="Back to Inventory"
        >
          <ArrowLeft className="w-5 h-5 text-gray-500" />
        </button>
        <div>
          <h1 className="text-xl font-heading font-bold text-navy">Add New Inventory Item</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Register new aid resources into the district warehouse network
          </p>
        </div>
      </div>

      {/* Form Card */}
      <div className="content-card">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Resource Type */}
            <div className="space-y-2">
              <label htmlFor="resource" className="block text-sm font-semibold text-gray-700">
                Resource Type
              </label>
              <select
                id="resource"
                name="resource"
                value={formData.resource}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-surface-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy"
                required
              >
                {RESOURCE_TYPES.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>

            {/* Warehouse */}
            <div className="space-y-2">
              <label htmlFor="warehouse" className="block text-sm font-semibold text-gray-700">
                Warehouse Location
              </label>
              <select
                id="warehouse"
                name="warehouse"
                value={formData.warehouse}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-surface-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy"
                required
              >
                {WAREHOUSES.map(w => <option key={w} value={w}>{w}</option>)}
              </select>
            </div>

            {/* Available Quantity */}
            <div className="space-y-2">
              <label htmlFor="available" className="block text-sm font-semibold text-gray-700">
                Available Quantity
              </label>
              <input
                type="number"
                id="available"
                name="available"
                value={formData.available}
                onChange={handleChange}
                min="0"
                className="w-full px-3 py-2 text-sm border border-surface-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy"
                required
              />
            </div>

            {/* Unit */}
            <div className="space-y-2">
              <label htmlFor="unit" className="block text-sm font-semibold text-gray-700">
                Unit of Measurement
              </label>
              <select
                id="unit"
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-surface-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy"
                required
              >
                {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>

            {/* In Transit Quantity */}
            <div className="space-y-2">
              <label htmlFor="inTransit" className="block text-sm font-semibold text-gray-700">
                Quantity In Transit (Optional)
              </label>
              <input
                type="number"
                id="inTransit"
                name="inTransit"
                value={formData.inTransit}
                onChange={handleChange}
                min="0"
                className="w-full px-3 py-2 text-sm border border-surface-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy"
              />
            </div>
          </div>

          {/* Critical Status */}
          <div className="pt-2">
            <label className="flex items-center gap-3 cursor-pointer">
              <div className="relative flex items-center">
                <input
                  type="checkbox"
                  name="critical"
                  checked={formData.critical}
                  onChange={handleChange}
                  className="w-5 h-5 text-india-red border-surface-300 rounded focus:ring-india-red"
                />
              </div>
              <div>
                <span className="text-sm font-semibold text-gray-800">Mark as Critical</span>
                <p className="text-xs text-gray-500 mt-0.5">
                  Check this box if the stock level for this item is dangerously low.
                </p>
              </div>
            </label>
          </div>

          <hr className="border-surface-200 my-6" />

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate('/inventory')}
              className="btn-outline text-gray-600 border-gray-300 hover:bg-gray-50 hover:text-gray-800"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              <Save className="w-4 h-4" />
              Submit to Inventory
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

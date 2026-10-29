import { useState, useEffect } from 'react';
import { Search, Filter, ChevronDown, ArrowUpDown } from 'lucide-react';
import { useAppStore } from '../../store/appStore';
import { formatNumber } from '../../utils/formatters';

export default function InventoryTable({ onFilterChange }) {
  const { inventory } = useAppStore();
  const [search, setSearch] = useState('');
  const [resourceFilter, setResourceFilter] = useState('All');
  const [warehouseFilter, setWarehouseFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const RESOURCE_TYPES = ['All', ...new Set(inventory.map(i => i.resource))];
  const WAREHOUSES = ['All', ...new Set(inventory.map(i => i.warehouse))];

  const filtered = inventory.filter((item) => {
    const matchSearch =
      item.resource.toLowerCase().includes(search.toLowerCase()) ||
      item.warehouse.toLowerCase().includes(search.toLowerCase());
    const matchResource = resourceFilter === 'All' || item.resource === resourceFilter;
    const matchWarehouse = warehouseFilter === 'All' || item.warehouse === warehouseFilter;
    const matchStatus = statusFilter === 'All' || (statusFilter === 'Critical' ? item.critical : !item.critical);
    return matchSearch && matchResource && matchWarehouse && matchStatus;
  });

  useEffect(() => {
    if (onFilterChange) {
      onFilterChange(filtered.length);
    }
  }, [filtered.length, onFilterChange]);

  const getCriticalBadge = (item) => {
    if (item.critical) return <span className="badge-critical">Critical</span>;
    if (item.available < 500) return <span className="badge-warning">Low</span>;
    return <span className="badge-normal">Normal</span>;
  };

  return (
    <div className="content-card">
      {/* Filters row */}
      <div className="flex flex-wrap gap-3 mb-4">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search resource or warehouse..."
            className="w-full pl-8 pr-3 py-2 text-sm border border-surface-300 rounded-md bg-white 
                       focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy"
          />
        </div>

        <div className="relative">
          <select
            value={resourceFilter}
            onChange={(e) => setResourceFilter(e.target.value)}
            className="appearance-none pl-3 pr-8 py-2 text-sm border border-surface-300 rounded-md bg-white
                       focus:outline-none focus:ring-2 focus:ring-navy/20 text-gray-700"
          >
            {RESOURCE_TYPES.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>

        <div className="relative">
          <select
            value={warehouseFilter}
            onChange={(e) => setWarehouseFilter(e.target.value)}
            className="appearance-none pl-3 pr-8 py-2 text-sm border border-surface-300 rounded-md bg-white
                       focus:outline-none focus:ring-2 focus:ring-navy/20 text-gray-700"
          >
            {WAREHOUSES.map((w) => <option key={w} value={w}>{w}</option>)}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>

        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="appearance-none pl-3 pr-8 py-2 text-sm border border-surface-300 rounded-md bg-white
                       focus:outline-none focus:ring-2 focus:ring-navy/20 text-gray-700"
          >
            {['All', 'Critical', 'Normal'].map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-surface-300">
        <table className="data-table">
          <thead>
            <tr>
              <th>
                <div className="flex items-center gap-1">Resource <ArrowUpDown className="w-3 h-3" /></div>
              </th>
              <th>Warehouse</th>
              <th className="text-right">Available</th>
              <th className="text-right">In Transit</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-8 text-gray-400 text-sm">No records match filters</td>
              </tr>
            ) : (
              filtered.map((item) => (
                <tr key={item.id}>
                  <td>
                    <div>
                      <p className="font-medium text-gray-800">{item.resource}</p>
                    </div>
                  </td>
                  <td>
                    <span className="text-xs font-mono bg-surface-200 px-2 py-0.5 rounded text-gray-600">
                      {item.warehouse}
                    </span>
                  </td>
                  <td className="text-right">
                    <span className={`font-semibold ${item.critical ? 'text-india-red' : 'text-gray-800'}`}>
                      {formatNumber(item.available)}
                    </span>
                    <span className="text-xs text-gray-400 ml-1">{item.unit}</span>
                  </td>
                  <td className="text-right">
                    {item.inTransit > 0 ? (
                      <span className="text-blue-600 font-medium">
                        {formatNumber(item.inTransit)}
                        <span className="text-xs text-gray-400 ml-1">{item.unit}</span>
                      </span>
                    ) : (
                      <span className="text-gray-300">—</span>
                    )}
                  </td>
                  <td>{getCriticalBadge(item)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-gray-400 mt-3">
        Showing {filtered.length} of {inventory.length} records · Last updated: {new Date().toLocaleTimeString('en-IN')}
      </p>
    </div>
  );
}

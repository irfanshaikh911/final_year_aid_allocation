// utils/formatters.js
export const formatNumber = (n) => n?.toLocaleString('en-IN') ?? '—';

export const formatTime = (date = new Date()) =>
  date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });

export const formatDate = (date = new Date()) =>
  date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', weekday: 'short' });

export const getPriorityClass = (priority) => {
  switch (priority?.toUpperCase()) {
    case 'HIGH': return 'priority-high';
    case 'MEDIUM': return 'priority-medium';
    case 'LOW': return 'priority-low';
    default: return 'priority-low';
  }
};

export const getStatusBadgeClass = (status) => {
  switch (status?.toLowerCase()) {
    case 'critical': return 'badge-critical';
    case 'warning': return 'badge-warning';
    case 'normal': return 'badge-normal';
    case 'transit': return 'badge-transit';
    default: return 'badge-normal';
  }
};

export const cn = (...classes) => classes.filter(Boolean).join(' ');

import { CheckCircle, XCircle, Edit3, Zap, MapPin, Clock } from 'lucide-react';
import { useAppStore } from '../../store/appStore';
import { getPriorityClass } from '../../utils/formatters';

export default function RecommendationCard({ rec }) {
  const { approveRecommendation, rejectRecommendation, fetchInventory } = useAppStore();

  const handleApprove = async () => {
    try {
      await fetch('http://localhost:8000/api/accept_recommendation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recommendations: rec.items })
      });
      approveRecommendation(rec.id);
      if (fetchInventory) fetchInventory();
    } catch (e) {
      console.error(e);
      alert("Failed to accept recommendation");
    }
  };

  const statusColors = {
    pending: 'border-l-saffron',
    approved: 'border-l-india-green',
    rejected: 'border-l-gray-400',
  };

  const statusBanners = {
    approved: (
      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 border-t border-green-100 rounded-b-lg">
        <CheckCircle className="w-3.5 h-3.5 text-india-green" />
        <span className="text-xs text-india-green font-semibold">Approved & Dispatched</span>
      </div>
    ),
    rejected: (
      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 border-t border-gray-200 rounded-b-lg">
        <XCircle className="w-3.5 h-3.5 text-gray-500" />
        <span className="text-xs text-gray-500 font-semibold">Recommendation Rejected</span>
      </div>
    ),
  };

  return (
    <div className={`bg-white rounded-lg border border-surface-300 shadow-card overflow-hidden border-l-4 ${statusColors[rec.status] || 'border-l-saffron'}`}>
      {/* Header */}
      <div className="px-4 pt-4 pb-3">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-saffron" />
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">AI Recommendation</span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <MapPin className="w-3.5 h-3.5 text-navy" />
              <span className="font-heading font-bold text-navy text-sm">{rec.zone}</span>
              <span className="text-xs text-gray-400">· {rec.state}</span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className={getPriorityClass(rec.priority)}>{rec.priority}</span>
            <div className="flex items-center gap-1">
              <span className="text-[10px] text-gray-500">Confidence</span>
              <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-india-green rounded-full"
                  style={{ width: `${rec.confidence}%` }}
                />
              </div>
              <span className="text-[10px] font-bold text-india-green">{rec.confidence}%</span>
            </div>
          </div>
        </div>

        {/* Resource list */}
        <div className="bg-surface-100 rounded-lg p-3 space-y-1.5 mb-3">
          {rec.items.map((item, i) => (
            <div key={i} className="flex items-center justify-between">
              <span className="text-xs text-gray-600">{item.resource}</span>
              <span className="text-xs font-semibold text-navy">{item.quantity}</span>
            </div>
          ))}
        </div>

        {/* ETA */}
        <div className="flex items-center gap-1.5 mb-3">
          <Clock className="w-3.5 h-3.5 text-gray-400" />
          <span className="text-xs text-gray-500">ETA:</span>
          <span className="text-xs font-semibold text-navy">{rec.eta}</span>
        </div>

        {/* Actions */}
        {rec.status === 'pending' && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleApprove}
              className="btn-success flex-1 justify-center text-xs py-1.5"
            >
              <CheckCircle className="w-3.5 h-3.5" />
              Approve
            </button>
            <button
              onClick={() => rejectRecommendation(rec.id)}
              className="btn-danger flex-1 justify-center text-xs py-1.5"
            >
              <XCircle className="w-3.5 h-3.5" />
              Reject
            </button>
            <button className="btn-outline flex-shrink-0 text-xs py-1.5 px-3">
              <Edit3 className="w-3.5 h-3.5" />
              Modify
            </button>
          </div>
        )}
      </div>

      {/* Status banner */}
      {statusBanners[rec.status]}
    </div>
  );
}

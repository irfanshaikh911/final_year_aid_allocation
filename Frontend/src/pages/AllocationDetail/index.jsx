import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Zap, MapPin, Users, Shield, CheckCircle, XCircle, ChevronLeft, Package, Clock } from 'lucide-react';
import { humanClusters } from '../../components/map/puneData';
import { useAppStore } from '../../store/appStore';

export default function AllocationDetail() {
  const { clusterId } = useParams();
  const navigate = useNavigate();
  const { fetchInventory, addRecommendation, markClusterDispatched } = useAppStore();
  
  const [loading, setLoading] = useState(true);
  const [recommendation, setRecommendation] = useState(null);
  
  const cluster = humanClusters.find(c => c.id === clusterId) || humanClusters[0];

  useEffect(() => {
    const fetchRec = async () => {
      try {
        const res = await fetch('http://localhost:8000/api/recommend', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            zone: cluster.zone,
            lat: cluster.lat,
            lng: cluster.lng,
            humans: cluster.people,
            severity: cluster.severity,
            all_clusters: humanClusters.filter(c => c.people > 0).map(c => ({
              id: c.id, zone: c.zone, humans: c.people, severity: c.severity
            }))
          })
        });
        const data = await res.json();
        setRecommendation(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchRec();
  }, [cluster]);

  const handleApprove = async () => {
    if (!recommendation) return;
    try {
      await fetch('http://localhost:8000/api/accept_recommendation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recommendations: recommendation.recommendations })
      });
      if (fetchInventory) fetchInventory();
      markClusterDispatched(cluster.id, { 
        timestamp: Date.now(), 
        items: recommendation.recommendations,
        status: 'En Route'
      });
      navigate('/ai-engine');
    } catch (e) {
      alert("Failed to accept recommendation.");
    }
  };

  return (
    <div className="p-5 space-y-5 max-w-4xl mx-auto animate-fade-in">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-navy transition-colors text-sm font-semibold">
        <ChevronLeft className="w-4 h-4" /> Back to Queue
      </button>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold text-navy flex items-center gap-2">
            <Zap className="w-6 h-6 text-saffron" />
            AI Allocation Intelligence
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Comparative analysis and dispatch review for {cluster.zone}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Target Zone Profile */}
        <div className="md:col-span-1 content-card space-y-4">
          <div className="section-header border-b border-surface-200 pb-2">
            <MapPin className="w-4 h-4 text-navy" />
            <h2 className="section-title">Target Zone Profile</h2>
          </div>
          
          <div className="space-y-3">
            <div>
              <p className="text-xs text-gray-500 uppercase font-semibold">Location</p>
              <p className="text-base font-bold text-navy">{cluster.zone}</p>
            </div>
            
            <div className="flex items-center justify-between bg-surface-100 p-2 rounded">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-semibold text-gray-700">Stranded</span>
              </div>
              <span className="text-base font-bold text-navy">{cluster.people}</span>
            </div>
            
            <div className="flex items-center justify-between bg-surface-100 p-2 rounded">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-india-red" />
                <span className="text-sm font-semibold text-gray-700">Severity</span>
              </div>
              <span className="text-base font-bold text-india-red capitalize">{cluster.severity}</span>
            </div>
          </div>
        </div>

        {/* AI Analysis & Recommendation */}
        <div className="md:col-span-2 space-y-5">
          {loading ? (
            <div className="content-card flex flex-col items-center justify-center py-20 text-blue-600">
              <Zap className="w-8 h-8 animate-spin mb-3 text-saffron" />
              <p className="font-mono text-sm animate-pulse">Groq LLM Analyzing regional clusters and warehouse inventory...</p>
            </div>
          ) : recommendation?.error ? (
            <div className="content-card bg-red-50 text-india-red p-5 border border-red-200">
              <p className="font-bold">Error generating plan</p>
              <p className="text-sm mt-1">{recommendation.error}</p>
            </div>
          ) : recommendation && (
            <>
              {/* Comparative Analysis */}
              <div className="content-card border-l-4 border-l-saffron">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-navy text-sm uppercase tracking-wider">Regional Context Analysis</h3>
                  <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase ${recommendation.suggestion === 'APPROVE' ? 'bg-green-100 text-india-green' : 'bg-red-100 text-india-red'}`}>
                    AI Suggestion: {recommendation.suggestion}
                  </span>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed mb-4">
                  {recommendation.comparison_analysis}
                </p>
                <div className="bg-surface-100 p-3 rounded text-sm text-gray-600 border border-surface-200">
                  <span className="font-semibold block mb-1">Dispatch Reasoning:</span>
                  {recommendation.reasoning}
                </div>
              </div>

              {/* Resource Allocation */}
              <div className="content-card">
                <h3 className="font-bold text-navy text-sm uppercase tracking-wider mb-4 border-b border-surface-200 pb-2">Resource Allocation Plan</h3>
                <div className="space-y-2">
                  {recommendation.recommendations.map((rec, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-gray-50 border border-surface-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                          <Package className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-bold text-navy text-sm">{rec.resource}</p>
                          <p className="text-[10px] text-gray-500 font-mono flex items-center gap-1">
                            <MapPin className="w-3 h-3" /> {rec.warehouse}
                          </p>
                        </div>
                      </div>
                      <span className="text-base font-bold text-navy bg-white px-3 py-1 rounded border border-surface-300 shadow-sm">
                        {rec.quantity} units
                      </span>
                    </div>
                  ))}
                </div>
                
                <div className="flex items-center gap-3 mt-6">
                  <button onClick={handleApprove} className="btn-success flex-1 flex justify-center py-3 text-sm">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Approve & Dispatch Plan
                  </button>
                  <button onClick={() => navigate('/ai-engine')} className="btn-danger flex-1 flex justify-center py-3 text-sm">
                    <XCircle className="w-4 h-4 mr-2" />
                    Reject (Hold Resources)
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

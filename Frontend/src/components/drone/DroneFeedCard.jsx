import React, { useState } from 'react';
import { Users, Waves, AlertTriangle, Radio, Video, Zap, CheckCircle, Package } from 'lucide-react';
import { useAppStore } from '../../store/appStore';

const severityColor = {
  Critical: 'text-india-red',
  High: 'text-saffron',
  Moderate: 'text-amber-500',
  Low: 'text-india-green',
};

const statusConfig = {
  live: { dot: 'status-dot-live', label: 'LIVE', cls: 'text-india-green' },
  maintenance: { dot: 'status-dot-offline', label: 'MAINTENANCE', cls: 'text-gray-400' },
  offline: { dot: 'status-dot-offline', label: 'OFFLINE', cls: 'text-gray-400' },
};

// Simulated drone video feeds using colored overlays as placeholders
const feedColors = {
  1: 'from-slate-800 to-slate-900',
  2: 'from-zinc-800 to-zinc-900',
  3: 'from-neutral-800 to-neutral-900',
  4: 'from-stone-800 to-stone-900',
};

export default function DroneFeedCard({ drone }) {
  const status = statusConfig[drone.status] || statusConfig.offline;
  const isLive = drone.status === 'live';
  const fetchInventory = useAppStore(s => s.fetchInventory);

  const [loadingRec, setLoadingRec] = useState(false);
  const [recommendation, setRecommendation] = useState(null);
  const [accepted, setAccepted] = useState(false);

  const handleRequestRec = async () => {
    setLoadingRec(true);
    try {
      const res = await fetch('http://localhost:8000/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          zone: drone.zone,
          lat: drone.lat || 18.52,
          lng: drone.lng || 73.85,
          humans: drone.detections.humans || 0,
          severity: drone.detections.severity || 'Moderate'
        })
      });
      const data = await res.json();
      if (data.recommendations) {
        setRecommendation(data);
      } else {
        alert("Error fetching recommendation: " + JSON.stringify(data));
      }
    } catch (e) {
      console.error(e);
      alert("Failed to connect to backend");
    } finally {
      setLoadingRec(false);
    }
  };

  const handleAcceptRec = async () => {
    if (!recommendation) return;
    try {
      await fetch('http://localhost:8000/api/accept_recommendation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recommendations: recommendation.recommendations })
      });
      setAccepted(true);
      if (fetchInventory) fetchInventory(); // Refresh DB inventory
    } catch (e) {
      console.error(e);
      alert("Failed to accept recommendation");
    }
  };

  return (
    <div className="drone-card flex flex-col">
      {/* Feed Header */}
      <div className="flex items-center justify-between px-3 py-2 bg-gray-900/80 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <Radio className="w-3.5 h-3.5 text-blue-400" />
          <span className="text-white text-xs font-semibold">{drone.name}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className={status.dot} />
          <span className={`text-[10px] font-bold uppercase ${status.cls}`}>{status.label}</span>
        </div>
      </div>

      {/* Video Feed Area */}
      <div className={`relative w-full aspect-video bg-gradient-to-br ${feedColors[drone.id] || 'from-gray-800 to-gray-900'}`}>
        {isLive ? (
          <>
            {/* Real video for Drone-1, simulated grid for others */}
            {drone.id === 1 ? (
              <video
                className="absolute inset-0 w-full h-full object-contain"
                src="/output_web.webm"
                type="video/webm"
                autoPlay
                loop
                muted
                playsInline
              />
            ) : (
              <div className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
                  backgroundSize: '20px 20px',
                }}
              />
            )}

            {/* Corner brackets (surveillance UI) */}
            <div className="absolute top-2 left-2 w-5 h-5 border-t-2 border-l-2 border-green-400 opacity-70 z-10" />
            <div className="absolute top-2 right-2 w-5 h-5 border-t-2 border-r-2 border-green-400 opacity-70 z-10" />
            <div className="absolute bottom-2 left-2 w-5 h-5 border-b-2 border-l-2 border-green-400 opacity-70 z-10" />
            <div className="absolute bottom-2 right-2 w-5 h-5 border-b-2 border-r-2 border-green-400 opacity-70 z-10" />

            {/* Zone label */}
            <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10">
              <span className="text-[10px] text-green-400 font-mono bg-black/40 px-2 py-0.5 rounded">
                ZONE {drone.zone}
              </span>
            </div>

            {/* Center focus */}
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <div className="w-8 h-8 border border-green-400/50 rounded-full flex items-center justify-center">
                <div className="w-1 h-1 bg-green-400 rounded-full" />
              </div>
            </div>

            {/* Timestamp */}
            <div className="absolute bottom-3 right-3 z-10">
              <span className="text-[9px] font-mono text-green-400 bg-black/40 px-1.5 py-0.5 rounded">
                {new Date().toISOString().slice(11, 19)} IST
              </span>
            </div>

            {/* Recording indicator */}
            <div className="absolute top-3 right-3 flex items-center gap-1 z-10">
              <Video className="w-3 h-3 text-india-red" />
              <span className="text-[9px] text-india-red font-bold animate-pulse-slow">REC</span>
            </div>

            {/* Telemetry Overlays */}
            <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
              <div className="bg-black/40 px-1.5 py-0.5 rounded flex items-center gap-1">
                <span className="text-[9px] text-gray-300 font-mono">BAT:</span>
                <span className={`text-[9px] font-bold font-mono ${drone.battery < 30 ? 'text-india-red animate-pulse' : 'text-green-400'}`}>{drone.battery}%</span>
              </div>
              <div className="bg-black/40 px-1.5 py-0.5 rounded flex items-center gap-1">
                <span className="text-[9px] text-gray-300 font-mono">ALT:</span>
                <span className="text-[9px] text-white font-bold font-mono">{drone.altitude}</span>
              </div>
              <div className="bg-black/40 px-1.5 py-0.5 rounded flex items-center gap-1">
                <span className="text-[9px] text-gray-300 font-mono">SIG:</span>
                <span className={`text-[9px] font-bold font-mono ${drone.signal === 'Weak' ? 'text-amber-500' : 'text-green-400'}`}>{drone.signal}</span>
              </div>
              {drone.lat && drone.lng && (
                <div className="bg-black/40 px-1.5 py-0.5 rounded flex items-center gap-1">
                  <span className="text-[9px] text-gray-300 font-mono">LOC:</span>
                  <span className="text-[9px] text-white font-bold font-mono">{drone.lat.toFixed(4)}, {drone.lng.toFixed(4)}</span>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
            <Radio className="w-8 h-8 text-gray-600" />
            <span className="text-gray-500 text-xs font-medium uppercase tracking-wider">Feed Unavailable</span>
          </div>
        )}
      </div>

      {/* AI Detection Overlays */}
      <div className="px-3 py-2.5 bg-gray-900 border-t border-gray-700 flex-shrink-0">
        {isLive ? (
          <div className="grid grid-cols-2 gap-x-4 gap-y-1">
            <div className="flex items-center gap-1.5">
              <Users className="w-3 h-3 text-blue-400 flex-shrink-0" />
              <span className="text-[10px] text-gray-300">
                Humans: <span className="text-white font-semibold">{drone.detections.humans}</span>
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Waves className="w-3 h-3 text-blue-400 flex-shrink-0" />
              <span className="text-[10px] text-gray-300">
                Water: <span className="text-white font-semibold">{drone.detections.waterLevel}</span>
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <AlertTriangle className={`w-3 h-3 flex-shrink-0 ${severityColor[drone.detections.severity] || 'text-gray-400'}`} />
              <span className="text-[10px] text-gray-300">
                Risk: <span className={`font-semibold ${severityColor[drone.detections.severity] || 'text-gray-400'}`}>{drone.detections.severity}</span>
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <AlertTriangle className="w-3 h-3 text-amber-500 flex-shrink-0" />
              <span className="text-[10px] text-gray-300">
                Blocked: <span className="text-white font-semibold">{drone.detections.blockedRoads}</span>
              </span>
            </div>
          </div>
        ) : (
          <p className="text-[10px] text-gray-500 text-center">No telemetry data</p>
        )}
      </div>

    </div>
  );
}

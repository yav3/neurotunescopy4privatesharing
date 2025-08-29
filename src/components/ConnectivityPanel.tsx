import { useEffect, useState } from "react";

type HealthCheck = { 
  name: string; 
  ok: boolean; 
  status?: number; 
  error?: string;
  details?: any;
};

// Simple dot component for quick status
function Dot({ ok }: { ok: boolean }) {
  return (
    <span 
      style={{
        display: "inline-block", 
        width: 10, 
        height: 10, 
        borderRadius: 9999,
        background: ok ? "#22c55e" : "#ef4444", 
        marginLeft: 6
      }}
    />
  );
}

import { API_BASE } from '@/lib/env'

const api = {
  url: (path: string) => `${API_BASE}${path}`,
  health: () => `${API_BASE}/api/healthz`,
  healthSupabase: () => `${API_BASE}/api/readyz`,
  healthStreaming: () => `${API_BASE}/api/stream-health`,
};

export default function ConnectivityPanel() {
  const [checks, setChecks] = useState<HealthCheck[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const [quickStatus, setQuickStatus] = useState({ api: false, db: false, storage: false });

  useEffect(() => {
    runHealthChecks();
    // Re-run health checks every 5 seconds for quick feedback
    const interval = setInterval(runHealthChecks, 5000);
    return () => clearInterval(interval);
  }, []);

  const runHealthChecks = async () => {
    const healthChecks = [
      { name: "API", url: api.health() },
      { name: "Supabase", url: api.healthSupabase() },
      { name: "Streaming", url: api.healthStreaming() },
    ];

    const results: HealthCheck[] = [];
    let apiOk = false, dbOk = false, storageOk = false;

    for (const check of healthChecks) {
      try {
        const response = await fetch(check.url);
        const data = response.ok ? await response.json() : null;
        const isOk = response.ok && (!data || data.ok !== false);
        
        results.push({ 
          name: check.name, 
          ok: isOk, 
          status: response.status,
          details: data
        });

        // Track quick status for dots
        if (check.name === "API" && isOk) apiOk = true;
        if (check.name === "Supabase" && isOk) dbOk = true;
        if (check.name === "Streaming" && isOk) storageOk = true;
      } catch (error) {
        results.push({ 
          name: check.name, 
          ok: false, 
          error: error instanceof Error ? error.message : String(error)
        });
      }
    }

    setChecks(results);
    setQuickStatus({ api: apiOk, db: dbOk, storage: storageOk });
  };

  const allHealthy = checks.every(check => check.ok);
  const anyUnhealthy = checks.some(check => !check.ok);

  return (
    <>
      {/* Quick status dots - always visible at top right */}
      <div className="fixed top-4 right-4 z-50 bg-black/80 text-white px-3 py-2 rounded-lg text-xs flex items-center">
        <span>API</span><Dot ok={quickStatus.api} />
        <span className="ml-3">DB</span><Dot ok={quickStatus.db} />
        <span className="ml-3">Stream</span><Dot ok={quickStatus.storage} />
        <button 
          onClick={() => setIsVisible(!isVisible)}
          className="ml-3 text-gray-400 hover:text-white"
        >
          {isVisible ? '▼' : '▶'}
        </button>
      </div>

      {/* Status indicator dot at bottom right */}
      <div 
        className="fixed bottom-4 right-4 z-50 cursor-pointer"
        onClick={() => setIsVisible(!isVisible)}
      >
        <div className={`w-4 h-4 rounded-full border-2 border-white ${
          checks.length === 0 ? 'bg-gray-500 animate-pulse' :
          allHealthy ? 'bg-green-500' :
          anyUnhealthy ? 'bg-red-500' : 'bg-yellow-500'
        }`} />
      </div>

      {/* Detailed panel */}
      {isVisible && (
        <div className="fixed bottom-16 right-4 z-50 bg-black/90 text-white rounded-xl p-4 min-w-80 shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">System Health</h3>
            <button 
              onClick={() => setIsVisible(false)}
              className="text-gray-400 hover:text-white"
            >
              ✕
            </button>
          </div>
          
          <div className="space-y-2">
            {checks.map((check) => (
              <div key={check.name} className="flex items-center gap-2 text-sm">
                <span className={`text-lg ${
                  check.ok ? '✅' : '❌'
                }`} />
                <span className="font-medium min-w-20">{check.name}</span>
                <span className="text-gray-400">
                  {check.status && `${check.status} `}
                  {check.error ? (
                    <span className="text-red-400">{check.error}</span>
                  ) : check.ok ? (
                    <span className="text-green-400">OK</span>
                  ) : (
                    <span className="text-yellow-400">Unknown</span>
                  )}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-3 pt-3 border-t border-gray-700">
            <button 
              onClick={runHealthChecks}
              className="text-xs text-blue-400 hover:text-blue-300"
            >
              🔄 Refresh Checks
            </button>
          </div>
          
          <div className="mt-2 text-xs text-gray-500">
            Base URL: {API_BASE}
          </div>
        </div>
      )}
    </>
  );
}
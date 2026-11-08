import { useQuery } from '@tanstack/react-query';
import { fetchSystemStatus } from './api/systemApi';
import { Activity, Database, Server, RefreshCw, AlertCircle } from 'lucide-react';

export function App() {
  const { data, error, isLoading, isFetching, refetch } = useQuery({
    queryKey: ['systemStatus'],
    queryFn: fetchSystemStatus,
    refetchInterval: 10000,
  });

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-xl bg-slate-800/90 rounded-2xl shadow-2xl border border-slate-700/60 p-8 backdrop-blur-sm">
        <header className="flex items-center justify-between pb-6 border-b border-slate-700/60">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <Activity className="h-6 w-6 text-emerald-400" />
              Smart Bus Bengal
            </h1>
            <p className="text-sm text-slate-400 mt-1">Sprint 0: Walking Skeleton Status Page</p>
          </div>
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-sm font-medium rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white transition-all duration-200 cursor-pointer shadow-md"
          >
            <RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </header>

        <main className="mt-6 space-y-4">
          {isLoading && (
            <div className="py-12 text-center text-slate-400 animate-pulse">
              Connecting to backend & Neon DB...
            </div>
          )}

          {error && (
            <div className="p-4 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-200 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-rose-400 shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-semibold">Backend Unreachable</p>
                <p className="mt-1 text-xs opacity-90">{error.message}</p>
                <p className="mt-2 text-xs text-rose-300">
                  Ensure the Spring Boot backend is running on port 8080 and connected to Neon.
                </p>
              </div>
            </div>
          )}

          {data && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-700 flex items-center gap-4">
                <Server className="h-8 w-8 text-emerald-400 shrink-0" />
                <div>
                  <span className="text-xs uppercase tracking-wider text-slate-400 font-medium">Spring Boot</span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-400"></span>
                    <span className="text-base font-semibold text-white">{data.backendStatus}</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-700 flex items-center gap-4">
                <Database className="h-8 w-8 text-cyan-400 shrink-0" />
                <div>
                  <span className="text-xs uppercase tracking-wider text-slate-400 font-medium">Neon PostgreSQL 18</span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-cyan-400"></span>
                    <span className="text-base font-semibold text-white">{data.databaseStatus}</span>
                    <span className="text-xs text-cyan-300">({data.databaseLatencyMs} ms)</span>
                  </div>
                </div>
              </div>

              <div className="md:col-span-2 p-3.5 rounded-lg bg-slate-950/50 border border-slate-800 text-xs text-slate-400 space-y-1">
                <div className="flex justify-between">
                  <span>Heartbeat Service:</span>
                  <span className="font-mono text-slate-300">{data.databaseService}</span>
                </div>
                <div className="flex justify-between">
                  <span>Verified Timestamp:</span>
                  <span className="font-mono text-slate-300">{new Date(data.timestamp).toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;

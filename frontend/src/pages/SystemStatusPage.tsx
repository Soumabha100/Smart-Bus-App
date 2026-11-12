import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchSystemStatus } from '../api/systemApi';
import { Activity, Database, Server, RefreshCw, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const SystemStatusPage: React.FC = () => {
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
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900/60 border border-slate-700/40">
                <div className="flex items-center gap-3">
                  <Server className="h-5 w-5 text-blue-400" />
                  <div>
                    <div className="text-sm font-medium text-slate-200">Backend API</div>
                    <div className="text-xs text-slate-400">Timestamp: {data.timestamp}</div>
                  </div>
                </div>
                <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-800">
                  {data.backendStatus}
                </span>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900/60 border border-slate-700/40">
                <div className="flex items-center gap-3">
                  <Database className="h-5 w-5 text-indigo-400" />
                  <div>
                    <div className="text-sm font-medium text-slate-200">{data.databaseService}</div>
                    <div className="text-xs text-slate-400">Latency: {data.databaseLatencyMs}ms</div>
                  </div>
                </div>
                <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-800">
                  {data.databaseStatus}
                </span>
              </div>
            </div>
          )}
        </main>

        <footer className="mt-6 pt-6 border-t border-slate-700/60 flex items-center justify-between text-xs text-slate-400">
          <Link to="/" className="text-emerald-400 hover:underline">
            Go to Roamly Home →
          </Link>
          <span>Java 25 + Spring Boot 4.1 + React 19</span>
        </footer>
      </div>
    </div>
  );
};

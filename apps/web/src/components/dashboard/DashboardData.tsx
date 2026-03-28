'use client';
/**
 * DashboardData — fetches live metrics from the API using the Supabase session.
 *
 * States:
 *   loading    → skeleton UI
 *   not-authed → "Connect your extension" prompt
 *   error      → shows demo data with error notice
 *   live       → real data from /api/v1/metrics/summary
 */
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

const API_BASE = process.env['NEXT_PUBLIC_API_URL'] ?? 'https://api.loopguard.dev';
type DayData   = { date: string; loops: number; tokensSaved: number };
type LoopEntry = { id: string; errorHash: string; occurrences: number; timeWastedMs: number; fileType: string; status: string; detectedAt: number };

export interface SummaryData {
  thisWeek:  { loops: number; timeWastedMs: number; tokensSaved: number; costSaved: number };
  today:     { loops: number; timeWastedMs: number; tokensSaved: number; costSaved: number };
  weeklyBreakdown: DayData[];
  recentLoops: LoopEntry[];
  topErrorHashes: { hash: string; count: number }[];
}

// Demo data used when API is unavailable or user is not signed in
export const DEMO_DATA: SummaryData = {
  thisWeek: { loops: 22, timeWastedMs: 312 * 60 * 1000, tokensSaved: 35_200, costSaved: 1.06 },
  today:    { loops: 3,  timeWastedMs: 47 * 60 * 1000,  tokensSaved: 8_400, costSaved: 0.25 },
  weeklyBreakdown: [
    { date: getDay(-6), loops: 2, tokensSaved: 3200 },
    { date: getDay(-5), loops: 5, tokensSaved: 8100 },
    { date: getDay(-4), loops: 1, tokensSaved: 1400 },
    { date: getDay(-3), loops: 7, tokensSaved: 11200 },
    { date: getDay(-2), loops: 3, tokensSaved: 4800 },
    { date: getDay(-1), loops: 0, tokensSaved: 0 },
    { date: getDay(0),  loops: 4, tokensSaved: 6400 },
  ],
  recentLoops: [
    { id: '1', errorHash: 'a1b2c3d4', occurrences: 4, timeWastedMs: 32 * 60 * 1000, fileType: 'ts', status: 'resolved', detectedAt: Date.now() - 90 * 60 * 1000 },
    { id: '2', errorHash: 'e5f6g7h8', occurrences: 3, timeWastedMs: 18 * 60 * 1000, fileType: 'ts', status: 'active',   detectedAt: Date.now() - 30 * 60 * 1000 },
    { id: '3', errorHash: 'i9j0k1l2', occurrences: 5, timeWastedMs: 41 * 60 * 1000, fileType: 'py', status: 'resolved', detectedAt: Date.now() - 8  * 60 * 60 * 1000 },
    { id: '4', errorHash: 'm3n4o5p6', occurrences: 2, timeWastedMs: 14 * 60 * 1000, fileType: 'ts', status: 'ignored',  detectedAt: Date.now() - 12 * 60 * 60 * 1000 },
  ],
  topErrorHashes: [
    { hash: 'a1b2c3d4', count: 8 },
    { hash: 'e5f6g7h8', count: 6 },
    { hash: 'i9j0k1l2', count: 5 },
    { hash: 'm3n4o5p6', count: 3 },
  ],
};

function getDay(offset: number): string {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toISOString().slice(0, 10);
}

type State =
  | { status: 'loading' }
  | { status: 'not-authed' }
  | { status: 'live'; data: SummaryData }
  | { status: 'demo'; data: SummaryData; error?: string };

async function fetchSummary(token: string): Promise<SummaryData> {
  const res = await fetch(`${API_BASE}/api/v1/metrics/summary?days=7`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`API ${res.status}`);
  return res.json() as Promise<SummaryData>;
}

export function useDashboardData(): State {
  const [state, setState] = useState<State>({ status: 'loading' });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session === null) {
        setState({ status: 'not-authed' });
        return;
      }

      fetchSummary(session.access_token)
        .then((data) => setState({ status: 'live', data }))
        .catch((err: Error) => {
          console.warn('[DashboardData] API fetch failed, using demo data:', err.message);
          setState({ status: 'demo', data: DEMO_DATA, error: err.message });
        });
    });
  }, []);

  return state;
}

// Utility: format ms → "1h 23m" or "47min"
export function fmtMs(ms: number): string {
  const min = Math.round(ms / 60 / 1000);
  if (min >= 60) return `${Math.floor(min / 60)}h ${min % 60}m`;
  return `${min}min`;
}

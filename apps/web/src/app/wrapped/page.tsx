import type { Metadata } from 'next';
import WrappedClient from './WrappedClient';

const API_BASE =
  process.env['NEXT_PUBLIC_API_URL'] ?? 'https://loopguardapi-production.up.railway.app';

interface DeviceStats {
  deviceId: string;
  firstSeen: string;
  lastSynced: string;
  totalTokensSaved: number;
  totalCommands: number;
  totalSessions: number;
  costSaved: number;
  dailyBreakdown: { date: string; tokens_saved: number; commands: number }[];
}

interface Props {
  searchParams: Promise<{ device_id?: string }>;
}

async function fetchStats(deviceId: string): Promise<DeviceStats | null> {
  try {
    const res = await fetch(
      `${API_BASE}/api/v1/metrics/device-stats?device_id=${encodeURIComponent(deviceId)}`,
      { next: { revalidate: 300 } },
    );
    if (!res.ok) return null;
    return res.json() as Promise<DeviceStats>;
  } catch {
    return null;
  }
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const params = await searchParams;
  const deviceId = params.device_id;

  if (!deviceId) {
    return {
      title: 'LoopGuard Wrapped — Your AI Coding Stats',
      description: 'See how many tokens LoopGuard saved you.',
      openGraph: {
        title: 'LoopGuard Wrapped',
        description: 'See how many tokens LoopGuard saved you.',
        images: [{ url: '/og-image.png', width: 1200, height: 630 }],
      },
    };
  }

  const stats = await fetchStats(deviceId);

  const title = stats
    ? `LoopGuard saved me ${stats.totalTokensSaved.toLocaleString()} tokens ($${stats.costSaved.toFixed(2)})`
    : 'LoopGuard Wrapped — Your AI Coding Stats';

  const description = stats
    ? `${stats.totalSessions} sessions · ${stats.totalCommands.toLocaleString()} compressed commands · $${stats.costSaved.toFixed(2)} saved`
    : 'See how many tokens LoopGuard saved you.';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      url: `https://loopguard.dev/wrapped?device_id=${deviceId}`,
      images: [{ url: '/og-image.png', width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/twitter-image.png'],
    },
  };
}

export default async function WrappedPage({ searchParams }: Props) {
  const params = await searchParams;
  const deviceId = params.device_id ?? null;
  const initialStats = deviceId ? await fetchStats(deviceId) : null;

  return <WrappedClient deviceId={deviceId} initialStats={initialStats} />;
}

import type { Metadata } from 'next';
import DashboardClient from '../../components/dashboard/DashboardClient';

export const metadata: Metadata = {
  title: 'Dashboard — LoopGuard',
  description: 'Your LoopGuard session metrics — loops detected, time wasted, and tokens saved.',
};

export default function DashboardPage() {
  return <DashboardClient />;
}

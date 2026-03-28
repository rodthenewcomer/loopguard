/**
 * /auth/extension — server component wrapper
 *
 * The inner client component reads ?ide= from search params at runtime.
 * Suspense boundary required by Next.js 15 for useSearchParams() in client components.
 */
import { Suspense } from 'react';
import ExtensionAuthClient from './ExtensionAuthClient';

export const metadata = {
  title: 'Connect your IDE — LoopGuard',
};

export default function ExtensionAuthPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0B1220]" />}>
      <ExtensionAuthClient />
    </Suspense>
  );
}

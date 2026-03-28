import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms of Service — LoopGuard',
  description: 'LoopGuard terms of service.',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#0B1220]">
      <div className="border-b border-[#1F2937]">
        <div className="max-w-3xl mx-auto px-6 py-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <img src="/icon-192x192.png" alt="LoopGuard" width="28" height="28" className="rounded-lg" />
            <span className="font-bold text-white">LoopGuard</span>
          </Link>
          <Link href="/privacy" className="text-sm text-[#6B7280] hover:text-[#9CA3AF] transition-colors">
            Privacy Policy →
          </Link>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold text-white mb-2">Terms of Service</h1>
        <p className="text-[#4B5563] text-sm mb-16">Last updated: March 2026</p>

        <div className="space-y-12 text-[#9CA3AF] text-sm leading-relaxed">

          <section>
            <h2 className="text-xl font-bold text-white mb-4">1. Acceptance</h2>
            <p>
              By installing the LoopGuard VS Code extension or creating an account on loopguard.vercel.app, you agree to these terms. If you do not agree, do not install the extension or create an account. Using LoopGuard without an account is always available and these terms still apply to the extension itself.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">2. What LoopGuard is</h2>
            <p>
              LoopGuard is a developer tool that runs inside VS Code (and compatible IDEs) to detect AI-assisted coding loops and reduce the token cost of AI requests. It is provided as-is. It is a productivity aid — it does not guarantee any specific reduction in bugs, costs, or development time.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">3. Free tier</h2>
            <p>
              The free tier is available indefinitely. It includes loop detection, the TypeScript context engine (~80% token reduction), the status bar, and the session dashboard. We reserve the right to introduce rate limits on the free tier if infrastructure costs require it, with at least 30 days notice to registered users.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">4. Pro subscription</h2>
            <ul className="space-y-3">
              {[
                'Pro is billed monthly at $9 USD. Prices may change with 30 days notice.',
                'You can cancel at any time. Access continues until the end of the current billing period.',
                'No refunds are issued for partial months, except where required by applicable law.',
                'If payment fails, Pro features are suspended after a 7-day grace period.',
                'Stripe handles all payment processing. LoopGuard never stores card numbers.',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="text-[#374151] mt-0.5 flex-shrink-0">—</span>
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">5. Acceptable use</h2>
            <p className="mb-4">You may not use LoopGuard to:</p>
            <ul className="space-y-2">
              {[
                'Reverse-engineer, decompile, or extract the proprietary algorithms in the Rust binary',
                'Resell, sublicense, or redistribute the extension or its components',
                'Attempt to bypass rate limits or authentication',
                'Use the API in a way that degrades service for other users',
                'Misrepresent your usage metrics to manipulate aggregate data',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="text-[#EF4444] mt-0.5 flex-shrink-0">✗</span>
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">6. Open source components</h2>
            <p>
              Parts of LoopGuard are MIT licensed and available on{' '}
              <a href="https://github.com/rodthenewcomer/loopguard" className="text-[#6B7280] hover:text-[#9CA3AF] underline underline-offset-2">
                GitHub
              </a>. The proprietary Rust binary (loopguard-ctx) and the backend API are not open source. Using open source components of LoopGuard is subject to the MIT License terms in the repository.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">7. Availability and uptime</h2>
            <p>
              LoopGuard&rsquo;s core features — loop detection and context compression — run entirely locally and are always available regardless of internet connectivity or API status. The web dashboard and session sync require an internet connection. We target 99.5% API uptime but do not guarantee it. The extension is designed to degrade gracefully when the API is unreachable.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">8. Limitation of liability</h2>
            <p>
              LoopGuard is provided &ldquo;as is&rdquo; without warranty of any kind. To the maximum extent permitted by law, we are not liable for any indirect, incidental, or consequential damages arising from your use of LoopGuard, including but not limited to lost profits, data loss, or business interruption. Our total liability to you shall not exceed the amount you paid in the 12 months preceding the claim.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">9. Termination</h2>
            <p>
              We may suspend or terminate your account if you violate these terms. You may terminate your account at any time by emailing{' '}
              <a href="mailto:support@loopguard.dev" className="text-[#6B7280] hover:text-[#9CA3AF] underline underline-offset-2">
                support@loopguard.dev
              </a>. On termination, your data will be deleted within 30 days.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">10. Governing law</h2>
            <p>
              These terms are governed by the laws of France. Disputes will be resolved in the courts of Paris, France, unless you are a consumer in a jurisdiction with mandatory local consumer protection laws, in which case those laws apply.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">11. Contact</h2>
            <p>
              Questions about these terms:{' '}
              <a href="mailto:support@loopguard.dev" className="text-[#6B7280] hover:text-[#9CA3AF] underline underline-offset-2">
                support@loopguard.dev
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

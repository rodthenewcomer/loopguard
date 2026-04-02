import type { Metadata } from 'next';
import Link from 'next/link';
import LoopGuardLogo from '../../components/LoopGuardLogo';

export const metadata: Metadata = {
  title: 'Privacy Policy — LoopGuard',
  description: 'LoopGuard privacy policy — what we collect, what we never collect, and how your data is handled.',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#0B1220]">
      <div className="border-b border-[#1F2937]">
        <div className="max-w-3xl mx-auto px-6 py-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <LoopGuardLogo showWordmark size={28} />
          </Link>
          <Link href="/" className="text-sm text-[#6B7280] hover:text-[#9CA3AF] transition-colors">
            Home →
          </Link>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold text-white mb-2">Privacy Policy</h1>
        <p className="text-[#4B5563] text-sm mb-16">Last updated: March 2026</p>

        <div className="space-y-12 text-[#9CA3AF] text-sm leading-relaxed">

          {/* Core guarantee */}
          <div className="p-6 rounded-2xl border border-[#22C55E]/30 bg-[#22C55E]/5">
            <div className="text-[#22C55E] font-bold text-base mb-3">The core guarantee</div>
            <p className="text-[#9CA3AF]">
              <strong className="text-white">Your source code never leaves your machine.</strong> LoopGuard never reads, transmits, stores, or processes the actual content of your files on any remote server. All context compression and loop detection runs locally inside VS Code. The only data that leaves your machine is anonymized usage metrics — numbers, not code.
            </p>
          </div>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">1. What LoopGuard collects</h2>
            <p className="mb-4">When you use LoopGuard with an account, the following metrics are synced to our API:</p>
            <ul className="space-y-3">
              {[
                { item: 'Session start time and end time', detail: 'Used to calculate total active development time per day.' },
                { item: 'Number of loops detected per session', detail: 'A loop is counted as an integer — not the error message or file content.' },
                { item: 'Time wasted per loop in milliseconds', detail: 'The duration between first and last occurrence of a repeated error pattern.' },
                { item: 'Number of tokens saved per context copy', detail: 'Calculated locally from the before/after token count. No file content is sent.' },
                { item: 'File type of the file where the loop occurred', detail: 'For example: "ts", "py", "go". Never the file name or file path.' },
                { item: 'Extension version', detail: 'Used to correlate data with specific releases.' },
                { item: 'Error fingerprint (anonymized)', detail: 'A short deterministic fingerprint of the error message text. The original message is never stored in the backend.' },
              ].map(({ item, detail }) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="text-[#22C55E] mt-0.5 flex-shrink-0">—</span>
                  <div>
                    <span className="text-white font-medium">{item}.</span>{' '}
                    {detail}
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">2. What LoopGuard never collects</h2>
            <ul className="space-y-2">
              {[
                'Source code, file contents, or any part of your codebase',
                'File names or file paths',
                'The actual text of error messages (only a one-way hash)',
                'Keystrokes, clipboard contents, or browser history',
                'IP address (not logged at the API level)',
                'Third-party cookies or tracking pixels',
                'Any data from files you did not explicitly act on inside VS Code',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="text-[#EF4444] mt-0.5 flex-shrink-0">✗</span>
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">3. Authentication data</h2>
            <p>
              If you sign in, we store your email address and a Supabase-managed JWT. Your password is never stored by LoopGuard — authentication is handled entirely by Supabase Auth, which follows industry-standard practices. Your JWT is stored in VS Code SecretStorage, which maps to the OS-level secure keychain (macOS Keychain, Windows Credential Manager, or Linux libsecret).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">4. Local processing</h2>
            <p>
              All focused context selection and loop detection runs entirely on your local machine inside the VS Code extension process. The native helper (<code className="font-mono text-xs">loopguard-ctx</code>) runs as a local subprocess over stdin/stdout when available and has no network access. No code is ever sent to our servers for processing.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">5. Data storage and retention</h2>
            <p className="mb-4">
              Metrics are stored in a Supabase Postgres database with row-level security. Only you can read your own data. We retain session and loop metrics for 12 months. You can delete your account and all associated data at any time by emailing{' '}
              <a href="mailto:support@loopguard.dev" className="text-[#6B7280] hover:text-[#9CA3AF] underline underline-offset-2">
                support@loopguard.dev
              </a>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">6. Third-party services</h2>
            <ul className="space-y-3">
              {[
                { name: 'Supabase', use: 'Database, authentication, and row-level security. Hosted in the EU (Frankfurt). GDPR compliant.' },
                { name: 'Vercel', use: 'Hosts the web dashboard. No user data is stored on Vercel infrastructure.' },
                { name: 'Google OAuth', use: 'Optional sign-in method. Only your email address and Google profile name are shared with LoopGuard if you use Google sign-in.' },
              ].map(({ name, use }) => (
                <li key={name} className="flex items-start gap-3">
                  <span className="text-[#374151] mt-0.5 flex-shrink-0">—</span>
                  <div><span className="text-white font-medium">{name}:</span> {use}</div>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">7. Your rights (GDPR / CCPA)</h2>
            <p className="mb-4">You have the right to:</p>
            <ul className="space-y-2">
              {[
                'Access all data we hold about you',
                'Correct inaccurate data',
                'Delete your account and all associated data',
                'Export your data in JSON format',
                'Opt out of all data collection — simply do not create an account. The extension works fully without one.',
              ].map((r) => (
                <li key={r} className="flex items-start gap-3">
                  <span className="text-[#2563EB] mt-0.5 flex-shrink-0">→</span>
                  {r}
                </li>
              ))}
            </ul>
            <p className="mt-4">
              To exercise any of these rights, email{' '}
              <a href="mailto:support@loopguard.dev" className="text-[#6B7280] hover:text-[#9CA3AF] underline underline-offset-2">
                support@loopguard.dev
              </a>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">8. Changes to this policy</h2>
            <p>
              If we make material changes to what data we collect, we will notify signed-in users by email at least 14 days before the change takes effect. The current version is always available at loopguard.vercel.app/privacy.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">9. Contact</h2>
            <p>
              Questions or concerns:{' '}
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

import type { Metadata } from 'next';
import Link from 'next/link';
import LoopGuardLogo from '../../components/LoopGuardLogo';

export const metadata: Metadata = {
  title: 'Support — LoopGuard',
  description: 'Get help with LoopGuard — installation, troubleshooting, account issues, and bug reports.',
};

const FAQ = [
  {
    q: 'The extension installed but I see no status bar item.',
    a: 'Open any file in VS Code — LoopGuard activates on the first text document. If the status bar item still does not appear, run the command "LoopGuard: Show Dashboard" from the Command Palette (⌘⇧P / Ctrl+Shift+P).',
  },
  {
    q: 'Loop detection never fires even though I keep hitting the same error.',
    a: 'LoopGuard requires 3 occurrences of the same error hash within a session before triggering. Make sure VS Code diagnostics are working for your language (check the Problems panel). The extension reads from the VS Code diagnostics API — it does not parse terminal output.',
  },
  {
    q: 'The dashboard shows built-in mode instead of the native helper.',
    a: 'The native helper (loopguard-ctx) ships inside the platform-specific VSIX. If you installed from the Marketplace, the correct binary should be bundled. If you installed a generic VSIX manually, download the platform-specific one from the GitHub Releases page. Built-in mode still works — the native helper just gives you stronger focused reads and better MCP or shell coverage.',
  },
  {
    q: 'I get "loopguard-ctx not found" in the Output panel.',
    a: 'This is normal if you installed the generic VSIX. The Rust binary is bundled in platform-specific VSIXs (darwin-arm64, darwin-x64, win32-x64, linux-x64, linux-arm64). Download the correct one from GitHub Releases or reinstall from the VS Code Marketplace.',
  },
  {
    q: 'Sign-in opens the browser but the extension never receives the token.',
    a: 'This is usually a URI handler issue. Make sure VS Code is registered as the handler for the vscode:// scheme. On Linux, run: xdg-settings set default-url-scheme-handler vscode code.desktop. On Windows, VS Code registers automatically. On macOS, reinstalling VS Code resolves it.',
  },
  {
    q: 'How do I delete my account and all my data?',
    a: 'Email support@loopguard.dev with the subject "Delete my account" from the email address you signed up with. We will delete all your data within 72 hours and confirm by email.',
  },
  {
    q: 'Does LoopGuard send my code to any server?',
    a: 'No. Your source code never leaves your machine. All loop detection and context filtering runs locally inside VS Code. The only data sent to our servers is anonymized metrics — loop counts, session durations, and token savings. See the Privacy Policy for the full list.',
  },
  {
    q: 'I found a bug. How do I report it?',
    a: 'Open a GitHub issue at github.com/rodthenewcomer/loopguard/issues. Include your VS Code version, OS, extension version (visible in Extensions panel), and what you expected vs. what happened.',
  },
];

const CONTACT = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
      </svg>
    ),
    label: 'GitHub Issues',
    description: 'Bug reports and feature requests',
    href: 'https://github.com/rodthenewcomer/loopguard/issues',
    cta: 'Open an issue',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
      </svg>
    ),
    label: 'Email Support',
    description: 'Account issues, billing, data requests',
    href: 'mailto:support@loopguard.dev',
    cta: 'support@loopguard.dev',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
    label: 'Documentation',
    description: 'Installation, features, and guides',
    href: '/docs',
    cta: 'Read the docs',
  },
];

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-[#0B1220]">
      {/* Header */}
      <div className="border-b border-[#1F2937]">
        <div className="max-w-4xl mx-auto px-4 py-5 flex items-center justify-between sm:px-6 sm:py-6">
          <Link href="/" className="flex items-center gap-2.5">
            <LoopGuardLogo showWordmark size={28} />
          </Link>
          <Link href="/" className="text-sm text-[#6B7280] hover:text-[#9CA3AF] transition-colors">
            Home →
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-10 sm:px-6 sm:py-16">
        {/* Hero */}
        <div className="mb-16">
          <h1 className="text-3xl font-bold text-white mb-4 sm:text-4xl">Support</h1>
          <p className="text-[#6B7280] text-base max-w-xl sm:text-lg">
            Having trouble? Check the FAQ below or reach out directly — we respond within 24 hours.
          </p>
        </div>

        {/* Contact cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-20">
          {CONTACT.map((c) => (
            <a
              key={c.label}
              href={c.href}
              target={c.href.startsWith('http') ? '_blank' : undefined}
              rel={c.href.startsWith('http') ? 'noopener noreferrer' : undefined}
              className="group p-5 rounded-2xl border border-[#1F2937] hover:border-[#2563EB]/50 bg-[#111827] hover:bg-[#0F1929] transition-all"
            >
              <div className="text-[#2563EB] mb-3">{c.icon}</div>
              <div className="font-semibold text-white text-sm mb-1">{c.label}</div>
              <div className="text-[#4B5563] text-xs mb-3">{c.description}</div>
              <div className="text-[#22D3EE] text-xs font-medium group-hover:underline">{c.cta} →</div>
            </a>
          ))}
        </div>

        {/* FAQ */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-8">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {FAQ.map((item) => (
              <details
                key={item.q}
                className="group border border-[#1F2937] rounded-2xl overflow-hidden bg-[#111827]"
              >
                <summary className="flex items-center justify-between gap-4 px-6 py-5 cursor-pointer list-none hover:bg-[#0F1929] transition-colors">
                  <span className="font-medium text-white text-sm">{item.q}</span>
                  <svg
                    className="flex-shrink-0 text-[#374151] group-open:rotate-180 transition-transform"
                    width="16" height="16" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </summary>
                <div className="px-6 pb-5 text-[#6B7280] text-sm leading-relaxed border-t border-[#1F2937]">
                  <p className="pt-4">{item.a}</p>
                </div>
              </details>
            ))}
          </div>
        </div>

        {/* Still stuck */}
        <div className="mt-16 p-8 rounded-2xl border border-[#1F2937] bg-[#111827] text-center">
          <div className="text-2xl mb-3">Still stuck?</div>
          <p className="text-[#6B7280] text-sm mb-6 max-w-md mx-auto">
            If your issue is not listed above, open a GitHub issue with your VS Code version, OS, and a description of what happened.
          </p>
          <a
            href="https://github.com/rodthenewcomer/loopguard/issues/new"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#2563EB] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#1D4ED8] sm:w-auto"
          >
            Open a GitHub Issue
          </a>
        </div>

        {/* Footer links */}
        <div className="mt-12 pt-8 border-t border-[#1F2937] flex flex-wrap gap-6 text-xs text-[#374151]">
          <Link href="/docs" className="hover:text-[#6B7280] transition-colors">Documentation</Link>
          <Link href="/privacy" className="hover:text-[#6B7280] transition-colors">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-[#6B7280] transition-colors">Terms of Service</Link>
          <Link href="/changelog" className="hover:text-[#6B7280] transition-colors">Changelog</Link>
        </div>
      </div>
    </div>
  );
}

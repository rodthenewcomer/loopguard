'use client';
/**
 * Extension auth client — email+password or Google OAuth, then sends JWT to IDE.
 *
 * OAuth redirect flow:
 *  1. User clicks "Continue with Google" → Supabase redirects to Google
 *  2. Google redirects back to this page (redirectTo = current URL)
 *  3. onAuthStateChange fires SIGNED_IN → sendCallbackToExtension() opens IDE
 *
 * Callback URI: {ide}://loopguard-dev.loopguard/auth?code=ONE_TIME_CODE&email=user@example.com
 */
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '../../../lib/supabase';

const IDE_NAMES: Record<string, string> = {
  vscode:   'VS Code',
  cursor:   'Cursor',
  windsurf: 'Windsurf',
};

function getIdeName(scheme: string): string {
  return IDE_NAMES[scheme] ?? scheme.charAt(0).toUpperCase() + scheme.slice(1);
}

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

export default function ExtensionAuthClient() {
  const searchParams = useSearchParams();
  const ideScheme = searchParams.get('ide') ?? 'vscode';
  const ideName = getIdeName(ideScheme);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [step, setStep] = useState<'idle' | 'signing-in' | 'authing' | 'done' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const sendCallbackToExtension = async (token: string, userEmail: string) => {
    try {
      // Exchange the JWT for a short-lived one-time code.
      // The code (not the JWT) is what travels through the IDE URI callback,
      // keeping the raw token out of browser history and server access logs.
      const res = await fetch('/api/auth/code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jwt: token }),
      });

      if (!res.ok) throw new Error(`code exchange failed: ${res.status}`);
      const { code } = (await res.json()) as { code: string };

      const callbackUrl =
        `${ideScheme}://loopguard-dev.loopguard/auth` +
        `?code=${encodeURIComponent(code)}&email=${encodeURIComponent(userEmail)}`;
      window.location.href = callbackUrl;
    } catch (err) {
      console.error('[ExtensionAuth] sendCallback failed:', err);
      setErrorMsg('Failed to connect to IDE. Please try again.');
      setStep('error');
    }
  };

  // Handles OAuth redirect-back: Supabase sets the session from the URL hash,
  // then fires SIGNED_IN — we catch it here and send the token to the IDE.
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        setStep('authing');
        void sendCallbackToExtension(session.access_token, session.user.email ?? '').then(
          () => setTimeout(() => setStep('done'), 1500),
        );
      }
    });
    return () => subscription.unsubscribe();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ideScheme]);

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setStep('signing-in');
    setErrorMsg('');

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error || data.session === null) {
      setErrorMsg(error?.message ?? 'Sign-in failed.');
      setStep('error');
    }
    // onAuthStateChange will handle the rest
  };

  const handleGoogle = async () => {
    setStep('signing-in');
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      // Redirect back to this same page so onAuthStateChange fires here
      options: { redirectTo: window.location.href },
    });
    // Browser navigates away — no further code runs
  };

  return (
    <div className="min-h-screen bg-[#0B1220] flex flex-col items-center justify-center px-6 py-16">
      {/* Logo */}
      <div className="flex items-center gap-2.5 mb-10">
        <img src="/icon-192x192.png" alt="LoopGuard" width="28" height="28" className="rounded-lg" />
        <span className="text-xl font-bold text-white">LoopGuard</span>
      </div>

      {/* IDE badge */}
      {ideScheme !== 'vscode' && (
        <div className="mb-6 flex items-center gap-2 px-3 py-1.5 bg-[#22D3EE]/10 border border-[#22D3EE]/20 rounded-full">
          <div className="w-1.5 h-1.5 rounded-full bg-[#22D3EE]" />
          <span className="text-xs text-[#22D3EE] font-medium">Connecting to {ideName}</span>
        </div>
      )}

      {/* Card */}
      <div
        className="w-full max-w-md rounded-2xl border border-[#1F2937] p-8"
        style={{ background: 'linear-gradient(145deg, #111827, #0f172a)' }}
      >
        {(step === 'idle' || step === 'signing-in' || step === 'error') && (
          <>
            <div className="text-center mb-6">
              <div className="w-14 h-14 rounded-2xl bg-[#2563EB]/10 border border-[#2563EB]/20 flex items-center justify-center mx-auto mb-4">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-white mb-1">Connect {ideName}</h1>
              <p className="text-[#6B7280] text-sm">Sign in to sync your session metrics.</p>
            </div>

            <div className="space-y-4">
              <button
                type="button"
                onClick={handleGoogle}
                disabled={step === 'signing-in'}
                className="w-full py-2.5 border border-[#374151] hover:border-[#4B5563] rounded-xl text-sm text-[#D1D5DB] hover:text-white flex items-center justify-center gap-2.5 transition-colors disabled:opacity-50"
              >
                <GoogleIcon />
                Continue with Google
              </button>

              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-[#1F2937]" />
                <span className="text-xs text-[#4B5563]">or</span>
                <div className="flex-1 h-px bg-[#1F2937]" />
              </div>

              <form onSubmit={handleEmailSignIn} className="space-y-3">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  className="w-full px-3.5 py-2.5 bg-[#0B1220] border border-[#374151] hover:border-[#4B5563] focus:border-[#2563EB] focus:outline-none rounded-xl text-white text-sm placeholder-[#4B5563] transition-colors"
                />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full px-3.5 py-2.5 bg-[#0B1220] border border-[#374151] hover:border-[#4B5563] focus:border-[#2563EB] focus:outline-none rounded-xl text-white text-sm placeholder-[#4B5563] transition-colors"
                />

                {step === 'error' && (
                  <p className="text-xs text-[#EF4444]">{errorMsg}</p>
                )}

                <button
                  type="submit"
                  disabled={step === 'signing-in'}
                  className="w-full py-3 bg-[#2563EB] hover:bg-[#1d4ed8] disabled:opacity-50 text-white font-bold rounded-xl text-sm transition-colors"
                >
                  {step === 'signing-in' ? 'Signing in…' : `Connect ${ideName}`}
                </button>
              </form>

              <p className="text-center text-xs text-[#4B5563]">
                No account?{' '}
                <Link href="/signup" className="text-[#2563EB] hover:text-[#3B82F6] transition-colors">
                  Sign up free →
                </Link>
              </p>
            </div>
          </>
        )}

        {step === 'authing' && (
          <div className="text-center">
            <div className="w-14 h-14 rounded-full border-2 border-[#2563EB] border-t-transparent animate-spin mx-auto mb-5" />
            <h2 className="text-xl font-bold text-white mb-2">Connecting…</h2>
            <p className="text-[#6B7280] text-sm">Opening {ideName} with your auth token.</p>
          </div>
        )}

        {step === 'done' && (
          <div className="text-center">
            <div className="w-14 h-14 rounded-2xl bg-[#22C55E]/10 border border-[#22C55E]/20 flex items-center justify-center mx-auto mb-5">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-white mb-2">You&rsquo;re connected</h2>
            <p className="text-[#6B7280] text-sm leading-relaxed mb-6">
              Switch back to {ideName}. LoopGuard is now syncing your session metrics.
            </p>
            <Link
              href="/dashboard"
              className="block w-full py-2.5 border border-[#374151] hover:border-[#4B5563] text-[#9CA3AF] hover:text-white font-medium rounded-xl text-sm transition-colors text-center"
            >
              View dashboard →
            </Link>
          </div>
        )}
      </div>

      <p className="mt-6 text-xs text-[#4B5563]">
        Using Claude Code in terminal?{' '}
        <Link href="/setup#claude-code" className="hover:text-[#6B7280] transition-colors underline underline-offset-2">
          Standalone setup →
        </Link>
      </p>
      <p className="mt-2 text-xs text-[#4B5563]">
        Your code never leaves your machine ·{' '}
        <Link href="/docs" className="hover:text-[#6B7280] transition-colors underline underline-offset-2">
          Privacy docs
        </Link>
      </p>
    </div>
  );
}

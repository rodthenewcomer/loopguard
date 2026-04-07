import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
  weight: ['400', '500', '600'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://loopguard.dev'),
  title: 'LoopGuard — Save Time In AI Coding. Cut Prompt Spend By 70%+.',
  description:
    'LoopGuard catches repeat-fix loops and trims prompts before they hit the model, helping AI-heavy coding sessions save time, tokens, and API spend.',
  keywords: [
    'AI coding',
    'VS Code extension',
    'Cursor',
    'token optimization',
    'loop detection',
    'developer productivity',
    'AI context',
  ],
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-48x48.png', sizes: '48x48', type: 'image/png' },
      { url: '/favicon.ico',       sizes: 'any' },
    ],
    apple:   [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
    other:   [{ rel: 'mask-icon', url: '/favicon-32x32.png' }],
  },
  manifest: '/site.webmanifest',
  openGraph: {
    title: 'LoopGuard — Stop AI Loops',
    description: 'Save time in AI coding sessions and cut prompt spend by 70%+ with focused local reads.',
    type: 'website',
    url: 'https://loopguard.dev',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'LoopGuard' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LoopGuard — Stop AI Loops',
    description: 'Save time in AI coding sessions and cut prompt spend by 70%+ with focused local reads.',
    images: ['/twitter-image.png'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans antialiased bg-[#0B1220] text-[#F9FAFB]">
        {children}
      </body>
    </html>
  );
}

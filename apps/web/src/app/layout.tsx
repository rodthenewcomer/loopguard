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
  title: 'LoopGuard — Stop AI Loops. Cut Token Spend by 93%.',
  description:
    'LoopGuard detects when you\'re stuck in an AI coding loop and breaks the cycle before you waste another hour. Cuts token spend by 93% with a Rust-powered context engine. Free for VS Code and Cursor.',
  keywords: [
    'AI coding',
    'VS Code extension',
    'Cursor',
    'token optimization',
    'loop detection',
    'developer productivity',
    'AI context',
  ],
  openGraph: {
    title: 'LoopGuard — Stop AI Loops',
    description: 'Detect AI coding loops in real time. Cut your token bill by 93%.',
    type: 'website',
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

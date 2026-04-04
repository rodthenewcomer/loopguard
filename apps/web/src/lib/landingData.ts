import { SUPPORT_URL } from './constants';

export const SURFACES = [
  {
    badge: 'Loop Detection',
    title: 'Catch the repeat before it eats the hour',
    copy: 'LoopGuard watches diagnostics and repeated edits locally. When the same problem keeps resurfacing, it steps in before another half hour disappears into the same bad fix.',
    accent: '#F59E0B',
  },
  {
    badge: 'Context Engine',
    title: 'Shrink the prompt before it hits the bill',
    copy: 'Instead of pasting a whole file, LoopGuard lifts the error window, the nearby definitions, and the parts that changed. Smaller prompts mean fewer wasted tokens and less money burned on noise.',
    accent: '#22D3EE',
  },
  {
    badge: 'Visibility',
    title: 'See the waste in plain numbers',
    copy: 'The extension and dashboard make the cost visible: time lost, tokens trimmed, and estimated API spend avoided across real coding sessions.',
    accent: '#22C55E',
  },
];

export const METRICS = [
  { value: '$77/mo', label: 'Estimated API spend avoided for heavy AI coding use\u00b9', tone: '#22C55E' },
  { value: '47min', label: 'Average time recovered per day from avoided retry spirals\u00b2', tone: '#F59E0B' },
  { value: '70%+', label: 'Smaller focused prompts in normal use, with some reads going much higher', tone: '#22D3EE' },
  { value: '8.4k', label: 'Tokens saved in one measured focused-read example', tone: '#A78BFA' },
];

export const TIMELINE = [
  { time: '14:03', title: 'First repeat', body: 'The same undefined error shows up again after another AI patch.', state: 'quiet' },
  { time: '14:11', title: 'Pattern confirmed', body: 'LoopGuard now sees the same problem resurfacing and tracks the lost time.', state: 'warning' },
  { time: '14:27', title: 'Circuit breaker', body: 'You get a clear alert before the next retry buries the root cause even deeper.', state: 'danger' },
];

export const CONTEXT_LINES = [
  { kind: 'dim', text: "import { fetchInvoices } from './billing';" },
  { kind: 'dim', text: "import { formatCurrency } from './format';" },
  { kind: 'focus', text: 'const rows = invoices.map((invoice) => formatCurrency(invoice.total));' },
  { kind: 'focus', text: '               ^ TypeError: cannot read properties of undefined' },
  { kind: 'dim', text: 'function Summary({ invoices }: Props) {' },
  { kind: 'dim', text: '  return <InvoiceTable rows={rows} />;' },
];

// Editors where the extension installs
export const EDITORS = ['VS Code', 'Cursor', 'Windsurf'];

export const FOOTER_COLS = [
  {
    heading: 'Product',
    links: [
      { label: 'Features', href: '/#features' },
      { label: 'How it works', href: '/#how-it-works' },
      { label: 'Roadmap', href: '/roadmap' },
      { label: 'Dashboard', href: '/dashboard' },
    ],
  },
  {
    heading: 'Docs',
    links: [
      { label: 'Getting started', href: '/docs' },
      { label: 'Setup guide', href: '/setup' },
      { label: 'Privacy', href: '/privacy' },
    ],
  },
  {
    heading: 'Project',
    links: [
      { label: 'GitHub', href: 'https://github.com/rodthenewcomer/loopguard' },
      { label: 'Support', href: SUPPORT_URL },
      { label: 'Contact', href: 'mailto:support@loopguard.dev' },
    ],
  },
];

export const JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'LoopGuard',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Windows, macOS, Linux',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  description:
    'VS Code extension that detects AI retry loops and optimizes prompt context to save time and token spend.',
  url: 'https://loopguard.dev',
};

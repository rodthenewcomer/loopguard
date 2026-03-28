# LoopGuard Design System

> Token-based design system for the extension UI, web dashboard, and landing page.
> Dark mode first. Modern. 2026.

---

## Design Philosophy

**Three principles drive every decision:**

1. **Signal over noise** — Only show what the user needs to act on. Remove everything else.
2. **Emotion first** — The interface should make the user *feel* the time they're wasting. Numbers alone aren't enough.
3. **Zero friction** — Developers are in flow. Every interaction should take < 1 second to understand.

---

## Color Tokens

### Base Palette

```
Background   #0B1220    ████  Deep navy — primary surface
Surface      #111827    ████  Cards, panels, sidebar
Surface+     #1F2937    ████  Elevated cards, hover states
Border       #374151    ████  Subtle dividers
Border+      #4B5563    ████  Active/focus borders
```

### Brand Colors

```
Primary      #2563EB    ████  CTAs, links, active states
Primary+     #3B82F6    ████  Primary hover
Primary−     #1D4ED8    ████  Primary pressed

Accent       #22D3EE    ████  Highlights, stats, neon accents
Accent+      #67E8F9    ████  Accent hover
```

### Semantic Colors

```
Success      #10B981    ████  Loop resolved, no issues
Warning      #F59E0B    ████  Loop detected, attention needed
Danger       #EF4444    ████  Critical loop, action required
Info         #6366F1    ████  Neutral information
```

### Text

```
Text/Primary    #E5E7EB    High-contrast body text
Text/Secondary  #9CA3AF    Supporting text, metadata
Text/Muted      #6B7280    Disabled, placeholder text
Text/Inverse    #0B1220    Text on light backgrounds
```

### CSS Custom Properties

```css
:root {
  /* Base */
  --color-bg:          #0B1220;
  --color-surface:     #111827;
  --color-surface-2:   #1F2937;
  --color-border:      #374151;
  --color-border-2:    #4B5563;

  /* Brand */
  --color-primary:     #2563EB;
  --color-primary-h:   #3B82F6;
  --color-primary-p:   #1D4ED8;
  --color-accent:      #22D3EE;
  --color-accent-h:    #67E8F9;

  /* Semantic */
  --color-success:     #10B981;
  --color-warning:     #F59E0B;
  --color-danger:      #EF4444;
  --color-info:        #6366F1;

  /* Text */
  --color-text:        #E5E7EB;
  --color-text-2:      #9CA3AF;
  --color-text-3:      #6B7280;
}
```

---

## Typography

### Type Scale

| Token | Font | Size | Weight | Line Height | Use |
|-------|------|------|--------|-------------|-----|
| `display` | Inter | 48px | 800 | 1.1 | Hero headline |
| `h1` | Inter | 36px | 700 | 1.2 | Page title |
| `h2` | Inter | 28px | 700 | 1.25 | Section heading |
| `h3` | Inter | 22px | 600 | 1.3 | Card title |
| `h4` | Inter | 18px | 600 | 1.35 | Sub-section |
| `body-lg` | Inter | 16px | 400 | 1.6 | Primary body text |
| `body` | Inter | 14px | 400 | 1.5 | Default body |
| `body-sm` | Inter | 13px | 400 | 1.5 | Secondary text |
| `label` | Inter | 12px | 500 | 1.4 | Labels, tags |
| `caption` | Inter | 11px | 400 | 1.4 | Captions, metadata |
| `code` | JetBrains Mono | 13px | 400 | 1.6 | Code, terminal |
| `code-sm` | JetBrains Mono | 11px | 400 | 1.5 | Inline code |

### Font Stack

```css
--font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
--font-mono: 'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace;
```

### Letter Spacing

```css
--tracking-tight:  -0.025em;   /* Display headlines */
--tracking-normal:  0em;       /* Body text */
--tracking-wide:    0.025em;   /* Labels, ALL CAPS text */
--tracking-wider:   0.05em;    /* Tags, badges */
```

---

## Spacing System

Based on a 4px grid. All spacing values are multiples of 4.

```
space-1   4px    Minimal — icon padding, tight inline elements
space-2   8px    Tight — compact UI elements
space-3   12px   Small — intra-group spacing
space-4   16px   Base — default padding, list item gaps
space-5   20px   Medium — section intra-spacing
space-6   24px   Large — card padding, section gaps
space-8   32px   XL — major section separation
space-10  40px   2XL — component-level separation
space-12  48px   3XL — page-level sections
space-16  64px   4XL — hero spacing
space-20  80px   5XL — landing page sections
space-24  96px   6XL — maximum section padding
```

```css
:root {
  --space-1:  0.25rem;   /*  4px */
  --space-2:  0.5rem;    /*  8px */
  --space-3:  0.75rem;   /* 12px */
  --space-4:  1rem;      /* 16px */
  --space-5:  1.25rem;   /* 20px */
  --space-6:  1.5rem;    /* 24px */
  --space-8:  2rem;      /* 32px */
  --space-10: 2.5rem;    /* 40px */
  --space-12: 3rem;      /* 48px */
  --space-16: 4rem;      /* 64px */
  --space-20: 5rem;      /* 80px */
  --space-24: 6rem;      /* 96px */
}
```

---

## Border Radius

```
radius-sm   4px    Chips, tags, small badges
radius-md   8px    Buttons, inputs, small cards
radius-lg   12px   Cards, panels, modal sections
radius-xl   16px   Large cards, feature blocks
radius-2xl  24px   Hero cards, feature highlights
radius-full 9999px Pills, avatars, circular elements
```

---

## Elevation & Shadows

```css
/* Subtle depth for cards on dark background */
--shadow-sm:  0 1px 3px rgba(0, 0, 0, 0.4),
              0 1px 2px rgba(0, 0, 0, 0.3);

/* Cards, popovers */
--shadow-md:  0 4px 12px rgba(0, 0, 0, 0.5),
              0 2px 4px rgba(0, 0, 0, 0.4);

/* Modals, dropdowns */
--shadow-lg:  0 16px 48px rgba(0, 0, 0, 0.6),
              0 4px 12px rgba(0, 0, 0, 0.4);

/* Alert panels, overlays */
--shadow-xl:  0 24px 64px rgba(0, 0, 0, 0.7),
              0 8px 24px rgba(0, 0, 0, 0.5);

/* Glow effects — brand accent */
--glow-primary: 0 0 20px rgba(37, 99, 235, 0.4);
--glow-accent:  0 0 20px rgba(34, 211, 238, 0.3);
--glow-warning: 0 0 16px rgba(245, 158, 11, 0.4);
--glow-danger:  0 0 16px rgba(239, 68, 68, 0.4);
```

---

## Motion & Animation

### Duration Tokens

```css
--duration-instant:  50ms;    /* Immediate feedback (clicks) */
--duration-fast:    100ms;    /* Micro-interactions */
--duration-normal:  200ms;    /* Default transitions */
--duration-slow:    350ms;    /* Page transitions, modals */
--duration-slower:  500ms;    /* Dramatic reveals */
```

### Easing Tokens

```css
--ease-default:   cubic-bezier(0.4, 0, 0.2, 1);    /* Material standard */
--ease-in:        cubic-bezier(0.4, 0, 1, 1);       /* Exit animations */
--ease-out:       cubic-bezier(0, 0, 0.2, 1);       /* Enter animations */
--ease-spring:    cubic-bezier(0.34, 1.56, 0.64, 1); /* Bouncy, playful */
--ease-smooth:    cubic-bezier(0.25, 0.46, 0.45, 0.94); /* Silky transitions */
```

### Animation Principles

- **Enter animations**: fade-in + translate-up (8px), 200ms ease-out
- **Exit animations**: fade-out, 150ms ease-in (faster than enter)
- **Alerts**: slide-in from right, 300ms spring — must feel urgent
- **Status bar updates**: crossfade, 100ms — never jarring
- **Numbers counting up**: 600ms ease-out — makes savings feel earned
- **No animation when `prefers-reduced-motion: reduce`** — always respect this

---

## Components

### Alert Panel

The core UI element. Must feel **urgent but not annoying**.

```
┌─────────────────────────────────────────────┐
│  ⚠  You're stuck in a loop                  │
│                                              │
│  Same error repeated 4×  ·  38 min wasted   │
│                                              │
│  [ Try New Approach ]  [ Details ]  [ ✕ ]   │
└─────────────────────────────────────────────┘

Background:  #111827 with --shadow-xl and --glow-warning
Border:      1px solid #F59E0B (warning, 40% opacity)
Icon:        ⚠ in #F59E0B
Title:       h4 weight 600, #E5E7EB
Subtext:     body-sm, #9CA3AF — "4×" in #F59E0B, "38 min" in #EF4444
CTA button:  Primary button (see below)
Dismiss:     Ghost icon button
```

### Status Bar Item

```
When clean:   ✓ LoopGuard          — #9CA3AF text, no background
When warning: ⚠ 2 loops · 38min   — #F59E0B text, #1F1800 bg
When paused:  ○ LoopGuard          — #6B7280 text (muted)
```

### Buttons

```css
/* Primary */
.btn-primary {
  background: var(--color-primary);
  color: #fff;
  border-radius: var(--radius-md);
  padding: var(--space-2) var(--space-4);
  font: 500 14px var(--font-sans);
  transition: background var(--duration-fast) var(--ease-default),
              box-shadow var(--duration-fast) var(--ease-default);
}
.btn-primary:hover {
  background: var(--color-primary-h);
  box-shadow: var(--glow-primary);
}

/* Secondary */
.btn-secondary {
  background: transparent;
  color: var(--color-text);
  border: 1px solid var(--color-border-2);
  /* same padding and font as primary */
}

/* Ghost */
.btn-ghost {
  background: transparent;
  color: var(--color-text-2);
  /* no border */
}
```

### Stat Cards

Used in session dashboard and web app.

```
┌────────────────────────┐
│  Time Wasted Today     │
│                        │
│  1h 23min              │  ← h2, accent color #22D3EE
│                        │
│  ↑ 12% from yesterday  │  ← caption, muted text
└────────────────────────┘

Background: var(--color-surface)
Border:     1px solid var(--color-border)
Padding:    var(--space-6)
Radius:     var(--radius-xl)
Shadow:     var(--shadow-md)
```

### Code Blocks

```
Background: #0D1117 (slightly darker than surface)
Font:       JetBrains Mono 13px
Color:      #E5E7EB base
Border:     1px solid var(--color-border)
Radius:     var(--radius-lg)

Syntax highlighting:
  Keywords:    #22D3EE  (accent)
  Strings:     #86EFAC  (soft green)
  Numbers:     #F9A8D4  (soft pink)
  Comments:    #6B7280  (muted)
  Functions:   #93C5FD  (soft blue)
  Variables:   #E5E7EB  (base text)
```

---

## Iconography

Use **VS Code Codicons** inside the extension. Use **Lucide React** on the web.

### Key icons used by LoopGuard

| Concept | Codicon | Lucide |
|---------|---------|--------|
| Loop detected | `$(warning)` | `AlertTriangle` |
| No loops | `$(check)` | `CheckCircle` |
| Time | `$(watch)` | `Clock` |
| Detection paused | `$(circle-slash)` | `PauseCircle` |
| Token savings | `$(zap)` | `Zap` |
| Context | `$(symbol-file)` | `FileCode` |
| Reset | `$(refresh)` | `RotateCcw` |
| Dashboard | `$(graph)` | `BarChart2` |

---

## Landing Page Layout

### Section Structure

```
[1] HERO
    Max-width: 1200px
    Headline: display — "Stop losing hours to AI loops."
    Sub: body-lg, text-secondary
    CTA: Primary button — "Install Free"
    Trust signal: "Your code never leaves your machine."

[2] PAIN SECTION
    Background: var(--color-surface)
    3-column layout — 3 relatable pain points
    Each: icon + 1-line description + supporting stat

[3] HOW IT WORKS
    Background: var(--color-bg)
    3-step flow with numbered callouts
    Code example or terminal screenshot

[4] FEATURES GRID
    2×2 or 2×3 grid of feature cards
    Each card: icon, title, 2-line description

[5] STATS / PROOF
    Background: gradient — #0B1220 → #111827
    3 large numbers with animations
    "Users save avg. 47min/week" etc.

[6] PRICING
    Background: var(--color-bg)
    2-column: Free vs Pro
    Free: forever, no credit card
    Pro: $9/mo, annual discount option

[7] CTA FOOTER
    Background: var(--color-primary) gradient
    Single headline + single button
```

---

## VS Code Extension Dashboard Webview

The `DashboardPanel` is a singleton `WebviewPanel` with full HTML/CSS generated inline. It updates live on every loop detection and copy-context action.

### Layout Structure

```
┌─────────────────────────────────────────────────────────────┐
│  LoopGuard — Session Dashboard                   [Upgrade ▲]│
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │ Loops    │  │Time      │  │Tokens    │  │Active    │  │
│  │ Today    │  │Wasted    │  │Saved     │  │Loops     │  │
│  │   3      │  │  47min   │  │ 8,400    │  │    2     │  │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘  │
│                                                             │
│  Token Reduction ████████████░░░░░  93%                    │
│                                                             │
│  Active Loops                                              │
│  ┌───────────────────────────────────────────────────────┐ │
│  │  a1b2c3d4  ·  4×  ·  32min  ·  ts  ·  active         │ │
│  │  e5f6g7h8  ·  3×  ·  18min  ·  ts  ·  resolved       │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                             │
│  Tips                           Pro Upgrade CTA            │
└─────────────────────────────────────────────────────────────┘
```

### Webview Color Scheme

The webview uses LoopGuard design tokens with VS Code CSS variable fallbacks:

```css
body {
  background: var(--vscode-editor-background, #0B1220);
  color: var(--vscode-editor-foreground, #E5E7EB);
  font-family: var(--vscode-font-family, 'Inter', sans-serif);
}
```

Stat values use `--color-accent` (#22D3EE). Warning states use `--color-warning` (#F59E0B). Active loops use `--color-danger` (#EF4444).

### Auth Pages

The `/auth/extension` web page (Supabase callback receiver) uses the standard design system:

```
Background:     #0B1220
Card:           linear-gradient(145deg, #111827, #0f172a)
Card border:    #1F2937
Icon container: 56×56, rounded-2xl, brand-tinted bg + border
CTA button:     full-width, #2563EB, rounded-xl
```

States: idle (sign-in form) → authing (spinner) → done (checkmark, link to dashboard) → error (retry button).

---

## VS Code Extension Webview Theme

The extension's dashboard webview should match VS Code's native theming while preserving LoopGuard's visual identity.

```css
/* Use VS Code CSS variables as fallbacks */
body {
  background: var(--vscode-editor-background, var(--color-bg));
  color: var(--vscode-editor-foreground, var(--color-text));
  font-family: var(--vscode-font-family, var(--font-sans));
  font-size: var(--vscode-font-size, 13px);
}

/* LoopGuard brand accent on top */
.loopguard-stat-value {
  color: var(--color-accent);
  font-family: var(--font-mono);
}

.loopguard-warning {
  color: var(--color-warning);
}

.loopguard-danger {
  color: var(--color-danger);
}
```

---

## Accessibility

- **Contrast ratios**: All text meets WCAG AA (4.5:1 for body, 3:1 for large text)
- **Focus rings**: 2px solid `var(--color-primary)` with 2px offset — always visible
- **Motion**: All animations respect `prefers-reduced-motion`
- **Screen readers**: All icons have `aria-label` or are `aria-hidden` with adjacent text
- **Alert timing**: Notifications auto-dismiss after 10 seconds — never permanent blocks

---

## Do / Don't

| ✅ Do | ❌ Don't |
|-------|---------|
| Use accent cyan for stats and key numbers | Use green for "good" — too close to success states |
| Show time wasted in red when > 30min | Use overly bright colors — this is a focus tool |
| Use `#EF4444` only for genuinely critical states | Mix font families within a single component |
| Keep notifications to one or two lines max | Use full-saturation colors for backgrounds |
| Animate numbers counting up to feel earned | Add animations that last > 600ms |
| Use Codicons inside extension UI | Use custom SVGs for simple iconography |

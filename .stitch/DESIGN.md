# Design System: Delivery AI Dashboard
**Project ID:** TBD

## 1. Visual Theme & Atmosphere
A premium, dark-mode logistics intelligence platform with a futuristic, data-dense aesthetic. The atmosphere is sophisticated and command-center-like, evoking the feel of a SpaceX mission control or Bloomberg terminal. Deep slate backgrounds provide a canvas for vibrant gradient accents in electric blue-to-cyan. Glassmorphism elements float above the dark canvas, creating depth through translucent overlays and subtle backdrop blurs. The overall vibe is: **"AI-powered mission control for last-mile delivery."**

## 2. Color Palette & Roles

- **Obsidian Canvas** (#0f172a) — Primary background, the deepest layer of the interface
- **Midnight Slate** (#1e293b) — Card backgrounds and elevated surfaces
- **Frosted Glass** (rgba(255,255,255,0.06)) — Glassmorphic overlays for cards and panels
- **Electric Azure** (#3b82f6) — Primary actions, interactive elements, progress indicators
- **Neon Cyan** (#06b6d4) — Secondary accents, gradient endpoints, hover states
- **Vivid Emerald** (#22c55e) — Success states, LOW risk indicators, positive metrics
- **Danger Crimson** (#ef4444) — HIGH risk alerts, critical warnings, error states
- **Caution Amber** (#eab308) — MEDIUM risk, warning states, attention-needed indicators
- **Orchid Purple** (#a855f7) — AI insights, intelligence features, special highlights
- **Ghost White** (#f1f5f9) — Primary text on dark backgrounds
- **Muted Silver** (#94a3b8) — Secondary text, labels, placeholder content
- **Glass Border** (rgba(255,255,255,0.1)) — Subtle borders on glassmorphic elements

## 3. Typography Rules
- **Font Family:** Inter (Google Fonts) — clean, geometric, highly legible at small sizes
- **Headings:** Semi-bold (600) to Bold (700), slightly tight letter-spacing (-0.02em)
- **Body Text:** Regular (400), comfortable 1.5 line-height
- **Labels & Captions:** Medium (500), uppercase, 0.05em letter-spacing, 10-12px size
- **Monospace (Data):** JetBrains Mono for numerical data, JSON inputs, and code blocks

## 4. Component Stylings
* **Buttons:** Pill-shaped with generous padding, gradient fills (Electric Azure → Neon Cyan), subtle scale-up on hover (1.02x), smooth 200ms transitions
* **Cards/Containers:** Generously rounded corners (16px), frosted glass background with backdrop-blur-xl, hair-thin glass borders, whisper-soft shadows
* **Inputs/Forms:** Semi-transparent backgrounds (white/5%), glass borders, rounded-lg (8px), cyan focus rings with glow effect
* **Charts:** Dark-themed with vibrant data colors, rounded bar tops, subtle grid lines
* **Risk Badges:** Pill-shaped, color-coded with semi-transparent backgrounds matching risk level
* **KPI Cards:** Glassmorphic with subtle hover scale animation, uppercase labels, large bold values

## 5. Layout Principles
- **Grid:** 12-column responsive grid with comfortable 24px gaps
- **Whitespace:** Generous padding (32px page margins, 20px card padding)
- **Hierarchy:** Left panel for inputs/controls (4 cols), right panel for data visualization (8 cols)
- **Depth:** Three-layer elevation system — background canvas → glass cards → floating overlays
- **Motion:** Subtle entrance animations, smooth state transitions, gentle parallax on scroll

## 6. Design System Notes for Stitch Generation
Generate all screens in DARK MODE with a deep slate gradient background (from-slate-950 via-slate-900 to-slate-800). Use glassmorphic cards with backdrop-blur, thin white/10 borders, and generously rounded corners (rounded-2xl). Apply gradient text (blue-400 to cyan-400) for brand elements. Color-code risk levels: red-400 for HIGH, yellow-400 for MEDIUM, green-400 for LOW. Use the Inter font family throughout. Charts should have dark backgrounds with vibrant colored bars. Include micro-interactions like hover scale effects. The overall aesthetic should feel like a premium AI analytics dashboard — sophisticated, data-rich, and visually striking.

/**
 * ============================================================
 *  THEME CONFIG  —  src/lib/theme.ts
 *  Change values here to update the whole app's look & feel.
 *  Import what you need in any component:
 *    import { brand, layout, text } from "@/lib/theme";
 * ============================================================
 */

// --- Brand / Accent ------------------------------------------
export const brand = {
  /** Primary orange accent — logo badge, active highlights, links */
  primary:    "#F68B1E",
  /** Golden sidebar active state */
  primaryAlt: "#E8A33D",
  /** Icon colour inside nav items */
  iconBlue:   "#476ab8",
} as const;

// --- Surfaces & Backgrounds -----------------------------------
export const surface = {
  /** App / page background */
  page:      "#f5f6fa",
  /** Card, panel, dialog */
  card:      "#ffffff",
  /** Sidebar */
  sidebar:   "#f8fafc",   // slate-50
  /** Header bar */
  header:    "#cbd5e1",   // slate-300
  /** Footer bar */
  footer:    "#ffffff",
} as const;

// --- Border colors --------------------------------------------
export const border = {
  default:  "#e2e8f0",             // slate-200
  header:   "#94a3b8",             // slate-400  (header bottom border)
  subtle:   "rgba(255,255,255,0.07)",
} as const;

// --- Text colors ----------------------------------------------
export const text = {
  primary:   "#0f172a",   // slate-900
  secondary: "#475569",   // slate-600
  muted:     "#8891A3",
  onDark:    "#E8EAF0",   // light text on dark sidebar footer
  link:      "#F68B1E",
} as const;

// --- Layout dimensions ----------------------------------------
export const layout = {
  sidebarWidth: "272px",
  headerHeight: "56px",   // h-14
} as const;

// --- Border radius --------------------------------------------
export const radius = {
  sm:   "0.375rem",   // 6px  — rounded-md
  md:   "0.5rem",     // 8px  — rounded-lg
  lg:   "0.75rem",    // 12px — rounded-xl
  full: "9999px",
} as const;

// --- Icon sizes (px numbers, pass directly to Lucide) ---------
export const icon = {
  nav:     20,   // sidebar nav icons
  toolbar: 14,   // header toolbar (bell, moon…)
  avatar:  18,   // user avatar icon
  logout:  17,
  chevron: 15,
} as const;

// --- Typography -----------------------------------------------
export const font = {
  base: "0.875rem",    // 14px — text-sm
  sm:   "0.75rem",     // 12px — text-xs
  nav:  "0.9375rem",   // 15px — sidebar app name
} as const;

// --- Shadows --------------------------------------------------
export const shadow = {
  card:   "0 1px 4px 0 rgba(0,0,0,0.08)",
  header: "0 1px 2px 0 rgba(0,0,0,0.06)",
} as const;

// --- Transitions ----------------------------------------------
export const transition = {
  fast:   "150ms ease",
  normal: "200ms ease-out",
} as const;

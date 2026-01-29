// Spacing scale
export const spacing = {
  xs: "0.25rem",    // 4px
  sm: "0.5rem",     // 8px
  md: "1rem",       // 16px
  lg: "1.5rem",     // 24px
  xl: "2rem",       // 32px
  "2xl": "3rem",    // 48px
  "3xl": "4rem",    // 64px
  "4xl": "6rem",    // 96px
} as const;

// Animation durations
export const duration = {
  fast: "150ms",
  normal: "250ms",
  slow: "350ms",
  slower: "500ms",
} as const;

// Easing functions
export const easing = {
  default: "cubic-bezier(0.25, 0.1, 0.25, 1)",
  bounce: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
  smooth: "cubic-bezier(0.4, 0, 0.2, 1)",
} as const;

// Shadow scale
export const shadows = {
  sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
  md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
  lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
  xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
  "2xl": "0 25px 50px -12px rgb(0 0 0 / 0.25)",
} as const;
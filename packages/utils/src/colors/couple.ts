const colors = {
  // ─── Primary (Pink) ────────────────────────────────────────────────────────
  primary400: '#f9d0d0', // rgb(249, 208, 208)
  primary300: '#fad8d8', // rgb(250, 216, 216)
  primary200: '#fce0df', // rgb(252, 224, 223)
  primary100: '#fde7e7', // rgb(253, 231, 231)
  primary50:  '#feefef', // rgb(254, 239, 239)

  // ─── Secondary (Teal) ──────────────────────────────────────────────────────
  secondary400: '#54d8dc', // rgb(84,  216, 220)
  secondary300: '#86dadb', // rgb(134, 218, 219)
  secondary200: '#c6ddde', // rgb(198, 221, 222)

  // ─── Base ──────────────────────────────────────────────────────────────────
  black:       '#000000',
  white:       '#ffffff',
  transparent: 'transparent',

  gray50:  '#f9fafb',
  gray100: '#f3f4f6',
  gray200: '#e5e7eb',
  gray300: '#d1d5db',
  gray400: '#9ca3af',
  gray500: '#6b7280',
  gray600: '#4b5563',
  gray700: '#374151',
  gray800: '#1f2937',
  gray900: '#111827',

  // ─── Semantic ──────────────────────────────────────────────────────────────
  error:   '#ef4444',
  success: '#22c55e',
  warning: '#f59e0b',
  info:    '#3b82f6',
} as const;

export default colors;

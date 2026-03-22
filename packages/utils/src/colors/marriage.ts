const colors = {
  // ─── Primary (Gold/Cream) ──────────────────────────────────────────────────
  primary400: '#f5d78e', // warm gold
  primary300: '#f8e3a8', // lighter gold
  primary200: '#fbedcc', // cream gold
  primary100: '#fdf4e3', // very light cream
  primary50:  '#fffbf5', // near white cream

  // ─── Secondary (Rose Gold) ─────────────────────────────────────────────────
  secondary400: '#d4a574', // rose gold
  secondary300: '#e0bc98', // light rose gold
  secondary200: '#edd4be', // very light rose gold

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

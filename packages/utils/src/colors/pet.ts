const colors = {
  // ─── Brand ─────────────────────────────────────────────────────────────────
  pink:    '#F7BFCD', // rgb(247, 191, 205)
  purple:  '#97A4D9', // rgb(151, 164, 217)
  blue:    '#A5C5DB', // rgb(165, 197, 219)
  surface: '#F1F3F5', // rgb(241, 243, 245)

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

// Colors
export const colors = {
  // Primary Brand Colors
  primary: {
    main: '#1E40AF',      // Main brand color
    light: '#3B82F6',     // Lighter variant
    dark: '#1E3A8A',      // Darker variant
    hover: '#2563EB',     // Hover state
  },

  // Secondary Brand Colors
  secondary: {
    main: '#0EA5E9',      // Secondary brand color
    light: '#38BDF8',     // Lighter variant
    dark: '#0C4A6E',      // Darker variant
    hover: '#0284C7',     // Hover state
  },

  // Background Colors
  background: {
    primary: '#FFFFFF',    // Main background
    secondary: '#F8FAFC',  // Secondary background
    alternate: '#F1F5F9',  // Alternate sections
    dark: '#0F172A',      // Dark sections
  },

  // Text Colors
  text: {
    primary: '#0F172A',    // Main text color
    secondary: '#475569',  // Secondary text
    light: '#94A3B8',     // Light text
    white: '#FFFFFF',     // White text
    link: '#2563EB',      // Link color
    linkHover: '#1D4ED8', // Link hover
  },

  // Accent Colors
  accent: {
    success: '#059669',    // Success/positive
    error: '#DC2626',      // Error/negative
    warning: '#D97706',    // Warning
    info: '#0284C7',       // Information
  },

  // UI Element Colors
  ui: {
    border: '#E2E8F0',     // Borders
    divider: '#CBD5E1',    // Dividers
    focus: '#3B82F6',      // Focus rings
    selection: '#BFDBFE',  // Selection highlight
  },
};

// Typography
export const typography = {
  // Font Families
  fontFamily: {
    primary: 'santoshi, sans-serif',
    secondary: 'final, serif',
    mono: 'monospace',
  },

  // Font Sizes
  fontSize: {
    xs: '0.75rem',      // 12px
    sm: '0.875rem',     // 14px
    base: '1rem',       // 16px
    lg: '1.125rem',     // 18px
    xl: '1.25rem',      // 20px
    '2xl': '1.5rem',    // 24px
    '3xl': '1.875rem',  // 30px
    '4xl': '2.25rem',   // 36px
    '5xl': '3rem',      // 48px
    '6xl': '3.75rem',   // 60px
    '7xl': '4.5rem',    // 72px
    '8xl': '6rem',      // 96px
  },

  // Font Weights
  fontWeight: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },

  // Line Heights
  lineHeight: {
    none: 1,
    tight: 1.25,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
  },

  // Letter Spacing
  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },
};

// Section-specific theme variations
export const sections = {
  hero: {
    background: colors.background.primary,
    heading: colors.text.primary,
    subtext: colors.text.secondary,
  },
  
  navigation: {
    background: colors.background.primary,
    text: colors.text.primary,
    hover: colors.primary.hover,
    active: colors.primary.main,
  },

  cards: {
    background: colors.background.secondary,
    border: colors.ui.border,
    title: colors.text.primary,
    description: colors.text.secondary,
    hover: colors.background.alternate,
  },

  footer: {
    background: colors.background.dark,
    text: colors.text.white,
    link: colors.text.light,
    linkHover: colors.text.white,
  },

  forms: {
    input: {
      background: colors.background.primary,
      border: colors.ui.border,
      focus: colors.ui.focus,
      text: colors.text.primary,
      placeholder: colors.text.light,
    },
    button: {
      primary: {
        background: colors.primary.main,
        hover: colors.primary.hover,
        text: colors.text.white,
      },
      secondary: {
        background: colors.secondary.main,
        hover: colors.secondary.hover,
        text: colors.text.white,
      },
    },
  },
};

// Spacing and Layout
export const spacing = {
  xs: '0.25rem',    // 4px
  sm: '0.5rem',     // 8px
  md: '1rem',       // 16px
  lg: '1.5rem',     // 24px
  xl: '2rem',       // 32px
  '2xl': '2.5rem',  // 40px
  '3xl': '3rem',    // 48px
  '4xl': '4rem',    // 64px
};

// Breakpoints
export const breakpoints = {
  xs: '320px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

// Transitions
export const transitions = {
  default: '0.3s ease',
  fast: '0.15s ease',
  slow: '0.5s ease',
};

// Z-index scale
export const zIndex = {
  negative: -1,
  base: 0,
  raised: 1,
  dropdown: 1000,
  sticky: 1100,
  overlay: 1300,
  modal: 1400,
  popover: 1500,
  tooltip: 1600,
};

// Shadows
export const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
};

// Border Radius
export const borderRadius = {
  none: '0',
  sm: '0.125rem',
  md: '0.375rem',
  lg: '0.5rem',
  xl: '0.75rem',
  '2xl': '1rem',
  full: '9999px',
};
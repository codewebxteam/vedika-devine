// Royal Black & Gold Luxury Color Palette for Vedika Divine Mobile App

export const colors = {
  background: {
    primary: "#0C0A09",   // Deep obsidian black
    secondary: "#1C1917", // Stone 900
    card: "#1C1917",      // Card dark background
    surface: "#292524",   // Stone 800
  },
  gold: {
    primary: "#D97706",   // Warm amber gold
    light: "#F59E0B",    // Bright radiant gold
    lighter: "#FDE68A",  // Soft champagne gold
    dark: "#78350F",     // Deep burnished bronze
    surface: "rgba(217, 119, 6, 0.12)",
    glow: "rgba(217, 119, 6, 0.25)",
  },
  text: {
    primary: "#FFFFFF",
    secondary: "#D6D3D1", // Stone 300
    muted: "#A8A29E",     // Stone 400
    tertiary: "#78716C",  // Stone 500
    dim: "#78716C",
  },
  status: {
    success: "#10B981",
    error: "#EF4444",
    warning: "#F59E0B",
    info: "#3B82F6",
  },
  border: {
    subtle: "#292524",
    light: "#44403C",
    gold: "rgba(217, 119, 6, 0.4)",
  },
};

export const COLORS = {
  background: colors.background.primary,
  card: colors.background.card,
  cardSecondary: "#141210",
  surface: colors.background.surface,
  gold: colors.gold.primary,
  goldLight: colors.gold.light,
  goldLighter: colors.gold.lighter,
  goldDark: colors.gold.dark,
  goldGlow: colors.gold.glow,
  textPrimary: colors.text.primary,
  textSecondary: colors.text.secondary,
  textMuted: colors.text.muted,
  textDim: colors.text.tertiary,
  success: colors.status.success,
  successBg: "#064E3B",
  error: colors.status.error,
  errorBg: "#7F1D1D",
  warning: colors.status.warning,
  border: colors.border.subtle,
  borderLight: colors.border.light,
  borderGold: colors.border.gold,
  whatsapp: "#25D366",
  whatsappDark: "#128C7E",
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  huge: 32,
};

export const SPACING = spacing;

export const borderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 999,
};

export const RADIUS = borderRadius;

export const typography = {
  h1: { fontSize: 24, fontWeight: "bold" as const },
  h2: { fontSize: 20, fontWeight: "bold" as const },
  h3: { fontSize: 16, fontWeight: "bold" as const },
  body: { fontSize: 14 },
  caption: { fontSize: 12 },
};

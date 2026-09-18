export const themes = {
  dark: {
    background: "#1E1E1E",
    surface: "#2A2A2A",
    surfaceAlt: "#3E3E3E",
    surfaceMuted: "#555555",
    cardLight: "#ABABAB",
    primary: "#69188E",
    success: "#00923A",
    danger: "#FF3B30",
    dangerMuted: "#E53935",
    text: "#F5F5F5",
    textMuted: "#CCCCCC",
    textSubtle: "#888888",
    textOnLight: "#555555",
    border: "#444444",
    overlay: "rgba(0,0,0,0.55)",
    overlaySoft: "rgba(0,0,0,0.4)",
    overlayControl: "rgba(255,255,255,0.2)",
    overlayDanger: "rgba(255,0,0,0.8)",
    white: "#FFFFFF",
    grey: "#CCCCCC",
    black: "#0A0A0A",
  },

  light: {
    background: "#F5F5F5",
    surface: "#FFFFFF",
    surfaceAlt: "#EAEAEA",
    surfaceMuted: "#D5D5D5",
    cardLight: "#FFFFFF",
    primary: "#69188E",
    success: "#00923A",
    danger: "#FF3B30",
    dangerMuted: "#E53935",
    text: "#1E1E1E",
    textMuted: "#444444",
    textSubtle: "#777777",
    textOnLight: "#555555",
    border: "#CCCCCC",
    overlay: "rgba(0,0,0,0.35)",
    overlaySoft: "rgba(0,0,0,0.2)",
    overlayControl: "rgba(0,0,0,0.1)",
    overlayDanger: "rgba(255,0,0,0.7)",
    white: "#FFFFFF",
    grey: "#eaeaea",
    black: "#0A0A0A",
  },
};

export const colors = themes.dark;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 30,
};

export const radii = {
  sm: 8,
  md: 10,
  lg: 12,
  xl: 16,
  round: 999,
};

export const createTypography = (colors) => ({
  screenTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.textMuted,
    textTransform: "uppercase",
    textAlign: "center",
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
  },

  body: {
    fontSize: 16,
  },
});

export const typography = createTypography(colors);

export const createLayout = (colors) => ({
  screenHeaderTop: 70,

  screen: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: 50,
    paddingHorizontal: spacing.xl,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: "center",
    alignItems: "center",
  },
});

export const layout = createLayout(colors);

export const colors = {
  background: "#1E1E1E",
  surface: "#2A2A2A",
  surfaceAlt: "#3E3E3E",
  surfaceMuted: "#555555",
  cardLight: "#ababab",
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
  black: "#0A0A0A",
};

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

export const typography = {
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
};

export const layout = {
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
};

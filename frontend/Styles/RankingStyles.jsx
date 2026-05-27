import { StyleSheet } from "react-native";
import { colors, layout, radii, spacing, typography } from "./theme";

const styles = StyleSheet.create({
  container: {
    ...layout.screen,
    paddingTop: 20,
  },
  content: { padding: 16, paddingTop: 50 },

  title: {
    ...typography.screenTitle,
    paddingBottom: spacing.xxl,
  },

  segmentedControl: {
    flexDirection: "row",
    backgroundColor: colors.surfaceMuted,
    borderRadius: radii.sm,
    marginBottom: spacing.lg,
  },

  segmentButton: {
    flex: 1,
    paddingVertical: spacing.md,
    alignItems: "center",
    borderRadius: radii.sm,
  },

  segmentActive: {
    backgroundColor: colors.primary,
  },

  segmentText: {
    color: colors.textMuted,
  },

  segmentTextActive: {
    color: colors.textMuted,
    fontWeight: "600",
  },

  pickerContainer: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: radii.md,
    marginBottom: spacing.lg,
  },

  picker: {
    color: colors.textMuted,
  },

  myProgressCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },

  myProgressTitle: {
    ...typography.screenTitle,
    marginBottom: spacing.md,
  },

  myProgressRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    justifyContent: "center", 
    paddingVertical: spacing.xs,
  },

  myProgressValue: {
    color: colors.primary,
    fontSize: 22,
    fontWeight: "bold",
  },

  myProgressLabel: { color: colors.textMuted },

  podiumContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-end",
    marginBottom: spacing.xl,
    gap: 80,
  },

  podiumFirst: {
    alignItems: "center",
  },

  podiumSecond: {
    alignItems: "center",
    marginHorizontal: 10,
    justifyContent: "flex-end",
  },

  podiumThird: {
    alignItems: "center",
    marginHorizontal: 10,
    justifyContent: "flex-end",
  },

  podiumPlace: {
    fontSize: 30,
    marginBottom: spacing.xs,
  },

  podiumName: {
    color: colors.textMuted,
    fontWeight: "bold",
    textTransform: "uppercase",
    fontSize: 14,
    marginBottom: 2,
  },

  podiumClasses: {
    color: colors.surfaceMuted,
    fontWeight: "bold",
  },

  rankingCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },

  rankingRow: {
    flexDirection: "row",
    paddingVertical: spacing.md,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.surfaceMuted,
  },

  position: { width: 30, color: colors.textMuted, fontWeight: "bold" },

  userName: { flex: 1, color: colors.textMuted, fontWeight: "600" },

  classes: { color: colors.textMuted },

  diffText: { color: colors.surfaceMuted, fontSize: 11 },
});

export default styles;

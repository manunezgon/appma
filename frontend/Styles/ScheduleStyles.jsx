import { StyleSheet } from "react-native";
import { colors, radii, spacing, typography } from "./theme";

const style = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  inner: {
    paddingBottom: 50,
  },
  title: {
    ...typography.screenTitle,
  },
  subtitle: {
    fontSize: 15,
    color: colors.textMuted,
    textAlign: "center",
    padding: spacing.xl,
    textTransform: "uppercase",
  },
  subtitle2: {
    fontSize: 15,
    color: colors.textMuted,
    textAlign: "center",
    padding: spacing.xs,
  },
  button: {
    flex: 1,
    padding: spacing.md,
    margin: spacing.xs,
    borderRadius: radii.sm,
    backgroundColor: colors.surfaceMuted,
  },
  buttonText: {
    fontSize: 15,
    fontWeight: "bold",
    color: colors.textMuted,
    textAlign: "center",
  },
  bottomButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 50,
    marginTop: spacing.xl,
  },
  midButtons: {
    marginTop: spacing.xl,
  },
  deleteButton: {
    padding: spacing.md,
    marginVertical: spacing.xs,
    borderRadius: radii.sm,
    backgroundColor: colors.dangerMuted,
  },
  backButton: {
    flex: 1,
    backgroundColor: colors.surfaceMuted,
    padding: spacing.md,
    borderRadius: radii.sm,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: colors.dangerMuted,
    padding: spacing.md,
    borderRadius: radii.sm,
  },
  saveButton: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  inputField: {
    backgroundColor: colors.cardLight,
    color: colors.background,
    padding: spacing.md,
    borderRadius: radii.sm,
    marginVertical: spacing.xs,
  },
  selectableItem: {
    padding: spacing.md,
    marginVertical: 3,
    borderRadius: radii.sm,
    backgroundColor: colors.surfaceAlt,
  },
  selectableItemText: {
    color: colors.text,
  },
  selectedItem: { backgroundColor: colors.primary },
  classContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  classNameContainer: { flexShrink: 1 },
  className: { fontSize: 16, fontWeight: "bold", color: colors.text },
  professorName: { fontSize: 14, color: colors.textSubtle, marginTop: 2 },
  startTimeEndTime: { fontSize: 14, color: colors.text },
  amount: { fontSize: 14, color: colors.text },
  summary: {
    backgroundColor: colors.surfaceAlt,
    padding: spacing.lg,
  },
  summaryText: { fontSize: 14, color: colors.text, marginBottom: spacing.xs },
});

export default style;

import { StyleSheet } from "react-native";
import { colors, layout, radii, spacing, typography } from "./theme";

const styles = StyleSheet.create({
  container: {
    ...layout.screen,
  },
  sectionHeaderContainer: { paddingTop: spacing.xl, paddingBottom: spacing.md },
  sectionHeader: {
    ...typography.screenTitle,
  },
  classCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderRadius: radii.md,
    backgroundColor: colors.cardLight,
  },
  className: { ...typography.cardTitle, color: colors.textOnLight },
  professorName: { ...typography.body, color: colors.textOnLight },
  date: { ...typography.body, color: colors.textOnLight },
  time: { ...typography.body, color: colors.textOnLight },
  noClasses: {
    textAlign: "center",
    marginTop: spacing.xl,
    fontSize: 16,
    color: colors.textMuted,
  },
  modalOverlay: {
    ...layout.modalOverlay,
  },
  modalContent: {
    backgroundColor: colors.cardLight,
    padding: spacing.xl,
    borderRadius: radii.md,
    width: "80%",
  },
  modalText: { fontSize: 16, marginBottom: spacing.xl, textAlign: "center" },
  modalButtons: { flexDirection: "row", justifyContent: "space-between" },
  modalButton: { padding: spacing.xs },
  loading: { textAlign: "center", marginTop: 50, color: colors.textMuted },
});

export default styles;

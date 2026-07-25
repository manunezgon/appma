import { StyleSheet } from "react-native";
import { colors, layout, radii, spacing, typography } from "./theme";

const style = StyleSheet.create({
  container: {
    ...layout.screen,
    paddingTop: layout.screenHeaderTop,
  },
  title: {
    ...typography.screenTitle,
    marginBottom: spacing.lg,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.lg,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: spacing.md,
    color: colors.text,
  },
  loadingText: {
    color: colors.textMuted,
    marginTop: spacing.md,
  },
  empty: {
    textAlign: "center",
    color: colors.textSubtle,
    marginTop: spacing.xl,
  },
  modalOverlay: {
    ...layout.modalOverlay,
  },
  modalContent: {
    backgroundColor: colors.surface,
    padding: spacing.xl,
    borderRadius: radii.md,
    width: "90%",
    alignItems: "center",
    position: "relative",
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: spacing.md,
  },
  modalSubtitle: {
    color: colors.textMuted,
    textAlign: "center",
    marginBottom: spacing.md,
  },
  pickerContainer: {
    width: "100%",
    backgroundColor: colors.surface,
    borderRadius: radii.sm,
    marginBottom: spacing.md,
  },
  picker: {
    backgroundColor: colors.background,
    color: colors.text,
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    marginBottom: spacing.md,
    width: "100%",
  },
  registerButton: {
    marginTop: spacing.lg,
    backgroundColor: colors.success,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: radii.md,
  },
  registerButtonText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "600",
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  globalSwitchContainer: {
    alignItems: "center",
    marginVertical: spacing.md,
  },

  globalSwitchLabel: {
    fontSize: 15,
    color: colors.textMuted,
  },
  paymentRow: {
    backgroundColor: colors.background,
    padding: spacing.md,
    borderRadius: radii.md,
    marginBottom: spacing.md,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  paymentInfo: {
    flex: 1,
  },
  modalityName: {
    ...typography.cardTitle,
    color: colors.text,
  },
  modalityStatus: {
    color: colors.textSubtle,
    fontSize: 12,
    marginTop: spacing.xs,
  },
  card: {
    backgroundColor: colors.surface,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radii.md,
    marginBottom: spacing.md,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  infoContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surfaceMuted,
  },
  name: {
    ...typography.cardTitle,
    color: colors.text,
  },
  noPaymentsText: {
    color: colors.textSubtle,
    marginTop: spacing.md,
  },
  paymentsList: {
    width: "100%",
    marginTop: 15,
  },
});

export default style;

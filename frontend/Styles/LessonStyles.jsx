import { StyleSheet } from "react-native";
import { colors, layout, radii, spacing, typography } from "./theme";

const styles = StyleSheet.create({
  container: {
    ...layout.screen,
    paddingTop: layout.screenHeaderTop,
    paddingHorizontal: 0,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    alignItems: "center",
  },

  errorModal: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
  },
  title: { color: colors.text, fontWeight: "bold", fontSize: 22 },
  Content: { color: colors.textMuted, fontWeight: "bold", textAlign: "center" },
  closenonpaidIcon: { color: colors.primary },
  addButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.primary,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: spacing.md,
  },

  adminModal: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: spacing.xl,
  },

  titleCenter: {
    color: colors.text,
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: spacing.xl,
    textAlign: "center",
  },

  modeButton: {
    backgroundColor: colors.surfaceAlt,
    paddingVertical: 14,
    borderRadius: radii.sm,
    marginBottom: spacing.md,
  },

  modeButtonText: {
    color: colors.text,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
  },

  input: {
    backgroundColor: colors.background,
    color: colors.text,
    padding: spacing.md,
    borderRadius: radii.sm,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },

  picker: {
    backgroundColor: colors.background,
    color: colors.text,
    borderRadius: radii.sm,
    marginBottom: spacing.md,
  },

  saveButton: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: radii.sm,
    alignItems: "center",
    marginTop: 10,
  },

  classContainer: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  classCard: {
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderRadius: radii.md,
    backgroundColor: colors.cardLight,
    flexDirection: "column",
    justifyContent: "space-between",
  },
  leftContainer: {
    flex: 1,
  },
  centerContainer: {
    marginLeft: spacing.md,
    marginRight: spacing.md,
  },
  rightContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  adminButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
    gap: spacing.md,
  },
  editButton: {
    paddingHorizontal: 5,
  },
  editButtonText: {
    color: colors.text,
    fontWeight: "600",
    textAlign: "center",
  },
  className: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.textOnLight,
  },
  professorName: {
    fontSize: 14,
    color: colors.textOnLight,
  },
  classTime: {
    fontSize: 14,
    color: colors.textOnLight,
    marginRight: spacing.md,
  },
  enrollButton: {
    padding: 5,
  },
  enrollButtonDisabled: {
    opacity: 0.5,
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

  modalText: {
    fontSize: 16,
    marginBottom: spacing.xl,
    textAlign: "center",
  },

  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  noClasses: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: colors.text,
  },

  calendarContainer: {
    marginBottom: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  monthTitle: {
    ...typography.screenTitle,
    color: colors.textMuted,
    textTransform: "uppercase",
  },
  todayButton: {
    backgroundColor: colors.primary,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: radii.sm,
  },
  todayText: {
    color: colors.textMuted,
    fontWeight: "600",
  },
  weekContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 10,
  },
  dayBox: {
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    borderRadius: 10,
    backgroundColor: colors.surfaceMuted,
    width: 45,
  },
  selectedBox: {
    backgroundColor: colors.primary,
  },
  dayText: {
    fontSize: 14,
    fontWeight: "bold",
    color: colors.black,
  },
  dateText: {
    fontSize: 16,
    color: colors.textMuted,
  },
  activeText: {
    color: colors.textMuted,
  },
  modalContainer: {
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    padding: spacing.lg,
    maxHeight: "80%",
  },
  list: {
    marginVertical: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  studentName: {
    color: colors.text,
    fontSize: 16,
  },
  empty: {
    color: colors.textSubtle,
    textAlign: "center",
    marginTop: 20,
  },
  saveBtn: {
    marginTop: 12,
    backgroundColor: colors.primary,
    padding: 14,
    borderRadius: radii.md,
    alignItems: "center",
  },
  saveText: {
    color: colors.text,
    fontWeight: "bold",
  },
  saveButtonText: {
    color: colors.text,
    fontWeight: "bold",
    textAlign: "center",
  },
  studentRow: {
    flexDirection: "row",
    marginTop: spacing.sm,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  studentAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: spacing.xs,
  },
  moreStudents: {
    backgroundColor: colors.cardLight,
    justifyContent: "center",
    alignItems: "center",
  },
  moreStudentsText: {
    fontSize: 12,
    color: colors.black,
    fontWeight: "bold",
  },
});

export default styles;

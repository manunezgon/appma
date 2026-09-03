import { StyleSheet } from "react-native";

import {
  colors,
  radii,
  spacing,
  typography,
} from "./theme";

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.xl,
  },

  modalContent: {
    width: "100%",
    maxHeight: "100%",
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    padding: spacing.xl,
  },

  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.lg,
  },

  title: {
    ...typography.screenTitle,
    flex: 1,
    textAlign: "center",
  },

  closeButton: {
    width: 30,
    height: 30,
    borderRadius: radii.round,
    backgroundColor: colors.surfaceAlt,
    alignItems: "center",
    justifyContent: "center",
    marginTop: spacing.lg,
    alignSelf: "center",
  },

  loader: {
    marginVertical: spacing.xxl,
  },

  historyScroll: {
    width: "100%",
  },

  historyList: {
    width: "100%",
    borderRadius: radii.md,
    backgroundColor: colors.surfaceAlt,
    overflow: "hidden",
  },

  paymentRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  month: {
    flex: 1,
    fontSize: 15,
    color: colors.textMuted,
    fontWeight: "600",
  },

  modalityContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: spacing.sm,
  },

  statusIcon: {
    width: 24,
    height: 24,
    borderRadius: radii.round,
    alignItems: "center",
    justifyContent: "center",
  },

  statusPaid: {
    backgroundColor: colors.success,
  },

  statusPending: {
    backgroundColor: colors.danger,
  },

  modality: {
    fontSize: 14,
    textAlign: "right",
  },

  modalityPaid: {
    color: colors.success,
  },

  modalityPending: {
    color: colors.danger,
  },
});

export default styles;


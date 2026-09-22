import { StyleSheet } from "react-native";
import {
  colors,
  createLayout,
  createTypography,
  radii,
  spacing,
} from "./theme";

export const createProfileStyles = (colors) => {
  const layout = createLayout(colors);
  const typography = createTypography(colors);

  return StyleSheet.create({
    container: {
      ...layout.screen,
      paddingTop: spacing.xl,
      alignItems: "center",
      justifyContent: "center",
    },

    title: {
      fontSize: 18,
      color: colors.textMuted,
    },

    profileHeaderBox: {
      width: "80%",
      borderRadius: radii.md,
      backgroundColor: colors.surfaceAlt,
      padding: spacing.lg,
      marginBottom: spacing.xxl,
    },

    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: spacing.md,
    },

    profileImage: {
      width: 100,
      height: 100,
      borderRadius: 50,
      borderWidth: 3,
      borderColor: colors.primary,
    },

    profileImageBadge: {
      position: "absolute",
      bottom: 0,
      right: 0,
      backgroundColor: colors.primary,
      borderRadius: radii.lg,
      padding: spacing.xs,
    },

    headerText: {
      marginLeft: 10,
    },

    name: {
      ...typography.screenTitle,
      textTransform: "uppercase",
    },

    infoBox: {
      width: "80%",
      borderRadius: radii.md,
      backgroundColor: colors.surfaceAlt,
      padding: spacing.lg,
      marginBottom: spacing.xxl,
    },

    infoRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingVertical: spacing.sm,
    },

    label: {
      fontSize: 15,
      color: colors.textSubtle,
    },

    value: {
      fontSize: 15,
      color: colors.textMuted,
    },

    buttonContainer: {
      width: "80%",
      marginBottom: 50,
    },

    profileButtonRow: {
      flexDirection: "row",
      gap: spacing.xl,
      width: "100%",
      marginBottom: spacing.md,
    },

    profileLogoutButton: {
      padding: spacing.md,
      borderRadius: radii.md,
    },

    button: {
      flex: 1,
      padding: spacing.md,
      borderRadius: radii.md,
      backgroundColor: colors.primary,
    },

    buttonText: {
      textAlign: "center",
      color: colors.textMuted,
      paddingVertical: spacing.xs,
    },

    primaryButtonText: {
      textAlign: "center",
      color: colors.grey,
      paddingVertical: spacing.xs,
      
    },

    saveButton: {
      backgroundColor: colors.primary,
    },

    cancelButton: {
      backgroundColor: colors.surfaceMuted,
    },

    logoutButton: {
      backgroundColor: colors.surfaceMuted,
    },

    modalOverlay: {
      ...layout.modalOverlay,
    },

    modalContent: {
      width: "90%",
      maxHeight: "85%",
      backgroundColor: colors.surface,
      borderRadius: radii.md,
      padding: spacing.xl,
    },

    tabsContainer: {
      flexDirection: "row",
      marginBottom: spacing.xl,
      backgroundColor: colors.surfaceAlt,
      borderRadius: radii.sm,
      overflow: "hidden",
    },

    tabButton: {
      flex: 1,
      paddingVertical: spacing.md,
      alignItems: "center",
      justifyContent: "center",
    },

    tabActive: {
      backgroundColor: colors.primary,
      borderRadius: radii.sm,
    },

    tabText: {
      fontSize: 14,
      color: colors.textMuted,
    },
    activeTabText: {
      color: colors.grey,
      fontWeight: "600",
    },

    modalScroll: {
      flexGrow: 1,
      justifyContent: "center",
      alignItems: "center",
    },

    modalTitle: {
      fontSize: 16,
      fontWeight: "bold",
      color: colors.textMuted,
      marginBottom: spacing.lg,
      textAlign: "center",
      textTransform: "uppercase",
    },

    input: {
      width: "100%",
      backgroundColor: colors.surfaceAlt,
      color: colors.text,
      padding: spacing.md,
      borderRadius: radii.sm,
      marginBottom: spacing.md,
    },

    separator: {
      height: 1,
      width: "100%",
      backgroundColor: colors.surfaceMuted,
      marginVertical: spacing.lg,
    },

    buttonRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: spacing.lg,
      gap: spacing.xl,
    },

    settingsHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: spacing.xl,
    },

    settingsOption: {
      flexDirection: "row",
      alignItems: "center",
      width: "100%",
      paddingVertical: spacing.xs,
      backgroundColor: colors.surfaceAlt,
      marginBottom: spacing.md,
      borderRadius: radii.sm,
    },

    settingsOptionIcon: {
      width: 42,
      height: 42,
      borderRadius: radii.round,
      backgroundColor: colors.surfaceAlt,
      alignItems: "center",
      justifyContent: "center",
      marginRight: spacing.md,
    },

    settingsOptionContent: {
      flex: 1,
    },

    settingsOptionTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.textMuted,
      marginBottom: spacing.xs,
    },

    settingsOptionSubtitle: {
      fontSize: 13,
      color: colors.textSubtle,
    },

    paymentBox: {
      width: "80%",
      borderRadius: radii.md,
      backgroundColor: colors.surfaceAlt,
      padding: spacing.lg,
      marginBottom: spacing.xxl,
    },

    paymentStatusIcon: {
      width: 26,
      height: 26,
      borderRadius: radii.round,
      alignItems: "center",
      justifyContent: "center",
    },

    paymentStatusPaid: {
      backgroundColor: colors.success,
    },

    paymentStatusPending: {
      backgroundColor: colors.danger,
    },

    paymentInfo: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: spacing.sm,
    },

    paymentMonth: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.textMuted,
      marginBottom: spacing.xs,
    },

    paymentModality: {
      fontSize: 15,
    },

    paymentModalityPaid: {
      color: colors.success,
    },

    paymentModalityPending: {
      color: colors.danger,
    },

    paymentHistoryButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      borderTopWidth: 1,
      borderTopColor: colors.border,
      marginTop: spacing.md,
      paddingTop: spacing.md,
    },

    paymentHistoryText: {
      fontSize: 14,
      color: colors.textMuted,
    },
  });
};

const styles = createProfileStyles(colors);

export default styles;

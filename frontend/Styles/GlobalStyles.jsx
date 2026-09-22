import { StyleSheet } from "react-native";
import { radii, spacing } from "./theme";

export const createGlobalStyles = (colors) =>
  StyleSheet.create({
    container: {
      flexGrow: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    screen: {
      flex: 1,
      backgroundColor: colors.background,
    },
    loader: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    logo: {
      width: 200,
      height: 200,
      marginBottom: 25,
    },
    input: {
      width: "90%",
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: radii.sm,
      padding: spacing.md,
      marginBottom: spacing.md,
      backgroundColor: colors.surface,
      color: colors.text,
    },
    button: {
      backgroundColor: colors.primary,
      padding: spacing.md,
      borderRadius: radii.sm,
      alignItems: "center",
    },
    buttonText: {
      color: colors.grey,
      fontSize: 16,
    },
    linkText: {
      color: colors.text,
      marginTop: spacing.xxl,
    },
    activityIndicator: {
      color: colors.text,
    },
  });
 
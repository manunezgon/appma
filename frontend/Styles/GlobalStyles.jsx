import { StyleSheet } from "react-native";
import { colors, radii, spacing } from "./theme";

const styles = StyleSheet.create({
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
    borderColor: colors.text,
    borderRadius: radii.sm,
    padding: spacing.md,
    marginBottom: spacing.md,
    backgroundColor: colors.text,
    color: colors.black,
  },
  button: {
    backgroundColor: colors.primary,
    padding: spacing.md,
    borderRadius: radii.sm,
    alignItems: "center",
  },
  buttonText: {
    color: colors.text,
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

export default styles;

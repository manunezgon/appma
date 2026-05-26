import { StyleSheet } from "react-native";

// COLORS
// #00923aff
// #69188E
// #FF3B30

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
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
    borderColor: "#F5F5F5",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#F5F5F5",
    color: "#000000ff",
  },
  button: {
    backgroundColor: "#69188E",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#F5F5F5",
    fontSize: 16,
  },
  linkText: {
    color: "#F5F5F5",
    marginTop: 30,
  },
});

export default styles;

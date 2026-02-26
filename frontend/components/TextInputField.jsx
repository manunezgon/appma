import { TextInput } from "react-native";

export default function TextInputField({
  value,
  onChangeText,
  placeholder,
  keyboardType,
}) {
  return (
    <TextInput
      style={{
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        padding: 10,
        marginVertical: 5,
      }}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      keyboardType={keyboardType || "default"}
    />
  );
}

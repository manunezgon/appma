import { TextInput } from "react-native";

export default function TextInputField({
  value,
  onChangeText,
  placeholder,
  keyboardType = "default",
  ...props
}) {
  return (
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      keyboardType={keyboardType}
      {...props}
    />
  );
}


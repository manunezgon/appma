import { Ionicons } from "@expo/vector-icons";
import { TextInput, TouchableOpacity, View } from "react-native";
import style from "../../Styles/NewsStyles";
import { colors } from "../../Styles/theme";

export default function AdminInput({ value, onChange, onSend }) {
  return (
    <View style={style.inputContainer}>
      <TextInput
        style={style.input}
        placeholderTextColor={colors.textSubtle}
        placeholder="Share a message..."
        value={value}
        onChangeText={onChange}
      />
      <TouchableOpacity
        onPress={() => onSend(value)}
        disabled={!value.trim()}
        style={{ opacity: value.trim() ? 1 : 0.4 }}
      >
        <Ionicons name="megaphone-outline" size={28} color={colors.primary} />
      </TouchableOpacity>
    </View>
  );
}

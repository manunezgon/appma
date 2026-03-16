import { TextInput, TouchableOpacity, View } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import style from "./Styles";

export default function AdminInput({ value, onChange, onSend }) {
  return (
    <View style={style.inputContainer}>
      <TextInput
        style={style.input}
        placeholderTextColor="#888"
        placeholder="Escribe un anuncio..."
        value={value}
        onChangeText={onChange}
      />
      <TouchableOpacity
        onPress={onSend}
        disabled={!value.trim()}
        style={{ opacity: value.trim() ? 1 : 0.4 }}
      >
        <Ionicons name="megaphone-outline" size={28} color="#7c23b0ff" />
      </TouchableOpacity>
    </View>
  );
}

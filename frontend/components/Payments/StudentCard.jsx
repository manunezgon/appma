import { Image, Text, TouchableOpacity, View } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import style from "../../Styles/PaymentStyle"

export const StudentCard = ({ student, onPress }) => {
  return (
    <TouchableOpacity style={style.card} onPress={() => onPress(student)}>
      <View style={style.infoContainer}>
        <Image
          source={
            student.profileImageUrl
              ? { uri: student.profileImageUrl }
              : require("../../app/assets/images/white_logo_circle.png")
          }
          style={style.avatar}
        />
        <Text style={style.name}>{student.name}</Text>
      </View>
      <Ionicons name="chevron-forward-outline" size={28} color="#888" />
    </TouchableOpacity>
  );
};
import { Ionicons } from "@expo/vector-icons";
import { memo } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import style from "../../Styles/PaymentStyle";
import { colors } from "../../Styles/theme";

const StudentCardComponent = ({ student, onPress }) => {
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
      <Ionicons
        name="chevron-forward-outline"
        size={28}
        color={colors.textSubtle}
      />
    </TouchableOpacity>
  );
};

export const StudentCard = memo(StudentCardComponent);

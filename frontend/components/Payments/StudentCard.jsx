import { Ionicons } from "@expo/vector-icons";
import { memo } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { createPaymentStyles } from "../../Styles/PaymentStyle";
import { useTheme } from "../../context/ThemeContext";

const StudentCardComponent = ({ student, onPress }) => {
  const { theme, colors } = useTheme();
  const style = createPaymentStyles(colors);

  return (
    <TouchableOpacity style={style.card} onPress={() => onPress(student)}>
      <View style={style.infoContainer}>
        <Image
          source={
            student.profileImageUrl
              ? { uri: student.profileImageUrl }
              : theme === "light"
                ? require("../../app/assets/images/black_logo_circle.png")
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

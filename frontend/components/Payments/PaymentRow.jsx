import { Alert, Text, TouchableOpacity, View } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import style from "../../Styles/PaymentStyle";

export const PaymentRow = ({ payment, onDelete }) => {
  const formatMonth = (monthString) => {
    const [year, month] = monthString.split("-");
    const date = new Date(year, month - 1);

    return date.toLocaleString("en-US", {
      month: "long",
      year: "numeric",
    });
  };

  return (
    <View style={style.paymentRow}>
      <View style={style.paymentInfo}>
        <Text style={style.modalityName}>
          Month: {formatMonth(payment.monthPaid)}
        </Text>
        <Text style={style.modalityStatus}>
          Lesson: {payment.lessonName} ({payment.professorName})
        </Text>
      </View>
      <TouchableOpacity
        onPress={() =>
          Alert.alert(
            "Delete payment",
            "Are you sure you want to delete this payment?",
            [
              { text: "Cancel", style: "cancel" },
              {
                text: "Delete",
                style: "destructive",
                onPress: () => onDelete(payment.id),
              },
            ],
          )
        }
      >
        <Ionicons name="trash-outline" size={22} color="#ff4d4d" />
      </TouchableOpacity>
    </View>
  );
};

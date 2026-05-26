import { Ionicons } from "@expo/vector-icons";
import { memo, useCallback } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import style from "../../Styles/PaymentStyle";

const PaymentRowComponent = ({ payment, onDelete }) => {
  const formatMonth = (monthString) => {
    const [year, month] = monthString.split("-");
    const date = new Date(year, month - 1);

    return date.toLocaleString("en-US", {
      month: "long",
      year: "numeric",
    });
  };

  const confirmDelete = useCallback(() => {
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
    );
  }, [onDelete, payment.id]);

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
      <TouchableOpacity onPress={confirmDelete}>
        <Ionicons name="trash-outline" size={22} color="#ff4d4d" />
      </TouchableOpacity>
    </View>
  );
};

export const PaymentRow = memo(PaymentRowComponent);

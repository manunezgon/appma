import { View, Text, TouchableOpacity, Alert, StyleSheet } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

export const PaymentRow = ({ payment, onDelete }) => (
  <View style={styles.paymentRow}>
    <View style={styles.paymentInfo}>
      <Text style={styles.modalityName}>Mes: {payment.monthPaid}</Text>
      <Text style={styles.modalityStatus}>
        Modalidad: {payment.lessonName} ({payment.professorName})
      </Text>
    </View>
    <TouchableOpacity
      onPress={() =>
        Alert.alert(
          "Eliminar pago",
          "¿Seguro que quieres eliminar este pago?",
          [
            { text: "Cancelar", style: "cancel" },
            { text: "Eliminar", style: "destructive", onPress: () => onDelete(payment.id) },
          ]
        )
      }
    >
      <Ionicons name="trash-outline" size={22} color="#ff4d4d" />
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  paymentRow: {
    backgroundColor: "#1E1E1E",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  paymentInfo: {
    flex: 1,
  },
  modalityName: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  modalityStatus: {
    color: "#888",
    fontSize: 12,
    marginTop: 3,
  },
});
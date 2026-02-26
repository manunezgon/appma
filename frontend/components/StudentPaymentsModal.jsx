import React from "react";
import { Modal, View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { PaymentRow } from "./PaymentRow";

export const StudentPaymentsModal = ({
  student,
  payments,
  onDelete,
  onRegister,
  onClose,
  loadingPayments,
}) => (
  <Modal visible={!!student} animationType="fade" transparent onRequestClose={onClose}>
    <View style={styles.modalOverlay}>
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>{student?.name}</Text>

        {loadingPayments ? (
          <Text style={styles.loadingText}>Cargando pagos...</Text>
        ) : payments.length === 0 ? (
          <Text style={styles.noPaymentsText}>No tiene pagos registrados</Text>
        ) : (
          <FlatList
            data={payments}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => <PaymentRow payment={item} onDelete={onDelete} />}
            style={styles.paymentsList}
          />
        )}

        <TouchableOpacity style={styles.registerButton} onPress={onRegister}>
          <Text style={styles.registerButtonText}>Registrar pago</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Ionicons name="close" size={28} color="#7c23b0" />
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#2A2A2A",
    padding: 20,
    borderRadius: 10,
    width: "90%",
    alignItems: "center",
    position: "relative",
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
  },
  loadingText: {
    color: "#ccc",
    marginTop: 10,
  },
  noPaymentsText: {
    color: "#888",
    marginTop: 10,
  },
  paymentsList: {
    width: "100%",
    marginTop: 15,
  },
  registerButton: {
    marginTop: 15,
    backgroundColor: "#00923aff",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  registerButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
  },
});
import { Ionicons } from "@expo/vector-icons";
import {
  FlatList,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { PaymentRow } from "./PaymentRow";
import style from "../../Styles/PaymentStyle";
import { colors } from "../../Styles/theme";

export const StudentPaymentsModal = ({
  student,
  payments,
  onDelete,
  onRegister,
  onClose,
  loadingPayments,
}) => (
  <Modal
    visible={!!student}
    animationType="fade"
    transparent
    onRequestClose={onClose}
  >
    <View style={style.modalOverlay}>
      <View style={style.modalContent}>
        <Text style={style.modalTitle}>{student?.name}</Text>

        {loadingPayments ? (
          <Text style={style.loadingText}>Loading payments...</Text>
        ) : payments.length === 0 ? (
          <Text style={style.noPaymentsText}>No payments registered</Text>
        ) : (
          <FlatList
            data={payments}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <PaymentRow payment={item} onDelete={onDelete} />
            )}
            style={style.paymentsList}
          />
        )}

        <TouchableOpacity style={style.registerButton} onPress={onRegister}>
          <Text style={style.registerButtonText}>Register Payment</Text>
        </TouchableOpacity>

        <TouchableOpacity style={style.closeButton} onPress={onClose}>
          <Ionicons name="close" size={28} color={colors.primary} />
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
);

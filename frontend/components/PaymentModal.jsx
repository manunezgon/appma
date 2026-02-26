import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";
import Ionicons from "react-native-vector-icons/Ionicons";

export const PaymentModal = ({
  visible,
  student,
  lessons,
  months,
  selectedLessonId,
  setSelectedLessonId,
  selectedMonth,
  setSelectedMonth,
  onConfirm,
  registering,
  onClose,
}) => (
  <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
    <View style={styles.modalOverlay}>
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>Registrar pago</Text>
        <Text style={styles.modalSubtitle}>Alumno: {student?.name}</Text>

        <Text style={styles.modalSubtitle}>Selecciona lección</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedLessonId}
            onValueChange={setSelectedLessonId}
            style={styles.picker}
          >
            <Picker.Item label="Selecciona una lección..." value={null} />
            {lessons.map((lesson) => (
              <Picker.Item
                key={lesson.id}
                label={`${lesson.lessonName} (${lesson.professorName})`}
                value={lesson.id}
              />
            ))}
          </Picker>
        </View>

        <Text style={styles.modalSubtitle}>Selecciona mes</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedMonth}
            onValueChange={setSelectedMonth}
            style={styles.picker}
          >
            <Picker.Item label="Selecciona un mes..." value="" />
            {months.map((month) => (
              <Picker.Item key={month.value} label={month.label} value={month.value} />
            ))}
          </Picker>
        </View>

        <TouchableOpacity
          style={styles.registerButton}
          onPress={onConfirm}
          disabled={registering || !selectedLessonId}
        >
          <Text style={styles.registerButtonText}>
            {registering ? "Registrando..." : "Confirmar pago"}
          </Text>
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
  modalSubtitle: {
    color: "#ccc",
    textAlign: "center",
    marginBottom: 10,
  },
  pickerContainer: {
    width: "100%",
    backgroundColor: "#2A2A2A",
    borderRadius: 8,
    marginBottom: 10,
  },
  picker: {
    color: "#fff",
    width: "100%",
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
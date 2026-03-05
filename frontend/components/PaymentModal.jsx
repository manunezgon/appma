import { Picker } from "@react-native-picker/picker";
import { useEffect, useState } from "react";
import {
  Modal,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

export const PaymentModal = ({
  visible,
  student,
  lessons,
  months,
  paidMonths, // 👈 nuevo
  selectedLessonId,
  setSelectedLessonId,
  selectedMonth,
  setSelectedMonth,
  onConfirm,
  registering,
  onClose,
}) => {
  const [isGlobal, setIsGlobal] = useState(false);

  // Reiniciar estado cuando se cierra el modal
  useEffect(() => {
    if (!visible) {
      setIsGlobal(false);
      setSelectedLessonId(null);
      setSelectedMonth("");
    }
  }, [visible]);

  const handleConfirm = () => {
    onConfirm({
      lessonId: selectedLessonId,
      monthPaid: selectedMonth,
      isGlobal,
    });
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Registrar pago</Text>
          <Text style={styles.modalSubtitle}>Alumno: {student?.name}</Text>

          {/* Switch para pago global */}
          <View style={styles.globalSwitchContainer}>
            <Switch value={isGlobal} onValueChange={setIsGlobal} />
            <Text style={styles.globalSwitchLabel}>Pago global</Text>
          </View>

          {/* Selección de lección solo si no es global */}
          {!isGlobal && (
            <>
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
            </>
          )}

          {/* Selección de mes */}
          <Text style={styles.modalSubtitle}>Selecciona mes</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedMonth}
              onValueChange={setSelectedMonth}
              style={styles.picker}
            >
              <Picker.Item label="Selecciona un mes..." value="" />
              {months.map((month) => {
                const isPaid = paidMonths?.includes(month.value);

                return (
                  <Picker.Item
                    key={month.value}
                    label={isPaid ? `${month.label} (Pagado)` : month.label}
                    value={month.value}
                    enabled={!isPaid}
                  />
                );
              })}
            </Picker>
          </View>

          {/* Botón de confirmar */}
          <TouchableOpacity
            style={styles.registerButton}
            onPress={handleConfirm}
            disabled={
              registering || (!isGlobal && !selectedLessonId) || !selectedMonth
            }
          >
            <Text style={styles.registerButtonText}>
              {registering ? "Registrando..." : "Confirmar pago"}
            </Text>
          </TouchableOpacity>

          {/* Botón cerrar */}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={28} color="#7c23b0" />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

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

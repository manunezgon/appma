import { useState } from "react";
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

export default function Payments() {
  const [search, setSearch] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // MOCK DE ALUMNOS
  const students = [
    { id: 1, name: "Juan Pérez" },
    { id: 2, name: "María García" },
    { id: 3, name: "Carlos López" },
    { id: 4, name: "Ana Torres" },
    { id: 5, name: "David Ruiz" },
  ];

  const filteredStudents = students.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()),
  );

  // MOCK MODALIDADES POR ALUMNO
  const studentModalitiesMock = {
    1: [
      { id: 1, name: "Karate", paid: false, lastPaidMonth: "2026-01" },
      { id: 2, name: "BJJ", paid: true, lastPaidMonth: "2026-02" },
    ],
    2: [
      { id: 1, name: "Karate", paid: true, lastPaidMonth: "2026-02" },
      { id: 3, name: "MMA", paid: false, lastPaidMonth: null },
    ],
    3: [{ id: 2, name: "BJJ", paid: true, lastPaidMonth: "2026-02" }],
    4: [{ id: 1, name: "Karate", paid: false, lastPaidMonth: "2026-01" }],
  };

  const renderStudent = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => setSelectedStudent(item)}
    >
      <Text style={styles.name}>{item.name}</Text>
      <Ionicons name="chevron-forward-outline" size={28} color="#888" />
    </TouchableOpacity>
  );

  const renderModality = ({ item }) => (
    <View style={styles.modalityCard}>
      <Text style={styles.modalityName}>{item.name}</Text>
      <Text style={styles.modalityStatus}>
        Último pago: {item.lastPaidMonth ?? "Nunca"}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Alumnos</Text>
      </View>
      {/* Buscador */}
      <View style={styles.searchBox}>
        <Ionicons name="search" size={28} color="#888" />
        <TextInput
          placeholder="Buscar alumno..."
          placeholderTextColor="#888"
          style={styles.searchInput}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <FlatList
        data={filteredStudents}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderStudent}
        ListEmptyComponent={
          <Text style={styles.empty}>No se encontraron alumnos</Text>
        }
      />

      {/* Modal principal: historial de modalidades */}
      <Modal
        visible={selectedStudent !== null}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setSelectedStudent(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{selectedStudent?.name}</Text>
            <Text style={styles.modalSubtitle}>
              Modalidades en las que se ha apuntado
            </Text>

            <FlatList
              data={studentModalitiesMock[selectedStudent?.id] || []}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderModality}
              style={{ width: "100%", marginTop: 10 }}
            />

            {/* Botón registrar pago debajo de toda la lista */}
            <TouchableOpacity
              style={styles.registerButton}
              onPress={() => setShowPaymentModal(true)}
            >
              <Text style={styles.registerButtonText}>Registrar pago</Text>
            </TouchableOpacity>

            {/* Cerrar modal principal */}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setSelectedStudent(null)}
            >
              <Ionicons name="close" size={28} color="#7c23b0" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal secundario: formulario para pago nuevo */}
      <Modal
        visible={showPaymentModal}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setShowPaymentModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Registrar pago</Text>
            <Text style={styles.modalSubtitle}>
              Aquí irá el formulario para registrar un nuevo pago
            </Text>

            {/* Cerrar modal */}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowPaymentModal(false)}
            >
              <Ionicons name="close" size={28} color="#7c23b0" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1E1E1E",
    paddingHorizontal: 20,
    paddingTop: 50,
  },

  header: {
    paddingTop: 20,
    paddingBottom: 10,
  },

  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#CCCCCC",
    textTransform: "uppercase",
    justifyContent: "center",
    textAlign: "center",
  },

  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2A2A2A",
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 20,
  },

  searchInput: {
    flex: 1,
    padding: 10,
    color: "#fff",
  },

  card: {
    backgroundColor: "#2A2A2A",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  name: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },

  empty: {
    textAlign: "center",
    color: "#888",
    marginTop: 20,
  },

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

  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
  },

  modalityCard: {
    backgroundColor: "#1E1E1E",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    width: "100%",
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
});

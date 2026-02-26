import { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useUser } from "../../context/usercontext";
import { API_BASE_URL } from "../config";

import { PaymentModal } from "../../components/PaymentModal";
import { StudentCard } from "../../components/StudentCard";
import { StudentPaymentsModal } from "../../components/StudentPaymentsModal";

const generateMonths = () => {
  const months = [];
  const now = new Date();

  for (let i = 0; i <= 12; i++) {
    const date = new Date(now.getFullYear(), now.getMonth() + i, 1);
    const value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    const label = date.toLocaleString("es-ES", {
      month: "long",
      year: "numeric",
    });
    months.push({
      label: label.charAt(0).toUpperCase() + label.slice(1),
      value,
    });
  }

  return months;
};

export default function Payments() {
  const { user } = useUser();

  const [search, setSearch] = useState("");
  const [students, setStudents] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(true);

  const [selectedStudent, setSelectedStudent] = useState(null);
  const [payments, setPayments] = useState([]);
  const [loadingPayments, setLoadingPayments] = useState(false);

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedLessonId, setSelectedLessonId] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [registeringPayment, setRegisteringPayment] = useState(false);

  const [lessons, setLessons] = useState([]);
  const months = generateMonths();

  // ===========================
  // Fetch functions
  // ===========================
  const fetchLessons = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/lessons`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const data = await response.json();
      setLessons(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchStudents = async () => {
    try {
      setLoadingStudents(true);
      const response = await fetch(`${API_BASE_URL}/users`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      if (!response.ok) throw new Error("Error cargando usuarios");
      const data = await response.json();

      const studentsOnly = data
        .filter((u) => u.role === "MEMBER")
        .map((u) => ({
          id: u.id,
          name: u.name,
          email: u.email,
          phone: u.phone,
        }));

      setStudents(studentsOnly);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingStudents(false);
    }
  };

  const fetchPaymentsByUser = async (userId) => {
    try {
      setLoadingPayments(true);
      const response = await fetch(`${API_BASE_URL}/payments/user/${userId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      if (!response.ok) throw new Error("Error cargando pagos");

      const data = await response.json();
      setPayments(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingPayments(false);
    }
  };

  const deletePayment = async (paymentId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/payments/${paymentId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${user.token}` },
      });
      if (!response.ok) throw new Error("Error eliminando pago");

      fetchPaymentsByUser(selectedStudent.id);
    } catch (err) {
      console.error(err);
      Alert.alert("Error eliminando pago");
    }
  };

  const registerPayment = async () => {
    if (!selectedMonth) return Alert.alert("Selecciona un mes");

    try {
      setRegisteringPayment(true);
      const response = await fetch(`${API_BASE_URL}/payments/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          userId: selectedStudent.id,
          lessonId: selectedLessonId,
          monthPaid: selectedMonth,
        }),
      });

      if (!response.ok) throw new Error("Error registrando pago");

      Alert.alert("Pago registrado correctamente");
      setShowPaymentModal(false);
      setSelectedMonth("");
      setSelectedLessonId(null);
      fetchPaymentsByUser(selectedStudent.id);
    } catch (err) {
      console.error(err);
      Alert.alert("Error registrando pago");
    } finally {
      setRegisteringPayment(false);
    }
  };

  // ===========================
  // Effects
  // ===========================
  useEffect(() => {
    if (user?.token) fetchStudents();
  }, [user]);
  useEffect(() => {
    if (user?.token) fetchLessons();
  }, [user]);

  // ===========================
  // Filtered students
  // ===========================
  const filteredStudents = students.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.title}>Alumnos</Text>

      {/* Buscador */}
      <View style={styles.searchBox}>
        <TextInput
          placeholder="Buscar alumno..."
          placeholderTextColor="#888"
          style={styles.searchInput}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Lista de alumnos */}
      {loadingStudents ? (
        <Text style={styles.loadingText}>Cargando alumnos...</Text>
      ) : (
        <FlatList
          data={filteredStudents}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <StudentCard
              student={item}
              onPress={(student) => {
                setSelectedStudent(student);
                fetchPaymentsByUser(student.id);
              }}
            />
          )}
          ListEmptyComponent={<Text style={styles.empty}>No hay alumnos</Text>}
        />
      )}

      {/* Modal pagos del alumno */}
      <StudentPaymentsModal
        student={selectedStudent}
        payments={payments}
        onDelete={deletePayment}
        onRegister={() => setShowPaymentModal(true)}
        onClose={() => {
          setSelectedStudent(null);
          setPayments([]);
        }}
        loadingPayments={loadingPayments}
      />

      {/* Modal registrar pago */}
      <PaymentModal
        visible={showPaymentModal}
        student={selectedStudent}
        lessons={lessons}
        months={months}
        selectedLessonId={selectedLessonId}
        setSelectedLessonId={setSelectedLessonId}
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
        onConfirm={registerPayment}
        registering={registeringPayment}
        onClose={() => setShowPaymentModal(false)}
      />
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
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#CCCCCC",
    textTransform: "uppercase",
    textAlign: "center",
    marginBottom: 20,
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
  loadingText: {
    color: "#ccc",
    marginTop: 10,
  },
  empty: {
    textAlign: "center",
    color: "#888",
    marginTop: 20,
  },
});

import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, TextInput, View } from "react-native";
import { useLessons } from "../../context/LessonsContext";
import { usePayments } from "../../context/PaymentsContext";
import { useUser } from "../../context/UserContext";
import { API_BASE_URL } from "../config";

import { PaymentModal } from "../../components/Payments/PaymentModal";
import { StudentPaymentsModal } from "../../components/Payments/StudentPaymentsModal";
import { StudentCard } from "../../components/Payments/StudentCard";

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
  const { lessons } = useLessons();
  const {
    payments,
    loadingPayments,
    registeringPayment,
    fetchPaymentsByUser,
    deletePayment,
    registerPayment,
  } = usePayments();

  const [search, setSearch] = useState("");
  const [students, setStudents] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(true);

  const [selectedStudent, setSelectedStudent] = useState(null);

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedLessonId, setSelectedLessonId] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState("");

  const [months] = useState(generateMonths());

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
          profileImageUrl: u.profileImageUrl,
        }));

      setStudents(studentsOnly);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingStudents(false);
    }
  };

  useEffect(() => {
    if (user?.token) fetchStudents();
  }, [user]);

  const filteredStudents = students.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <View style={styles.container}>

      <Text style={styles.title}>Alumnos</Text>

      <View style={styles.searchBox}>
        <TextInput
          placeholder="Buscar alumno..."
          placeholderTextColor="#888"
          style={styles.searchInput}
          value={search}
          onChangeText={setSearch}
        />
      </View>

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

      <StudentPaymentsModal
        student={selectedStudent}
        payments={payments}
        onDelete={(paymentId) => deletePayment(paymentId, selectedStudent.id)}
        onRegister={() => setShowPaymentModal(true)}
        onClose={() => {
          setSelectedStudent(null);
        }}
        loadingPayments={loadingPayments}
      />

      <PaymentModal
        visible={showPaymentModal}
        student={selectedStudent}
        lessons={lessons}
        months={months}
        paidMonths={payments.map((p) => p.monthPaid)}
        selectedLessonId={selectedLessonId}
        setSelectedLessonId={setSelectedLessonId}
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
        onConfirm={async (data) => {
          await registerPayment({
            userId: selectedStudent.id,
            ...data,
          });

          setShowPaymentModal(false);
          setSelectedMonth("");
          setSelectedLessonId(null);
        }}
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

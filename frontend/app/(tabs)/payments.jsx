import { useCallback, useEffect, useMemo, useState } from "react";
import { FlatList, Text, TextInput, View } from "react-native";
import { useLessons } from "../../context/LessonsContext";
import { usePayments } from "../../context/PaymentsContext";
import { useUser } from "../../context/UserContext";
import { API_BASE_URL } from "../../config/api";

import { PaymentModal } from "../../components/Payments/PaymentModal";
import { StudentPaymentsModal } from "../../components/Payments/StudentPaymentsModal";
import { StudentCard } from "../../components/Payments/StudentCard";
import style from "../../Styles/PaymentStyle";

const generateMonths = () => {
  const months = [];
  const now = new Date();

  for (let i = 0; i <= 12; i++) {
    const date = new Date(now.getFullYear(), now.getMonth() + i, 1);
    const value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    const label = date.toLocaleString("en-US", {
      month: "long",
      year: "numeric",
    });
    months.push({
      label,
      value,
    });
  }

  return months;
};

export default function Payments() {
  const { token } = useUser();
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

  const fetchStudents = useCallback(async () => {
    if (!token) return;

    try {
      setLoadingStudents(true);
      const response = await fetch(`${API_BASE_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Error loading users");
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
  }, [token]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const filteredStudents = useMemo(() => {
    const normalizedSearch = search.toLowerCase();

    return students.filter((s) =>
      s.name.toLowerCase().includes(normalizedSearch),
    );
  }, [search, students]);

  const paidMonths = useMemo(
    () => payments.map((payment) => payment.monthPaid),
    [payments],
  );

  const handleStudentPress = useCallback(
    (student) => {
      setSelectedStudent(student);
      fetchPaymentsByUser(student.id);
    },
    [fetchPaymentsByUser],
  );

  const handleDeletePayment = useCallback(
    (paymentId) => {
      if (!selectedStudent) return;
      deletePayment(paymentId, selectedStudent.id);
    },
    [deletePayment, selectedStudent],
  );

  const handleConfirmPayment = useCallback(
    async (data) => {
      if (!selectedStudent) return;

      await registerPayment({
        userId: selectedStudent.id,
        ...data,
      });

      setShowPaymentModal(false);
      setSelectedMonth("");
      setSelectedLessonId(null);
    },
    [registerPayment, selectedStudent],
  );

  const renderStudent = useCallback(
    ({ item }) => <StudentCard student={item} onPress={handleStudentPress} />,
    [handleStudentPress],
  );

  return (
    <View style={style.container}>
      <Text style={style.title}>Students</Text>

      <View style={style.searchBox}>
        <TextInput
          placeholder="Search students..."
          placeholderTextColor="#888"
          style={style.searchInput}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {loadingStudents ? (
        <Text style={style.loadingText}>Loading students...</Text>
      ) : (
        <FlatList
          data={filteredStudents}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderStudent}
          ListEmptyComponent={<Text style={style.empty}>No students</Text>}
        />
      )}

      <StudentPaymentsModal
        student={selectedStudent}
        payments={payments}
        onDelete={handleDeletePayment}
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
        paidMonths={paidMonths}
        selectedLessonId={selectedLessonId}
        setSelectedLessonId={setSelectedLessonId}
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
        onConfirm={handleConfirmPayment}
        registering={registeringPayment}
        onClose={() => setShowPaymentModal(false)}
      />
    </View>
  );
}

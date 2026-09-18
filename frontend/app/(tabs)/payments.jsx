import { useCallback, useEffect, useMemo, useState } from "react";
import { FlatList, Text, TextInput, View } from "react-native";
import { useLessons } from "../../context/LessonsContext";
import { usePayments } from "../../context/PaymentsContext";
import { useTranslation } from "../../hooks/useTranslation";
import { useUser } from "../../context/UserContext";
import { getUsers } from "../../services/usersApi";

import { PaymentModal } from "../../components/Payments/PaymentModal";
import { StudentCard } from "../../components/Payments/StudentCard";
import { createPaymentStyles } from "../../Styles/PaymentStyle";
import { useTheme } from "../../context/ThemeContext";

const generateMonths = (t) => {
  const months = [];
  const now = new Date();

  for (let i = 0; i <= 12; i++) {
    const date = new Date(now.getFullYear(), now.getMonth() + i, 1);

    const value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0",
    )}`;

    const label = `${t(
      `paymentHistory.months.${date.getMonth()}`,
    )} ${date.getFullYear()}`;

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

  const { colors } = useTheme();
  const style = createPaymentStyles(colors);

  const { t } = useTranslation();

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

  const [modalMode, setModalMode] = useState(null);

  const [selectedLessonId, setSelectedLessonId] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState("");

  const months = useMemo(() => generateMonths(t), [t]);

  const fetchStudents = useCallback(async () => {
    if (!token) return;

    try {
      setLoadingStudents(true);

      const data = await getUsers(token);

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
      setModalMode("student");
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

  const handleOpenRegisterPayment = useCallback(() => {
    setSelectedLessonId(null);
    setSelectedMonth("");
    setModalMode("register");
  }, []);

  const handleCloseModal = useCallback(() => {
    setModalMode(null);
    setSelectedStudent(null);
    setSelectedLessonId(null);
    setSelectedMonth("");
  }, []);

  const handleBackToStudent = useCallback(() => {
    setSelectedLessonId(null);
    setSelectedMonth("");
    setModalMode("student");
  }, []);

  const handleConfirmPayment = useCallback(
    async (data) => {
      if (!selectedStudent) return;

      await registerPayment({
        userId: selectedStudent.id,
        ...data,
      });

      setModalMode(null);
      setSelectedStudent(null);
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
      <Text style={style.title}>{t("payments.students")}</Text>

      <View style={style.searchBox}>
        <TextInput
          placeholder={t("payments.searchStudents")}
          placeholderTextColor={colors.textSubtle}
          style={style.searchInput}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {loadingStudents ? (
        <Text style={style.loadingText}>{t("payments.loadingStudents")}</Text>
      ) : (
        <FlatList
          data={filteredStudents}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderStudent}
          ListEmptyComponent={
            <Text style={style.empty}>{t("payments.noStudents")}</Text>
          }
        />
      )}

      <PaymentModal
        visible={modalMode !== null}
        mode={modalMode}
        student={selectedStudent}
        payments={payments}
        onDelete={handleDeletePayment}
        onRegister={handleOpenRegisterPayment}
        onBack={handleBackToStudent}
        loadingPayments={loadingPayments}
        lessons={lessons}
        months={months}
        paidMonths={paidMonths}
        selectedLessonId={selectedLessonId}
        setSelectedLessonId={setSelectedLessonId}
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
        onConfirm={handleConfirmPayment}
        registering={registeringPayment}
        onClose={handleCloseModal}
      />
    </View>
  );
}

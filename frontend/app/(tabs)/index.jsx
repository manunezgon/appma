import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { ActivityIndicator, TouchableOpacity, View } from "react-native";

import AdminCreateClassModal from "../../components/Lessons/AdminCreateClassModal.jsx";
import AttendanceModal from "../../components/Lessons/AttendanceModal";
import ClassList from "../../components/Lessons/ClassList";
import Calendar from "../../components/Lessons/WeekCalendar";

import PaymentErrorModal from "../../components/Lessons/PaymentErrorModal.jsx";

import useAdminClassActions from "../../hooks/useAdminClassActions.jsx";
import useAdminClassModal from "../../hooks/useAdminClassModal.jsx";
import useAttendance from "../../hooks/useAttendance.jsx";
import useEnrollmentActions from "../../hooks/useEnrollmentsActions.jsx";
import useHomeData from "../../hooks/useHomeData.jsx";

import { useEnrollments } from "../../context/EnrollmentsContext";
import { useLessons } from "../../context/LessonsContext";
import { useUser } from "../../context/UserContext.jsx";

import styles from "../../Styles/LessonStyles.jsx";

export default function HomeScreen() {
  const [selectedDay, setSelectedDay] = useState(new Date());

  const { user } = useUser();

  const { lessons } = useLessons();

  const { enrollUser } = useEnrollments();

  const {
    classes,
    refreshing,
    onRefresh,
    loading,
    daySchedules,
    fetchDayData,
  } = useHomeData(selectedDay);

  const enrollmentActions = useEnrollmentActions({
    enrollUser,
    selectedDay,
  });

  const { token } = useUser();

  const attendance = useAttendance({
    token,
    onAttendanceSaved: fetchDayData,
  });

  const adminActions = useAdminClassActions({
    selectedDay,
    daySchedules,
  });

  const adminModal = useAdminClassModal(adminActions);

  return (
    <View style={styles.container}>
      {/* CALENDAR */}

      <Calendar selectedDay={selectedDay} setSelectedDay={setSelectedDay} />

      {/* ADMIN FAB */}

      {user?.role === "ADMIN" && (
        <TouchableOpacity
          style={styles.addButton}
          onPress={adminModal.openModal}
        >
          <Ionicons name="add" size={20} color="#fff" />
        </TouchableOpacity>
      )}

      {/* LOADING */}

      {loading ? (
        <ActivityIndicator size="large" color="#69188E" />
      ) : (
        <ClassList
          classes={classes}
          refreshing={refreshing}
          onRefresh={onRefresh}
          onEnroll={enrollmentActions.handleEnroll}
          userRole={user?.role}
          onDeleteClass={adminActions.deleteClass}
          onTakeAttendance={(cls) =>
            attendance.openAttendance(cls, selectedDay)
          }
        />
      )}

      {/* ATTENDANCE MODAL */}

      <AttendanceModal
        visible={attendance.attendanceVisible}
        onClose={attendance.closeAttendance}
        selectedClass={attendance.selectedClass}
        selectedDay={selectedDay}
        students={attendance.students}
        loading={attendance.loading}
        saving={attendance.saving}
        onToggle={attendance.toggleAttendance}
        onSave={attendance.saveAttendance}
      />

      {/* PAYMENT ERROR MODAL */}

      <PaymentErrorModal
        visible={enrollmentActions.errorModalVisible}
        message={enrollmentActions.errorMessage}
        onClose={enrollmentActions.closeErrorModal}
      />

      {/* ADMIN CREATE CLASS MODAL */}

      <AdminCreateClassModal
        visible={adminModal.visible}
        onClose={adminModal.closeModal}
        createMode={adminModal.createMode}
        setCreateMode={adminModal.setCreateMode}
        lessonsList={lessons}
        selectedLessonId={adminModal.selectedLessonId}
        setSelectedLessonId={adminModal.setSelectedLessonId}
        newStartTime={adminModal.newStartTime}
        setNewStartTime={adminModal.setNewStartTime}
        newEndTime={adminModal.newEndTime}
        setNewEndTime={adminModal.setNewEndTime}
        newDescription={adminModal.newDescription}
        setNewDescription={adminModal.setNewDescription}
        onCreateExisting={adminModal.handleCreateExisting}
        onCreateNew={adminModal.handleCreateNew}
      />
    </View>
  );
}

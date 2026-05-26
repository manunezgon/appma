import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import ClassList from "../../components/Lessons/ClassList";
import Calendar from "../../components/Lessons/WeekCalendar";
import { useEnrollments } from "../../context/EnrollmentsContext";
import { useSchedules } from "../../context/SchedulesContext";
import { useUser } from "../../context/UserContext.jsx";
import styles from "../../Styles/LessonStyles.jsx";

export default function HomeScreen() {
  const [selectedDay, setSelectedDay] = useState(new Date());

  const { user } = useUser();

  const { daySchedules, fetchSchedulesByDay, loadingSchedules } =
    useSchedules();

  const {
    classStudentsByDay,
    loadingEnrollments,
    loadDayEnrollments,
    enrollUser,
  } = useEnrollments();

  const [refreshing, setRefreshing] = useState(false);

  const isLoading = loadingSchedules || loadingEnrollments;

  useEffect(() => {
    fetchSchedulesByDay(selectedDay);
    loadDayEnrollments(selectedDay);
  }, [selectedDay]);

  const classes = useMemo(() => {
    return daySchedules
      .map((item) => {
        const start = item.startTime.slice(0, 5);
        const end = item.endTime.slice(0, 5);

        const students = classStudentsByDay[item.id] || [];

        const enrolled = students.some((s) => s.id === user.id);

        const startMinutes =
          Number(start.split(":")[0]) * 60 + Number(start.split(":")[1]);

        const classDateTime = new Date(selectedDay);
        classDateTime.setHours(Number(start.split(":")[0]));
        classDateTime.setMinutes(Number(start.split(":")[1]));

        return {
          id: String(item.id),
          lessonName: item.lessonName ?? item.description ?? "Class",
          professorName: item.professorName ?? "",
          time: `${start} - ${end}`,
          startMinutes,
          isEnrolled: enrolled,
          isPast: classDateTime < new Date(),
          lessonId: item.lessonId,
          startTime: start,
          endTime: end,
          isException: item.date !== null,
          students,
        };
      })
      .sort((a, b) => a.startMinutes - b.startMinutes);
  }, [daySchedules, classStudentsByDay, selectedDay, user.id]);

  const onRefresh = async () => {
    setRefreshing(true);

    await Promise.all([
      fetchSchedulesByDay(selectedDay),
      loadDayEnrollments(selectedDay),
    ]);

    setRefreshing(false);
  };

  const handleEnroll = async (scheduleId, isException = false) => {
    await enrollUser(
      isException ? null : scheduleId,
      selectedDay,
      isException ? scheduleId : null,
    );

    await Promise.all([
      fetchSchedulesByDay(selectedDay),
      loadDayEnrollments(selectedDay),
    ]);
  };

  return (
    <View style={styles.container}>
      <Calendar selectedDay={selectedDay} setSelectedDay={setSelectedDay} />

      {isLoading ? (
        <ActivityIndicator size="large" color="#69188E" />
      ) : (
        <ClassList
          classes={classes}
          refreshing={refreshing}
          onRefresh={onRefresh}
          onEnroll={handleEnroll}
          userRole={user?.role}
          onDeleteClass={(cls) => {
            // si quieres mantenerlo simple por ahora
            // puedes mover esto luego al context de schedules
            console.warn("delete not implemented here", cls);
          }}
        />
      )}
    </View>
  );
}

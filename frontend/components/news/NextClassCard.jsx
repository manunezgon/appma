import { Ionicons } from "@expo/vector-icons";
import { useMemo } from "react";
import { Text, View } from "react-native";
import style from "../../Styles/NewsStyles";
import { colors } from "../../Styles/theme";

export default function NextClassCard({ enrollments = [] }) {
  const nextClass = useMemo(() => {
    const now = new Date();

    return (
      enrollments
        .map((e) => {
          const startHour = e.time.split(" - ")[0];
          const classDateTime = new Date(`${e.date}T${startHour}`);

          return { ...e, classDateTime };
        })
        .filter((e) => e.classDateTime > now)
        .sort((a, b) => a.classDateTime - b.classDateTime)[0] ?? null
    );
  }, [enrollments]);

  if (!nextClass) return null;

  const today = new Date();
  const classDate = nextClass.classDateTime;

  const isToday =
    classDate.getFullYear() === today.getFullYear() &&
    classDate.getMonth() === today.getMonth() &&
    classDate.getDate() === today.getDate();

  const isTomorrow = (() => {
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    return (
      classDate.getFullYear() === tomorrow.getFullYear() &&
      classDate.getMonth() === tomorrow.getMonth() &&
      classDate.getDate() === tomorrow.getDate()
    );
  })();

  const formattedDate = isToday
    ? "Today"
    : isTomorrow
      ? "Tomorrow"
      : nextClass.date;

  return (
    <View style={style.nextClassContainer}>
      <View style={style.nextClassIcon}>
        <Ionicons
          name="calendar-outline"
          size={24}
          color={colors.primary}
        />
      </View>

      <View style={style.nextClassContent}>
        <Text style={style.nextClassLabel}>NEXT CLASS</Text>

        <Text style={style.nextClassName}>{nextClass.lessonName}</Text>

        <Text style={style.nextClassInfo}>
          {formattedDate} · {nextClass.time}
        </Text>

        <Text style={style.nextClassProfessor}>
          {nextClass.professorName}
        </Text>
      </View>
    </View>
  );
}
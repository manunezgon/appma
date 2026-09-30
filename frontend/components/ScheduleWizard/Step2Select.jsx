import { Text, TouchableOpacity, View } from "react-native";
import { useTranslation } from "../../hooks/useTranslation";
import { createScheduleStyles } from "../../Styles/ScheduleStyles.jsx";
import { useTheme } from "../../context/ThemeContext";
import SelectableList from "./SelectableList.jsx";

export default function Step2Select({
  mode,
  lessonMode,
  lessons,
  schedules,
  loadingLessons,
  loadingSchedules,
  selectedLessonId,
  selectedScheduleId,
  setSelectedLessonId,
  setSelectedScheduleId,
  setLessonMode,
  setSelectedDay,
  setStartTime,
  setEndTime,
  setStep,
  setNewLessonName,
  setNewProfessorName,
  setNewAmountMonthly,
}) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const style = createScheduleStyles(colors);

  const weekOrder = [
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
    "SUNDAY",
  ];

  if (mode === "create") {
    return (
      <>
        <Text style={style.subtitle}>
          {t("scheduleManagement.whichLessonType")}
        </Text>

        <TouchableOpacity
          style={style.button}
          onPress={() => {
            setLessonMode("new");
            setStep(3);
          }}
        >
          <Text style={style.buttonText}>
            {t("scheduleManagement.createNewLesson")}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={style.button}
          onPress={() => {
            setLessonMode("existing");
            setStep(3);
          }}
        >
          <Text style={style.buttonText}>
            {t("scheduleManagement.useExistingLesson")}
          </Text>
        </TouchableOpacity>
      </>
    );
  }

  if (mode === "editSchedule") {
    if (loadingSchedules) return <Text>{t("scheduleManagement.loadingSchedules")}</Text>;
    if (!schedules.length) return <Text>{t("scheduleManagement.noSchedules")}</Text>;

    const schedulesByDay = schedules.reduce((acc, s) => {
      acc[s.dayOfWeek] = acc[s.dayOfWeek] || [];
      acc[s.dayOfWeek].push(s);
      return acc;
    }, {});

    Object.keys(schedulesByDay).forEach((day) => {
      schedulesByDay[day].sort((a, b) =>
        a.startTime.localeCompare(b.startTime),
      );
    });

    return (
      <>
        {Object.entries(schedulesByDay)
          .sort(
            ([dayA], [dayB]) =>
              weekOrder.indexOf(dayA) - weekOrder.indexOf(dayB),
          )
          .map(([day, daySchedules]) => (
            <View key={day}>
              <Text style={style.subtitle}>
                {t(`scheduleManagement.days.${day}`)}
              </Text>
              <SelectableList
                items={daySchedules}
                selectedId={selectedScheduleId}
                onSelect={(id) => {
                  const sched = schedules.find((s) => s.id === id);
                  if (!sched) return;

                  setSelectedScheduleId(id);
                  setSelectedLessonId(sched.lessonId);
                  setLessonMode("existing");

                  setSelectedDay(sched.dayOfWeek);
                  setStartTime(sched.startTime);
                  setEndTime(sched.endTime);

                  setStep(3);
                }}
                renderItem={(sched) => (
                  <View style={style.classContainer}>
                    <View style={style.classNameContainer}>
                      <Text style={style.className}>{sched.lessonName}</Text>
                      <Text style={style.professorName}>
                        {sched.professorName}
                      </Text>
                    </View>

                    <Text style={style.startTimeEndTime}>
                      {sched.startTime} - {sched.endTime}
                    </Text>
                  </View>
                )}
              />
            </View>
          ))}
      </>
    );
  }

  if (mode === "editLesson") {
    return (
      <>
        <Text style={style.subtitle}>
          {t("scheduleManagement.selectLessonToEdit")}
        </Text>

        {loadingLessons ? (
          <Text>{t("scheduleManagement.loadingLessons")}</Text>
        ) : (
          <SelectableList
            items={lessons}
            selectedId={selectedLessonId}
            onSelect={(id) => {
              const lesson = lessons.find((l) => l.id === id);
              if (!lesson) return;

              setSelectedLessonId(id);
              setNewLessonName(lesson.lessonName);
              setNewProfessorName(lesson.professorName);
              setNewAmountMonthly(String(lesson.amountMonthly));

              setStep(3);
            }}
            renderItem={(l) => (
              <View style={style.classContainer}>
                <View style={style.classNameContainer}>
                  <Text style={style.className}>{l.lessonName}</Text>
                  <Text style={style.professorName}>{l.professorName}</Text>
                </View>

                <Text style={style.amount}>{l.amountMonthly}€</Text>
              </View>
            )}
          />
        )}
      </>
    );
  }

  return null;
}

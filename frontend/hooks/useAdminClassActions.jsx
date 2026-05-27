import { useSchedules } from "../context/SchedulesContext";

export default function useAdminClassActions({
  selectedDay,
  daySchedules,
}) {
  const {
    createScheduleException,
    updateScheduleException,
    fetchSchedulesByDay,
  } = useSchedules();

  const isSameDay = (dateString, compareDate) => {
    const d1 = new Date(dateString);
    const d2 = new Date(compareDate);

    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  };

  const createLessonException = async ({
    lessonId,
    startTime,
    endTime,
  }) => {
    if (!lessonId || !startTime || !endTime) return;

    await createScheduleException({
      lessonId,
      startTime,
      endTime,
      cancelled: false,
      date: selectedDay,
    });

    await fetchSchedulesByDay(selectedDay);
  };

  const createCustomException = async ({
    description,
    startTime,
    endTime,
  }) => {
    if (!description || !startTime || !endTime) {
      throw new Error("Missing required fields");
    }

    await createScheduleException({
      lessonId: null,
      description,
      startTime,
      endTime,
      cancelled: false,
      date: selectedDay,
    });

    await fetchSchedulesByDay(selectedDay);
  };

  const deleteClass = async (cls) => {
    try {
      const existingException = daySchedules.find(
        (s) =>
          s.date &&
          isSameDay(s.date, selectedDay) &&
          ((s.lessonId && s.lessonId === cls.lessonId) ||
            (s.description && s.description === cls.lessonName)),
      );

      if (existingException) {
        await updateScheduleException(existingException.id, {
          cancelled: true,
          startTime: cls.startTime,
          endTime: cls.endTime,
          lessonId: cls.lessonId ?? null,
          description:
            cls.isException && !cls.lessonId
              ? cls.lessonName
              : null,
          date: selectedDay,
        });
      } else {
        await createScheduleException({
          lessonId: cls.lessonId ?? null,
          startTime: cls.startTime,
          endTime: cls.endTime,
          cancelled: true,
          date: selectedDay,
          description:
            cls.isException && !cls.lessonId
              ? cls.lessonName
              : null,
        });
      }

      await fetchSchedulesByDay(selectedDay);
    } catch (err) {
      console.error("Error deleting class:", err);
      throw err;
    }
  };

  return {
    createLessonException,
    createCustomException,
    deleteClass,
  };
}
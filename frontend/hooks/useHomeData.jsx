import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useMemo, useRef, useState } from "react";

import { useEnrollments } from "../context/EnrollmentsContext";
import { useSchedules } from "../context/SchedulesContext";
import { useUser } from "../context/UserContext";

const FOCUS_MIN_INTERVAL_MS = 45_000;

export default function useHomeData(selectedDay) {
  const { user } = useUser();

  const { daySchedules, fetchSchedulesByDay, loadingSchedules } =
    useSchedules();

  const {
    classStudentsByDay,
    loadDayEnrollments,
    loadingEnrollments,
    enrollUser,
  } = useEnrollments();

  const [loadedDayKey, setLoadedDayKey] = useState(null);

  const [refreshing, setRefreshing] = useState(false);

  const lastHomeFocusRef = useRef({
    dayKey: null,
    at: 0,
  });

  const fetchDayData = useCallback(async () => {
    setLoadedDayKey(null);

    const dayKey = selectedDay.toISOString().split("T")[0];

    await Promise.all([
      fetchSchedulesByDay(selectedDay),
      loadDayEnrollments(selectedDay),
    ]);

    setLoadedDayKey(dayKey);
  }, [selectedDay, fetchSchedulesByDay, loadDayEnrollments]);

  const currentDayKey = selectedDay.toISOString().split("T")[0];

  const isCurrentDayLoaded = loadedDayKey === currentDayKey;

  useFocusEffect(
    useCallback(() => {
      const dayKey = selectedDay.toISOString().split("T")[0];

      const now = Date.now();

      if (
        lastHomeFocusRef.current.dayKey === dayKey &&
        now - lastHomeFocusRef.current.at < FOCUS_MIN_INTERVAL_MS
      ) {
        return;
      }

      lastHomeFocusRef.current = {
        dayKey,
        at: now,
      };

      fetchDayData();
    }, [selectedDay, fetchDayData]),
  );

  const classes = useMemo(() => {
    return daySchedules
      .map((item) => {
        const start = item.startTime.slice(0, 5);

        const end = item.endTime.slice(0, 5);

        const students = classStudentsByDay[item.id] || [];

        const enrolled = students.some((s) => s.id === user?.id);

        const [hours, minutes] = start.split(":").map(Number);

        const startMinutes = hours * 60 + minutes;

        const classDateTime = new Date(selectedDay);

        classDateTime.setHours(hours);
        classDateTime.setMinutes(minutes);

        return {
          id: String(item.id),

          lessonName: item.lessonName ?? item.description ?? "Special Class",

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
  }, [daySchedules, classStudentsByDay, selectedDay, user?.id]);

  const onRefresh = async () => {
    setRefreshing(true);

    await fetchDayData();

    setRefreshing(false);
  };

  const handleEnroll = async (scheduleId, isException = false) => {
    await enrollUser(
      isException ? null : scheduleId,
      selectedDay,
      isException ? scheduleId : null,
    );

    await fetchDayData();
  };

  return {
    classes: isCurrentDayLoaded ? classes : [],

    refreshing,

    onRefresh,

    handleEnroll,

    fetchDayData,

    loading: !isCurrentDayLoaded || loadingSchedules || loadingEnrollments,

    daySchedules,
  };
}

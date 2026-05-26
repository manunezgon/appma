import { useCallback, useEffect, useState } from "react";
import { API_BASE_URL } from "../config/api";

export default function useAttendance({ token, onAttendanceSaved }) {
  const [attendanceVisible, setAttendanceVisible] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);


  const fetchStudents = useCallback(
    async (classData, day) => {
      if (!classData || !day) return;

      setLoading(true);

      try {
        const dateStr = day.toISOString().split("T")[0];

        let url = `${API_BASE_URL}/enrollments/class?date=${dateStr}`;

        if (classData.isException) {
          url += `&scheduleExceptionId=${classData.id}`;
        } else {
          url += `&scheduleTemplateId=${classData.id}`;
        }

        const res = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!res.ok || !Array.isArray(data)) {
          setStudents([]);
          return;
        }

        const formatted = data.map((s) => ({
          id: s.userId,
          name: s.userName,
          attended: s.attended,
        }));

        setStudents(formatted);
      } catch (err) {
        console.error("fetchStudents error:", err);
        setStudents([]);
      } finally {
        setLoading(false);
      }
    },
    [token],
  );

 
  useEffect(() => {
    if (!attendanceVisible || !selectedClass || !selectedDay) return;

    fetchStudents(selectedClass, selectedDay);
  }, [attendanceVisible, selectedClass, selectedDay, fetchStudents]);

  const openAttendance = (cls, day) => {
    setSelectedClass(cls);
    setSelectedDay(day);
    setAttendanceVisible(true);
  };

  const closeAttendance = () => {
    setAttendanceVisible(false);
    setSelectedClass(null);
    setSelectedDay(null);
    setStudents([]);
  };


  const toggleAttendance = (id) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, attended: !s.attended } : s)),
    );
  };

  const saveAttendance = async () => {
    if (!selectedClass || !selectedDay) return;

    setSaving(true);

    try {
      const dateStr = selectedDay.toISOString().split("T")[0];

      const presentUserIds = students
        .filter((s) => s.attended)
        .map((s) => s.id);

      const body = {
        date: dateStr,
        presentUserIds,
        scheduleTemplateId: selectedClass.isException ? null : selectedClass.id,
        scheduleExceptionId: selectedClass.isException
          ? selectedClass.id
          : null,
      };

      const res = await fetch(`${API_BASE_URL}/enrollments/attendance`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = await res.json();
        console.error("saveAttendance error:", err);
        return;
      }

      await onAttendanceSaved?.();
      closeAttendance();
    } catch (err) {
      console.error("saveAttendance exception:", err);
    } finally {
      setSaving(false);
    }
  };

  return {
    attendanceVisible,
    selectedClass,
    selectedDay,
    students,
    loading,
    saving,

    openAttendance,
    closeAttendance,
    toggleAttendance,
    saveAttendance,
  };
}

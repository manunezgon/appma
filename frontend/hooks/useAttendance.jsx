import { useCallback, useEffect, useState } from "react";
import {
  getClassEnrollments,
  saveAttendanceRequest,
} from "../services/enrollmentsApi";

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
        const data = await getClassEnrollments(classData, day, token);

        if (!Array.isArray(data)) {
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
      const presentUserIds = students
        .filter((s) => s.attended)
        .map((s) => s.id);

      await saveAttendanceRequest(
        {
          selectedClass,
          selectedDay,
          presentUserIds,
        },
        token,
      );

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

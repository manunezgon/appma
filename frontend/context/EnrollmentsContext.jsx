import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { API_BASE_URL, enrollmentsByDayUrl } from "../config/api";
import { useUser } from "./UserContext";

const EnrollmentsContext = createContext();

export const EnrollmentsProvider = ({ children }) => {
  const { user, token } = useUser();

  const [enrollments, setEnrollments] = useState([]);
  const [classStudentsByDay, setClassStudentsByDay] = useState({});
  const [loadingEnrollments, setLoadingEnrollments] = useState(false);

  const fetchMyEnrollments = useCallback(async () => {
    if (!token) return;

    try {
      const res = await fetch(`${API_BASE_URL}/enrollments/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        console.error("Error fetching enrollments");
        return;
      }

      const data = await res.json();
      setEnrollments(data);
    } catch (err) {
      console.error(err);
    }
  }, [token]);

  const normalizeEnrollments = (grouped) => {
    const byT = grouped.byTemplateId || {};
    const byE = grouped.byExceptionId || {};

    const result = {};

    Object.keys({ ...byT, ...byE }).forEach((key) => {
      const list = byT[key] || byE[key] || [];

      result[key] = list.map((s) => ({
        id: s.userId,
        name: s.userName,
        profileImageUrl: s.profileImageUrl || null,
      }));
    });

    return result;
  };

  const loadDayEnrollments = useCallback(
    async (date) => {
      if (!token) return;

      setLoadingEnrollments(true);

      try {
        const dateStr = date.toISOString().split("T")[0];

        const res = await fetch(enrollmentsByDayUrl(dateStr), {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Error fetching enrollments");

        const grouped = await res.json();

        setClassStudentsByDay(normalizeEnrollments(grouped));
      } catch (err) {
        console.error(err);
        setClassStudentsByDay({});
      } finally {
        setLoadingEnrollments(false);
      }
    },
    [token],
  );

  const enrollUser = async (scheduleTemplateId, date, exceptionId = null) => {
    if (!token) throw new Error("No user token found");

    const classKey = exceptionId || scheduleTemplateId;

    const optimisticStudent = {
      id: user.id,
      name: user.name,
      profileImageUrl: user.profileImageUrl || null,
    };

    setClassStudentsByDay((prev) => {
      const currentStudents = prev[classKey] || [];

      const alreadyExists = currentStudents.some((s) => s.id === user.id);

      if (alreadyExists) return prev;

      return {
        ...prev,
        [classKey]: [...currentStudents, optimisticStudent],
      };
    });

    try {
      const url = exceptionId
        ? `${API_BASE_URL}/enrollments/exception/${exceptionId}`
        : `${API_BASE_URL}/enrollments`;

      const body = exceptionId
        ? {}
        : {
            scheduleTemplateId,
            date: date.toISOString().split("T")[0],
          };

      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        let errorText;

        try {
          const data = await res.json();
          errorText = data?.error;
        } catch {
          errorText = await res.text();
        }

        throw new Error(errorText || "Error al inscribirse");
      }

      const enrollment = await res.json();

      setEnrollments((prev) => [...prev, enrollment]);

      return enrollment;
    } catch (err) {
      // rollback
      setClassStudentsByDay((prev) => ({
        ...prev,
        [classKey]: (prev[classKey] || []).filter((s) => s.id !== user.id),
      }));

      throw err;
    }
  };

  const deleteEnrollment = async (enrollmentId) => {
    if (!token) return;

    const res = await fetch(`${API_BASE_URL}/enrollments/${enrollmentId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) throw new Error("Error deleting enrollment");

    setEnrollments((prev) =>
      prev.filter(
        (e) => e.enrollmentId !== enrollmentId && e.id !== enrollmentId,
      ),
    );
  };

  useEffect(() => {
    fetchMyEnrollments();
  }, [token, fetchMyEnrollments]);

  return (
    <EnrollmentsContext.Provider
      value={{
        enrollments,
        fetchMyEnrollments,

        classStudentsByDay,
        loadingEnrollments,
        loadDayEnrollments,

        enrollUser,
        deleteEnrollment,
      }}
    >
      {children}
    </EnrollmentsContext.Provider>
  );
};

export const useEnrollments = () => useContext(EnrollmentsContext);

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  createEnrollmentRequest,
  createExceptionEnrollmentRequest,
  deleteEnrollmentRequest,
  getDayEnrollments,
  getMyEnrollments,
} from "../services/enrollmentsApi";
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
      const data = await getMyEnrollments(token);
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
        const grouped = await getDayEnrollments(date, token);

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
      const enrollment = exceptionId
        ? await createExceptionEnrollmentRequest(exceptionId, token)
        : await createEnrollmentRequest(scheduleTemplateId, date, token);

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

    await deleteEnrollmentRequest(enrollmentId, token);

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

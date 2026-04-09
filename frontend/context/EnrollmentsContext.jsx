import { createContext, useContext, useState, useEffect } from "react";
import { API_BASE_URL } from "../app/config";
import { useUser } from "./UserContext";

const EnrollmentsContext = createContext();

export const EnrollmentsProvider = ({ children }) => {
  const { token } = useUser();
  const [enrollments, setEnrollments] = useState([]); // 🟢 guardamos enrollments del usuario

  // --- Traer enrollments del usuario ---
  const fetchMyEnrollments = async () => {
    if (!token) return;

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
    setEnrollments(data); // guardamos en el state
  };

  // --- Traer todos los enrollments por clase ---
  const fetchClassEnrollments = async ({
  scheduleTemplateId = null,
  scheduleExceptionId = null,
  date,
}) => {
  if (!token) return [];

  const params = new URLSearchParams({
    date,
  });

  if (scheduleTemplateId) params.append("scheduleTemplateId", scheduleTemplateId);
  if (scheduleExceptionId) params.append("scheduleExceptionId", scheduleExceptionId);

  const res = await fetch(`${API_BASE_URL}/enrollments/class?${params}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    console.error("Error fetching class enrollments");
    return [];
  }

  const data = await res.json();

  return data.map((e) => ({
    id: e.userId,
    name: e.userName,
    profileImageUrl: e.profileImageUrl || null,
  }));
};

  // --- Función genérica para enroll ---
  const enrollUser = async (scheduleTemplateId, date, exceptionId = null) => {
    if (!token) throw new Error("No user token found");

    let url = exceptionId
      ? `${API_BASE_URL}/enrollments/exception/${exceptionId}`
      : `${API_BASE_URL}/enrollments`;

    let body = exceptionId
      ? {}
      : { scheduleTemplateId, date: date.toISOString().split("T")[0] };

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

    // 🔹 actualizar el state después de enroll
    setEnrollments((prev) => [...prev, enrollment]);

    return enrollment;
  };

  // --- Opcional: eliminar enrollment ---
  const deleteEnrollment = async (enrollmentId) => {
    if (!token) return;

    const res = await fetch(`${API_BASE_URL}/enrollments/${enrollmentId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) throw new Error("Error deleting enrollment");

    // 🔹 actualizar state
    setEnrollments((prev) =>
      prev.filter((e) => e.id !== enrollmentId)
    );
  };

  // 🔹 Traer enrollments al cargar el contexto
  useEffect(() => {
    fetchMyEnrollments();
  }, [token]);

  return (
    <EnrollmentsContext.Provider
      value={{ enrollments, fetchMyEnrollments, enrollUser, deleteEnrollment, fetchClassEnrollments }}
    >
      {children}
    </EnrollmentsContext.Provider>
  );
};

export const useEnrollments = () => useContext(EnrollmentsContext);
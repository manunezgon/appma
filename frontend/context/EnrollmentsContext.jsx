import { createContext, useContext } from "react";
import { API_BASE_URL } from "../app/config";
import { useUser } from "./UserContext";

const EnrollmentsContext = createContext();

export const EnrollmentsProvider = ({ children }) => {
  const { token } = useUser();

  // --- Función genérica para enroll ---
  const enrollUser = async (scheduleTemplateId, date, exceptionId = null) => {
    if (!token) throw new Error("No user token found");

    // Si es una clase normal, enviamos scheduleTemplateId + date
    // Si es exception, enviamos solo el exceptionId por la URL
    let url = exceptionId
      ? `${API_BASE_URL}/enrollments/exception/${exceptionId}`
      : `${API_BASE_URL}/enrollments`;

    let body = exceptionId
      ? {} // backend solo necesita path param
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
      // Intentamos leer JSON si existe, si no fallback a texto
      let errorText;
      try {
        const data = await res.json();
        errorText = data?.error;
      } catch {
        errorText = await res.text();
      }
      throw new Error(errorText || "Error al inscribirse");
    }

    return await res.json();
  };

  return (
    <EnrollmentsContext.Provider value={{ enrollUser }}>
      {children}
    </EnrollmentsContext.Provider>
  );
};

export const useEnrollments = () => useContext(EnrollmentsContext);
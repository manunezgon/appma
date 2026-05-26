import Constants from "expo-constants";

const host = Constants.expoConfig?.hostUri?.split(":")[0] 
             || "localhost";

export const API_BASE_URL = `http://${host}:8080`;

/** Inscritos por plantilla y por excepción para un día (una sola petición). */
export const enrollmentsByDayUrl = (dateStr) =>
  `${API_BASE_URL}/enrollments/by-day?date=${encodeURIComponent(dateStr)}`;

import Constants from "expo-constants";

const host = Constants.expoConfig?.hostUri?.split(":")[0] || "localhost";

export const API_BASE_URL = `http://${host}:8080`;

export const enrollmentsByDayUrl = (dateStr) =>
  `${API_BASE_URL}/enrollments/by-day?date=${encodeURIComponent(dateStr)}`;

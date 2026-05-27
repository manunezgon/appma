import { apiRequest } from "./apiClient";

export const getRanking = ({ selectedType, selectedLesson }, token) => {
  const lessonQuery = selectedLesson ? `?lessonId=${selectedLesson}` : "";

  return apiRequest(`/metrics/${selectedType}${lessonQuery}`, { token });
};

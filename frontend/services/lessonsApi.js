import { apiRequest } from "./apiClient";

export const getLessons = (token) => apiRequest("/lessons", { token });

export const createLessonRequest = (lessonData, token) =>
  apiRequest("/lessons/register", {
    method: "POST",
    token,
    body: JSON.stringify(lessonData),
  });

export const updateLessonRequest = (id, lessonData, token) =>
  apiRequest(`/lessons/${id}`, {
    method: "PUT",
    token,
    body: JSON.stringify(lessonData),
  });

export const deleteLessonRequest = (id, token) =>
  apiRequest(`/lessons/${id}`, {
    method: "DELETE",
    token,
  });

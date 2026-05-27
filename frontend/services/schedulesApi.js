import { apiRequest, toDateParam } from "./apiClient";

export const getSchedules = (token) =>
  apiRequest("/scheduleTemplates", { token });

export const createScheduleRequest = (scheduleData, token) =>
  apiRequest("/scheduleTemplates", {
    method: "POST",
    token,
    body: JSON.stringify(scheduleData),
  });

export const updateScheduleRequest = (id, scheduleData, token) =>
  apiRequest(`/scheduleTemplates/${id}`, {
    method: "PUT",
    token,
    body: JSON.stringify(scheduleData),
  });

export const deleteScheduleRequest = (id, token) =>
  apiRequest(`/scheduleTemplates/${id}`, {
    method: "DELETE",
    token,
  });

export const getSchedulesByDay = (date, token) =>
  apiRequest(`/scheduleTemplates/day?date=${toDateParam(date)}`, { token });

export const createScheduleExceptionRequest = (
  { lessonId = null, startTime, endTime, cancelled, date, description = null },
  token,
) =>
  apiRequest("/scheduleExceptions", {
    method: "POST",
    token,
    body: JSON.stringify({
      lessonId,
      startTime,
      endTime,
      cancelled,
      date: toDateParam(date),
      description,
    }),
  });

export const updateScheduleExceptionRequest = (id, dto, token) =>
  apiRequest(`/scheduleExceptions/${id}`, {
    method: "PUT",
    token,
    body: JSON.stringify({ ...dto, date: toDateParam(dto.date) }),
  });

import { apiRequest, toDateParam } from "./apiClient";

export const getMyEnrollments = (token) =>
  apiRequest("/enrollments/me", { token });

export const getDayEnrollments = (date, token) =>
  apiRequest(
    `/enrollments/by-day?date=${encodeURIComponent(toDateParam(date))}`,
    { token },
  );

export const createEnrollmentRequest = (
  scheduleTemplateId,
  date,
  token,
) =>
  apiRequest("/enrollments", {
    method: "POST",
    token,
    body: JSON.stringify({
      scheduleTemplateId,
      date: toDateParam(date),
    }),
  });

export const createExceptionEnrollmentRequest = (exceptionId, token) =>
  apiRequest(`/enrollments/exception/${exceptionId}`, {
    method: "POST",
    token,
    body: JSON.stringify({}),
  });

export const deleteEnrollmentRequest = (enrollmentId, token) =>
  apiRequest(`/enrollments/${enrollmentId}`, {
    method: "DELETE",
    token,
  });

export const getClassEnrollments = (classData, day, token) => {
  const dateStr = toDateParam(day);
  const query = classData.isException
    ? `scheduleExceptionId=${classData.id}`
    : `scheduleTemplateId=${classData.id}`;

  return apiRequest(`/enrollments/class?date=${dateStr}&${query}`, { token });
};

export const saveAttendanceRequest = (
  { selectedClass, selectedDay, presentUserIds },
  token,
) =>
  apiRequest("/enrollments/attendance", {
    method: "POST",
    token,
    body: JSON.stringify({
      date: toDateParam(selectedDay),
      presentUserIds,
      scheduleTemplateId: selectedClass.isException ? null : selectedClass.id,
      scheduleExceptionId: selectedClass.isException ? selectedClass.id : null,
    }),
  });

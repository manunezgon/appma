import { apiRequest } from "./apiClient";

export const getPaymentsByUser = (userId, token) =>
  apiRequest(`/payments/user/${userId}`, { token });

export const deletePaymentRequest = (paymentId, token) =>
  apiRequest(`/payments/${paymentId}`, {
    method: "DELETE",
    token,
  });

export const registerPaymentRequest = (
  { userId, lessonId, monthPaid, isGlobal },
  token,
) =>
  apiRequest("/payments/register", {
    method: "POST",
    token,
    body: JSON.stringify({
      userId,
      monthPaid,
      type: isGlobal ? "GLOBAL" : "LESSON",
      ...(isGlobal ? {} : { lessonId }),
    }),
  });

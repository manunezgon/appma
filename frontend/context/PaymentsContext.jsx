import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { Alert } from "react-native";
import { API_BASE_URL } from "../config/api";
import { useUser } from "./UserContext";

const PaymentsContext = createContext();

export const PaymentsProvider = ({ children }) => {
  const { token } = useUser();

  const [payments, setPayments] = useState([]);
  const [loadingPayments, setLoadingPayments] = useState(false);
  const [registeringPayment, setRegisteringPayment] = useState(false);

  const fetchPaymentsByUser = useCallback(async (userId) => {
    if (!token) return;

    try {
      setLoadingPayments(true);

      const response = await fetch(`${API_BASE_URL}/payments/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Error cargando pagos");

      const data = await response.json();
      setPayments(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingPayments(false);
    }
  }, [token]);

  const deletePayment = useCallback(async (paymentId, userId) => {
    if (!token) return;

    try {
      const response = await fetch(`${API_BASE_URL}/payments/${paymentId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Error eliminando pago");

      await fetchPaymentsByUser(userId);
    } catch (err) {
      console.error(err);
      Alert.alert("Error eliminando pago");
    }
  }, [fetchPaymentsByUser, token]);

  const registerPayment = useCallback(async ({ userId, lessonId, monthPaid, isGlobal }) => {
    if (!token) return;

    if (!monthPaid) {
      Alert.alert("Selecciona un mes");
      return;
    }

    try {
      setRegisteringPayment(true);

      const payload = {
        userId,
        monthPaid,
        type: isGlobal ? "GLOBAL" : "LESSON",
        ...(isGlobal ? {} : { lessonId }),
      };

      const response = await fetch(`${API_BASE_URL}/payments/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Error registering payment:", errorData);
        throw new Error("Error registrando pago");
      }

      Alert.alert("Pago registrado correctamente");

      await fetchPaymentsByUser(userId);
    } catch (err) {
      console.error(err);
      Alert.alert("Error registrando pago");
    } finally {
      setRegisteringPayment(false);
    }
  }, [fetchPaymentsByUser, token]);

  const value = useMemo(
    () => ({
      payments,
      loadingPayments,
      registeringPayment,
      fetchPaymentsByUser,
      deletePayment,
      registerPayment,
    }),
    [
      deletePayment,
      fetchPaymentsByUser,
      loadingPayments,
      payments,
      registerPayment,
      registeringPayment,
    ],
  );

  return (
    <PaymentsContext.Provider value={value}>
      {children}
    </PaymentsContext.Provider>
  );
};

export const usePayments = () => useContext(PaymentsContext);

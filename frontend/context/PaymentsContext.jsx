import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { Alert } from "react-native";
import {
  deletePaymentRequest,
  getPaymentsByUser,
  registerPaymentRequest,
} from "../services/paymentsApi";
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

      const data = await getPaymentsByUser(userId, token);
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
      await deletePaymentRequest(paymentId, token);
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

      await registerPaymentRequest({ userId, lessonId, monthPaid, isGlobal }, token);

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

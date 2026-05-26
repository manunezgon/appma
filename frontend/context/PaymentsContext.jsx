import { createContext, useContext, useState } from "react";
import { Alert } from "react-native";
import { API_BASE_URL } from "../app/config";
import { useUser } from "./UserContext";

const PaymentsContext = createContext();

export const PaymentsProvider = ({ children }) => {
  const { user, token } = useUser();

  const [payments, setPayments] = useState([]);
  const [loadingPayments, setLoadingPayments] = useState(false);
  const [registeringPayment, setRegisteringPayment] = useState(false);

  const fetchPaymentsByUser = async (userId) => {
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
  };

  const deletePayment = async (paymentId, userId) => {
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
  };

  const registerPayment = async ({ userId, lessonId, monthPaid, isGlobal }) => {
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
  };

  return (
    <PaymentsContext.Provider
      value={{
        payments,
        loadingPayments,
        registeringPayment,
        fetchPaymentsByUser,
        deletePayment,
        registerPayment,
      }}
    >
      {children}
    </PaymentsContext.Provider>
  );
};

export const usePayments = () => useContext(PaymentsContext);

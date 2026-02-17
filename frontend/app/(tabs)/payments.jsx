import React, { useEffect, useState, useCallback } from "react";
import { View, Text, Button, FlatList, ActivityIndicator, Alert, Linking } from "react-native";
import { API_BASE_URL } from "../config";
import { useUser } from '../../context/usercontext';



export default function Payments({ route }) {
  const [loading, setLoading] = useState(false);
  const [payments, setPayments] = useState([]);
  const [checking, setChecking] = useState(false);
  const [polling, setPolling] = useState(false);

  const { user, setUser, logout, token } = useUser();

  const fetchPayments = useCallback(async () => {
    try {
      setLoading(true);
      const resp = await fetch(`${API_BASE_URL}/payments/user/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!resp.ok) throw new Error("Error fetching payments");
      const data = await resp.json();
      setPayments(data);
    } catch (e) {
      console.error(e);
      Alert.alert("Error", "No se pudieron obtener los pagos");
    } finally {
      setLoading(false);
    }
  }, [user.id, token]);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  // Lanza checkout y devuelve checkoutUrl, sessionId y paymentId
  async function startCheckout(paymentTypeId = 1) {
    try {
      setChecking(true);

      // body x-www-form-urlencoded
      const body = new URLSearchParams();
      body.append("paymentTypeId", String(paymentTypeId));

      const resp = await fetch(`${API_BASE_URL}/stripe/checkout?paymentTypeId=${paymentTypeId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/x-www-form-urlencoded"
        },
        // si tu endpoint coge param por query, no necesitas body. Si espera form, usa body.
        // body: body.toString()
      });

      if (!resp.ok) {
        const txt = await resp.text();
        throw new Error(`Checkout error: ${txt}`);
      }

      const { checkoutUrl, sessionId, paymentId } = await resp.json();

      // Abrir el checkout en navegador
      const supported = await Linking.canOpenURL(checkoutUrl);
      if (!supported) {
        Alert.alert("No se puede abrir el navegador", checkoutUrl);
        return;
      }
      Linking.openURL(checkoutUrl);

      // Inicia el polling para comprobar estado
      pollPayment(paymentId, 20, 2000); // 20 intentos, 2s intervalo
    } catch (e) {
      console.error(e);
      Alert.alert("Error", e.message || "Error durante checkout");
    } finally {
      setChecking(false);
    }
  }

  // Polling: consulta el estado del paymentId hasta que sea succeeded/expired o timeout
  async function pollPayment(paymentId, maxAttempts = 30, intervalMs = 2000) {
    setPolling(true);
    for (let i = 0; i < maxAttempts; i++) {
      try {
        const r = await fetch(`${API_BASE_URL}/stripe/payment/${paymentId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (r.ok) {
          const json = await r.json();
          const status = json.stripeStatus;
          if (status === "succeeded") {
            setPolling(false);
            Alert.alert("Pago completado", "Gracias, el pago se ha procesado correctamente.");
            await fetchPayments(); // refresca tabla
            return;
          } else if (status === "expired" || status === "failed") {
            setPolling(false);
            Alert.alert("Pago no completado", `Estado: ${status}`);
            return;
          }
        } else {
          console.warn("Error checking payment status", await r.text());
        }
      } catch (err) {
        console.warn("Polling error", err.message);
      }
      await new Promise(res => setTimeout(res, intervalMs));
    }
    setPolling(false);
    Alert.alert("Tiempo agotado", "No se confirmó el pago en el tiempo esperado.");
  }

  // Render de item (pagos)
  const renderItem = ({ item }) => {
    // item.monthPaid puede venir como string "2025-11" o como objeto; ajústalo
    return (
      <View style={{ padding: 10, borderBottomWidth: 1 }}>
        <Text>Mes: {item.monthPaid ?? "—"}</Text>
        <Text>Cantidad: {item.amountPaid ?? "—"} €</Text>
        <Text>Estado: {item.stripeStatus ?? "pending"}</Text>
      </View>
    );
  };

  // Si no hay pagos -> mostrar Pendiente y botón
  const noPayments = payments.length === 0;

return (
  <View style={{ flex: 1, padding: 16 }}>
    <Text style={{ fontSize: 20, marginBottom: 16 }}>Pagos</Text>

    {loading ? <ActivityIndicator /> : (
      <>
        {/* Lista de pagos si existen */}
        {payments.length > 0 && (
          <>
            <FlatList
              data={payments}
              keyExtractor={item => String(item.id)}
              renderItem={renderItem}
            />
            <View style={{ marginTop: 12 }}>
              <Button title="Refrescar" onPress={fetchPayments} />
            </View>
          </>
        )}

        {/* BOTÓN PAGAR — SIEMPRE VISIBLE */}
        <View style={{ marginTop: 30, alignItems: "center" }}>
          <Button
            title={checking ? "Abriendo pago..." : "Pagar ahora"}
            onPress={() => startCheckout(1)}
            disabled={checking}
          />
        </View>

        {/* Estado de espera mientras el pago vuelve */}
        {polling && (
          <View style={{ marginTop: 12 }}>
            <Text>Esperando confirmación del pago...</Text>
            <ActivityIndicator/>
          </View>
        )}
      </>
    )}
  </View>
);

}

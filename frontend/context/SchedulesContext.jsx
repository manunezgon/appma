// SchedulesContext.js
import { createContext, useContext, useEffect, useState } from "react";
import { API_BASE_URL } from "../app/config"; // <- importamos directo
import { useUser } from "./UserContext";

const SchedulesContext = createContext();

export const SchedulesProvider = ({ children }) => {
  const { token } = useUser(); // usamos el token del user context
  const [schedules, setSchedules] = useState([]);
  const [loadingSchedules, setLoadingSchedules] = useState(false);

  const fetchSchedules = async () => {
    setLoadingSchedules(true);
    try {
      const res = await fetch(`${API_BASE_URL}/scheduleTemplates`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setSchedules(data);
      }
    } finally {
      setLoadingSchedules(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchSchedules();
    }
  }, [token]);

  const createSchedule = async (scheduleData) => {
    const res = await fetch(`${API_BASE_URL}/scheduleTemplates`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(scheduleData),
    });

    if (res.ok) {
      await fetchSchedules();
    } else {
      throw new Error("Error creando horario");
    }
  };

  const updateSchedule = async (id, scheduleData) => {
    const res = await fetch(`${API_BASE_URL}/scheduleTemplates/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(scheduleData),
    });

    if (res.ok) {
      await fetchSchedules();
    } else {
      throw new Error("Error actualizando horario");
    }
  };

  const deleteSchedule = async (id) => {
    const res = await fetch(`${API_BASE_URL}/scheduleTemplates/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) {
      await fetchSchedules();
    } else {
      throw new Error("Error eliminando horario");
    }
  };

  return (
    <SchedulesContext.Provider
      value={{
        schedules,
        loadingSchedules,
        fetchSchedules,
        createSchedule,
        updateSchedule,
        deleteSchedule,
      }}
    >
      {children}
    </SchedulesContext.Provider>
  );
};

export const useSchedules = () => useContext(SchedulesContext);

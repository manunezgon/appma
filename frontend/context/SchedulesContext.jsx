import { createContext, useContext, useEffect, useState } from "react";
import { API_BASE_URL } from "../app/config";
import { useUser } from "./UserContext";

const SchedulesContext = createContext();

const authFetch = async (url, options = {}, token) => {
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Request failed");
  }
  return res.json();
};

export const SchedulesProvider = ({ children }) => {
  const { token } = useUser();
  const [schedules, setSchedules] = useState([]);
  const [loadingSchedules, setLoadingSchedules] = useState(false);

  const fetchSchedules = async () => {
    if (!token) return;
    setLoadingSchedules(true);
    try {
      const data = await authFetch(`${API_BASE_URL}/scheduleTemplates`, {}, token);
      setSchedules(data);
    } catch (err) {
      console.error("Error fetching schedules:", err);
      setSchedules([]);
    } finally {
      setLoadingSchedules(false);
    }
  };

  useEffect(() => {
    if (token) fetchSchedules();
    else setSchedules([]);
  }, [token]);

  const createSchedule = async (scheduleData) => {
    await authFetch(`${API_BASE_URL}/scheduleTemplates`, {
      method: "POST",
      body: JSON.stringify(scheduleData),
    }, token);
    await fetchSchedules();
  };

  const updateSchedule = async (id, scheduleData) => {
    await authFetch(`${API_BASE_URL}/scheduleTemplates/${id}`, {
      method: "PUT",
      body: JSON.stringify(scheduleData),
    }, token);
    await fetchSchedules();
  };

  const deleteSchedule = async (id) => {
    await authFetch(`${API_BASE_URL}/scheduleTemplates/${id}`, {
      method: "DELETE",
    }, token);
    await fetchSchedules();
  };

  return (
    <SchedulesContext.Provider value={{
      schedules,
      loadingSchedules,
      fetchSchedules,
      createSchedule,
      updateSchedule,
      deleteSchedule,
    }}>
      {children}
    </SchedulesContext.Provider>
  );
};

export const useSchedules = () => useContext(SchedulesContext);
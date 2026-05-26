import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
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
    console.error("Backend error text:", text);
    throw new Error(text || "Request failed");
  }

  const text = await res.text();
  try {
    return text ? JSON.parse(text) : null;
  } catch (err) {
    console.warn("Failed to parse JSON:", err);
    return null;
  }
};

export const SchedulesProvider = ({ children }) => {
  const { token } = useUser();
  const [schedules, setSchedules] = useState([]);
  const [daySchedules, setDaySchedules] = useState([]);
  const [loadingSchedules, setLoadingSchedules] = useState(false);

  const fetchSchedules = async () => {
    if (!token) return;
    setLoadingSchedules(true);
    try {
      const data = await authFetch(
        `${API_BASE_URL}/scheduleTemplates`,
        {},
        token,
      );
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
    await authFetch(
      `${API_BASE_URL}/scheduleTemplates`,
      { method: "POST", body: JSON.stringify(scheduleData) },
      token,
    );
    await fetchSchedules();
  };

  const updateSchedule = async (id, scheduleData) => {
    await authFetch(
      `${API_BASE_URL}/scheduleTemplates/${id}`,
      { method: "PUT", body: JSON.stringify(scheduleData) },
      token,
    );
    await fetchSchedules();
  };

  const deleteSchedule = async (id) => {
    await authFetch(
      `${API_BASE_URL}/scheduleTemplates/${id}`,
      { method: "DELETE" },
      token,
    );
    await fetchSchedules();
  };

  const fetchSchedulesByDay = useCallback(
    async (date) => {
      if (!token) return;
      try {
        const dateStr = date.toISOString().split("T")[0];
        const data = await authFetch(
          `${API_BASE_URL}/scheduleTemplates/day?date=${dateStr}`,
          {},
          token,
        );
        setDaySchedules(data);
      } catch (err) {
        console.error("Error fetching schedules for the day:", err);
        setDaySchedules([]);
      }
    },
    [token],
  );

  const createScheduleException = async ({
    lessonId = null,
    startTime,
    endTime,
    cancelled,
    date,
    description = null,
  }) => {
    if (!token) return;
    try {
      const dateStr = date.toISOString().split("T")[0];
      await authFetch(
        `${API_BASE_URL}/scheduleExceptions`,
        {
          method: "POST",
          body: JSON.stringify({
            lessonId,
            startTime,
            endTime,
            cancelled,
            date: dateStr,
            description,
          }),
        },
        token,
      );
    } catch (err) {
      console.error("Error creating schedule exception:", err);
      throw err;
    }
  };

  const updateScheduleException = async (id, dto) => {
    if (!token) return;
    try {
      const dateStr = dto.date.toISOString().split("T")[0];
      await authFetch(
        `${API_BASE_URL}/scheduleExceptions/${id}`,
        {
          method: "PUT",
          body: JSON.stringify({ ...dto, date: dateStr }),
        },
        token,
      );
    } catch (err) {
      console.error("Error updating schedule exception:", err);
      throw err;
    }
  };

  return (
    <SchedulesContext.Provider
      value={{
        schedules,
        daySchedules,
        fetchSchedules,
        fetchSchedulesByDay,
        createSchedule,
        updateSchedule,
        deleteSchedule,
        createScheduleException,
        loadingSchedules,
        updateScheduleException,
      }}
    >
      {children}
    </SchedulesContext.Provider>
  );
};

export const useSchedules = () => useContext(SchedulesContext);

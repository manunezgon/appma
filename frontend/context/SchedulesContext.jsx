import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  createScheduleExceptionRequest,
  createScheduleRequest,
  deleteScheduleRequest,
  getSchedules,
  getSchedulesByDay,
  updateScheduleExceptionRequest,
  updateScheduleRequest,
} from "../services/schedulesApi";
import { useUser } from "./UserContext";

const SchedulesContext = createContext();

export const SchedulesProvider = ({ children }) => {
  const { token } = useUser();
  const [schedules, setSchedules] = useState([]);
  const [daySchedules, setDaySchedules] = useState([]);
  const [loadingSchedules, setLoadingSchedules] = useState(false);

  const fetchSchedules = useCallback(async () => {
    if (!token) return;
    setLoadingSchedules(true);
    try {
      const data = await getSchedules(token);
      setSchedules(data);
    } catch (err) {
      console.error("Error fetching schedules:", err);
      setSchedules([]);
    } finally {
      setLoadingSchedules(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) fetchSchedules();
    else setSchedules([]);
  }, [fetchSchedules, token]);

  const createSchedule = useCallback(async (scheduleData) => {
    await createScheduleRequest(scheduleData, token);
    await fetchSchedules();
  }, [fetchSchedules, token]);

  const updateSchedule = useCallback(async (id, scheduleData) => {
    await updateScheduleRequest(id, scheduleData, token);
    await fetchSchedules();
  }, [fetchSchedules, token]);

  const deleteSchedule = useCallback(async (id) => {
    await deleteScheduleRequest(id, token);
    await fetchSchedules();
  }, [fetchSchedules, token]);

  const fetchSchedulesByDay = useCallback(
    async (date) => {
      if (!token) return;
      try {
        const data = await getSchedulesByDay(date, token);
        setDaySchedules(data);
      } catch (err) {
        console.error("Error fetching schedules for the day:", err);
        setDaySchedules([]);
      }
    },
    [token],
  );

  const createScheduleException = useCallback(async ({
    lessonId = null,
    startTime,
    endTime,
    cancelled,
    date,
    description = null,
  }) => {
    if (!token) return;
    try {
      await createScheduleExceptionRequest(
        { lessonId, startTime, endTime, cancelled, date, description },
        token,
      );
    } catch (err) {
      console.error("Error creating schedule exception:", err);
      throw err;
    }
  }, [token]);

  const updateScheduleException = useCallback(async (id, dto) => {
    if (!token) return;
    try {
      await updateScheduleExceptionRequest(id, dto, token);
    } catch (err) {
      console.error("Error updating schedule exception:", err);
      throw err;
    }
  }, [token]);

  const value = useMemo(
    () => ({
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
    }),
    [
      createSchedule,
      createScheduleException,
      daySchedules,
      deleteSchedule,
      fetchSchedules,
      fetchSchedulesByDay,
      loadingSchedules,
      schedules,
      updateSchedule,
      updateScheduleException,
    ],
  );

  return (
    <SchedulesContext.Provider value={value}>
      {children}
    </SchedulesContext.Provider>
  );
};

export const useSchedules = () => useContext(SchedulesContext);

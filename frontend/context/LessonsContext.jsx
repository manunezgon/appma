import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  createLessonRequest,
  deleteLessonRequest,
  getLessons,
  updateLessonRequest,
} from "../services/lessonsApi";
import { useUser } from "./UserContext";

const LessonsContext = createContext();

export const LessonsProvider = ({ children }) => {
  const { token } = useUser();
  const [lessons, setLessons] = useState([]);
  const [loadingLessons, setLoadingLessons] = useState(false);

  const fetchLessons = useCallback(async () => {
    if (!token) return;
    setLoadingLessons(true);
    try {
      const data = await getLessons(token);
      setLessons(data);
    } catch (err) {
      console.error("Error fetching lessons:", err);
      setLessons([]);
    } finally {
      setLoadingLessons(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) fetchLessons();
    else setLessons([]);
  }, [fetchLessons, token]);

  const createLesson = useCallback(async (lessonData) => {
    const createdLesson = await createLessonRequest(lessonData, token);
    await fetchLessons();
    return createdLesson;
  }, [fetchLessons, token]);

  const updateLesson = useCallback(async (id, lessonData) => {
    await updateLessonRequest(id, lessonData, token);
    await fetchLessons();
  }, [fetchLessons, token]);

  const deleteLesson = useCallback(async (id) => {
    await deleteLessonRequest(id, token);
    await fetchLessons();
  }, [fetchLessons, token]);

  const value = useMemo(
    () => ({
      lessons,
      loadingLessons,
      fetchLessons,
      createLesson,
      updateLesson,
      deleteLesson,
    }),
    [
      createLesson,
      deleteLesson,
      fetchLessons,
      lessons,
      loadingLessons,
      updateLesson,
    ],
  );

  return (
    <LessonsContext.Provider value={value}>
      {children}
    </LessonsContext.Provider>
  );
};

export const useLessons = () => useContext(LessonsContext);

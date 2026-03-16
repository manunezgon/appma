import { createContext, useContext, useEffect, useState } from "react";
import { API_BASE_URL } from "../app/config";
import { useUser } from "./UserContext";

const LessonsContext = createContext();

// Helper for authenticated fetch
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

  const text = await res.text();
  try {
    return text ? JSON.parse(text) : null;
  } catch (err) {
    console.warn("Failed to parse JSON:", err);
    return null;
  }
};

export const LessonsProvider = ({ children }) => {
  const { token } = useUser();
  const [lessons, setLessons] = useState([]);
  const [loadingLessons, setLoadingLessons] = useState(false);

  const fetchLessons = async () => {
    if (!token) return;
    setLoadingLessons(true);
    try {
      const data = await authFetch(`${API_BASE_URL}/lessons`, {}, token);
      setLessons(data);
    } catch (err) {
      console.error("Error fetching lessons:", err);
      setLessons([]);
    } finally {
      setLoadingLessons(false);
    }
  };

  useEffect(() => {
    if (token) fetchLessons();
    else setLessons([]);
  }, [token]);

  const createLesson = async (lessonData) => {
    const createdLesson = await authFetch(
      `${API_BASE_URL}/lessons/register`,
      {
        method: "POST",
        body: JSON.stringify(lessonData),
      },
      token,
    );
    await fetchLessons();
    return createdLesson;
  };

  const updateLesson = async (id, lessonData) => {
    await authFetch(
      `${API_BASE_URL}/lessons/${id}`,
      {
        method: "PUT",
        body: JSON.stringify(lessonData),
      },
      token,
    );
    await fetchLessons();
  };

  const deleteLesson = async (id) => {
    await authFetch(
      `${API_BASE_URL}/lessons/${id}`,
      { method: "DELETE" },
      token,
    );
    await fetchLessons();
  };

  return (
    <LessonsContext.Provider
      value={{
        lessons,
        loadingLessons,
        fetchLessons,
        createLesson,
        updateLesson,
        deleteLesson,
      }}
    >
      {children}
    </LessonsContext.Provider>
  );
};

export const useLessons = () => useContext(LessonsContext);

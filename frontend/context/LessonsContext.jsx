// LessonsContext.js
import { createContext, useContext, useEffect, useState } from "react";
import { API_BASE_URL } from "../app/config"; // <- importamos directo
import { useUser } from "./UserContext";

const LessonsContext = createContext();

export const LessonsProvider = ({ children }) => {
  const { token } = useUser(); // usamos el token del contexto de usuario
  const [lessons, setLessons] = useState([]);
  const [loadingLessons, setLoadingLessons] = useState(false);

  const fetchLessons = async () => {
    if (!token) return; // 🔹 previene llamadas sin token
    setLoadingLessons(true);
    try {
      const res = await fetch(`${API_BASE_URL}/lessons`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setLessons(data);
      }
    } finally {
      setLoadingLessons(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchLessons();
    }
  }, [token]);

  const createLesson = async (lessonData) => {
    const res = await fetch(`${API_BASE_URL}/lessons/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(lessonData),
    });

    if (res.ok) {
      const createdLesson = await res.json();
      await fetchLessons();
      return createdLesson;
    }

    throw new Error("Error creando lesson");
  };

  const updateLesson = async (id, lessonData) => {
    const res = await fetch(`${API_BASE_URL}/lessons/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(lessonData),
    });

    if (res.ok) {
      await fetchLessons();
    } else {
      throw new Error("Error actualizando lesson");
    }
  };

  const deleteLesson = async (id) => {
    const res = await fetch(`${API_BASE_URL}/lessons/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) {
      await fetchLessons();
    } else {
      throw new Error("Error eliminando lesson");
    }
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

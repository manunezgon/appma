import { createContext, useContext } from "react";
import { API_BASE_URL } from "../app/config";
import { useUser } from "./UserContext";

const EnrollmentsContext = createContext();

export const EnrollmentsProvider = ({ children }) => {
  const { token } = useUser();

  const enrollUser = async (scheduleTemplateId, date) => {
    if (!token) throw new Error("No user token found");

    const dateStr = date.toISOString().split("T")[0];

    const res = await fetch(`${API_BASE_URL}/enrollments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ scheduleTemplateId, date: dateStr }),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || "Failed to enroll");
    }

    return await res.json();
  };

  return (
    <EnrollmentsContext.Provider value={{ enrollUser }}>
      {children}
    </EnrollmentsContext.Provider>
  );
};

export const useEnrollments = () => useContext(EnrollmentsContext);
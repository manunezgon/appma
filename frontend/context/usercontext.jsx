"use client";

import * as SecureStore from "expo-secure-store";
import { createContext, useContext, useEffect, useState } from "react";
import { API_BASE_URL } from "../app/config";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = await SecureStore.getItemAsync("userToken");
        if (token) {
          const res = await fetch(`${API_BASE_URL}/users/me`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res.ok) {
            const userData = await res.json();
            setUser({ ...userData, token });
          } else {
            await SecureStore.deleteItemAsync("userToken");
            setUser(null);
          }
        }
      } catch (err) {
        console.error("Error loading user:", err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (userData) => {
    setUser(userData);
    await SecureStore.setItemAsync("userToken", userData.token);
  };

  const logout = async () => {
    setUser(null);
    await SecureStore.deleteItemAsync("userToken");
  };

  const updateProfileImage = async (file) => {
    if (!user?.id || !user?.token) return;

    const formData = new FormData();
    formData.append("file", {
      uri: file.uri,
      name: "profile.jpg",
      type: "image/jpeg",
    });

    try {
      const res = await fetch(
        `${API_BASE_URL}/users/${user.id}/upload-image`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "multipart/form-data",
          },
          body: formData,
        },
      );

      if (!res.ok) {
        console.error("Error uploading profile image");
        return;
      }

      const data = await res.json();
      setUser((prev) => ({ ...prev, profileImageUrl: data.url }));
    } catch (err) {
      console.error("Error uploading profile image:", err);
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        token: user?.token || null,
        login,
        logout,
        loading,
        setUser,
        updateProfileImage
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within a UserProvider");
  return context;
};

"use client";

import * as SecureStore from "expo-secure-store";
import { createContext, useContext, useEffect, useState } from "react";
import { API_BASE_URL } from "../app/config";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedToken = await SecureStore.getItemAsync("userToken");

        if (!storedToken) {
          setLoading(false);
          return;
        }

        const res = await fetch(`${API_BASE_URL}/users/me`, {
          headers: { Authorization: `Bearer ${storedToken}` },
        });

        if (!res.ok) {
          await SecureStore.deleteItemAsync("userToken");
          setUser(null);
          setToken(null);
          return;
        }

        const userData = await res.json();

        setUser(userData);
        setToken(storedToken);
      } catch (err) {
        console.error("Error loading user:", err);
        setUser(null);
        setToken(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async ({ user, token }) => {
    await SecureStore.setItemAsync("userToken", token);
    setUser(user);
    setToken(token);
  };

  const logout = async () => {
    setUser(null);
    setToken(null);
    await SecureStore.deleteItemAsync("userToken");
  };

  const updateProfileImage = async (file) => {
    if (!user?.id || !token) return;

    const formData = new FormData();
    formData.append("file", {
      uri: file.uri,
      name: "profile.jpg",
      type: "image/jpeg",
    });

    try {
      const res = await fetch(`${API_BASE_URL}/users/${user.id}/upload-image`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
        body: formData,
      });

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
        token,
        login,
        logout,
        loading,
        updateProfileImage,
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

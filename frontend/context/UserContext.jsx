"use client";

import * as SecureStore from "expo-secure-store";
import { createContext, useContext, useEffect, useState } from "react";
import {
  getCurrentUser,
  uploadProfileImageRequest,
} from "../services/usersApi";

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

        try {
          const userData = await getCurrentUser(storedToken);
          setUser(userData);
          setToken(storedToken);
        } catch {
          await SecureStore.deleteItemAsync("userToken");
          setUser(null);
          setToken(null);
        }
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

    try {
      const data = await uploadProfileImageRequest(user.id, file, token);
      setUser((prev) => ({ ...prev, profileImageUrl: data.url }));
    } catch (err) {
      console.error("Error uploading profile image:", err);
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
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

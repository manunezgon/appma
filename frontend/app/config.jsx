import Constants from "expo-constants";

// Extrae la IP del host en Expo Go (solo desarrollo)
const host = Constants.expoConfig?.hostUri?.split(":")[0] 
             || "localhost";

export const API_BASE_URL = `http://${host}:8080`;

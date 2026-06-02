import Constants from "expo-constants";

const host = Constants.expoConfig?.hostUri?.split(":")[0] || "localhost";

//export const API_BASE_URL = `http://${host}:8080`;

// config.js o .env
export const API_BASE_URL = 'https://appma-dev.up.railway.app';
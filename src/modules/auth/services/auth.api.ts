// auth.api.ts
import axios from "axios";

const API_URL =
  (import.meta as ImportMeta & { env?: { VITE_API_URL?: string } }).env
    ?.VITE_API_URL || "http://localhost:3000/api";

export const login = async (email: string, password: string) => {
  const response = await axios.post(`${API_URL}/auth/login`, { email, password }, {
    withCredentials: true // 👈 importante si usas cookies/sesiones
  });
  console.log("🔑 Token recibido:", response.data.token);
  return response.data;
};

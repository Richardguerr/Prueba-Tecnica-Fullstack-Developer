import axios from "axios";
import { UserUpdate } from "../types/types";

// Obtener la URL base desde las variables de entorno
const API_URL = process.env.REACT_APP_USERS_API || "http://localhost:8001/users";

if (!API_URL) {
  throw new Error("❌ API_URL no está definida en las variables de entorno.");
}

// Actualizar usuario
export const updateUser = async (userData: UserUpdate, token: string) => {
  const response = await axios.put(`${API_URL}/updateuser`, userData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Eliminar usuario
export const deleteUser = async (token: string) => {
  const response = await axios.delete(`${API_URL}/deleteuser`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Obtener información del usuario
export const getUserInfo = async (token: string) => {
  const response = await axios.get(`${API_URL}/getToken`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  console.log(response.data);
  return response.data;
};

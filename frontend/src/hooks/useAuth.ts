import { useState, useEffect } from "react";
import { getUserInfo } from "../services/userService";
import { User } from "../types/types";
import { useNavigate } from "react-router-dom";
import alertify from "alertifyjs";
import { jwtDecode } from "jwt-decode";

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [token, setToken] = useState<string | null>(() => localStorage.getItem("token"));
  const navigate = useNavigate();

  useEffect(() => {
    const syncAuth = () => {
      const storedToken = localStorage.getItem("token");
      setToken(storedToken);
      
      const storedUser = localStorage.getItem("user");
      setUser(storedUser ? JSON.parse(storedUser) : null);
    };

    window.addEventListener("storage", syncAuth);
    return () => window.removeEventListener("storage", syncAuth);
  }, []);

  useEffect(() => {
    if (token) {
      try {
        const decoded: { exp: number } = jwtDecode(token);
        const now = Date.now() / 1000;

        if (decoded.exp < now) {
          console.warn("Token expirado, cerrando sesión...");
          logout();
          return;
        }
      } catch (error) {
        console.error("Error al decodificar el token", error);
        logout();
        return;
      }
    }

    if (token && !user) {
      getUserInfo(token)
        .then((userData) => {
          setUser(userData);
          localStorage.setItem("user", JSON.stringify(userData));
        })
        .catch(() => {
          logout(); // Si falla obtener el usuario, cerramos sesión
        });
    }
  }, [token]);

  const login = (userData: User, authToken: string) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem("token", authToken);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    alertify.error("Sesión expirada. Inicia sesión nuevamente.");
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setTimeout(() => {
      navigate("/login");
    }, 500);
  };

  return { user, token, setUser, login, logout };
};

import { ReactNode, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import alertify from "alertifyjs";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: ReactNode;
}

const CHECK_INTERVAL = 10000; // 10 segundos

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, token, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) return;

    const checkTokenExpiration = () => {
      try {
        const decoded: { exp: number } = jwtDecode(token);
        const now = Date.now() / 1000;

        if (decoded.exp < now) {
          console.warn("Token expirado, cerrando sesión...");
          alertify.error("Sesión expirada, inicia sesión nuevamente.");
          logout();
          navigate("/login", { state: { from: location }, replace: true });
        }
      } catch (error) {
        console.error("Error al decodificar el token", error);
        logout();
        navigate("/login", { state: { from: location }, replace: true });
      }
    };

    checkTokenExpiration(); // Verificamos al montar
    const interval = setInterval(checkTokenExpiration, CHECK_INTERVAL); // Verificamos cada 10s

    return () => clearInterval(interval); // Limpiamos el intervalo cuando el componente se desmonta
  }, [token, navigate, location]);

  if (!user || !token) {
    alertify.error("Sesión expirada, inicia sesión nuevamente.");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;

import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import AuthForm from "./pages/AuthForm";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Posts from "./pages/Posts";
import ResetPassword from "./pages/ResetPassword";
import ContactPage from "./pages/ContactPage";
import { useAuth } from "./hooks/useAuth";

export default function App() {
  const { user, token } = useAuth();

  return (
    <Routes>
      {/* Página de login y registro */}
      <Route path="/login" element={user && token ? <Navigate to="/posts" /> : <AuthForm />} />

      {/* Ruta principal redirige a /posts si el usuario está autenticado */}
      <Route path="/" element={<Navigate to={user && token ? "/posts" : "/login"} />} />

      {/* Rutas protegidas */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/posts"
        element={
          <ProtectedRoute>
            <Posts />
          </ProtectedRoute>
        }
      />

      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route path="/contact" element={<ContactPage />} />

      {/* Si la ruta no existe, redirige al login o posts si ya está autenticado */}
      <Route path="*" element={<Navigate to={user && token ? "/posts" : "/login"} />} />
    </Routes>
  );
}

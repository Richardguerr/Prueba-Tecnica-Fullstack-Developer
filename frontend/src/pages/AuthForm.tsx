import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import axios from "axios";
import alertify from "alertifyjs";
import "alertifyjs/build/css/alertify.min.css";
import { User } from "../types/types";
import { getUserInfo } from "../services/userService";

interface FormData {
  name?: string;
  email: string;
  password: string;
}

const API_URL = process.env.REACT_APP_USERS_API || "http://localhost:8001/users";

export default function AuthForm() {
  const [isRegister, setIsRegister] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>();
  const navigate = useNavigate();
  const { login } = useAuth(); // Importa login de useAuth

  const onSubmit = async (data: FormData) => {
    if (isForgotPassword) {
      try {
        await axios.post(`${API_URL}/forgot-password`, { email: data.email });
        alertify.success("Revisa tu correo para restablecer tu contraseña");
        reset();
        setIsForgotPassword(false);
      } catch {
        alertify.error("Usuario no registrado.");
      }
      return;
    }
    const endpoint = isRegister ? "/register" : "/login";
    try {
      const response = await axios.post(`${API_URL}${endpoint}`, data);
      const token = response.data.access_token;
      
      if (!isRegister) {
        const userInfo = await getUserInfo(token);
        const userData: User = {
          id: userInfo.id,
          name: userInfo.name,
          email: userInfo.email,
        };
        

        login(userData, token); // Guarda el usuario y el token en useAuth

        alertify.success("Inicio de sesión exitoso");
        navigate("/profile");
      } else {
        alertify.success("Usuario registrado con éxito");
        setIsRegister(false);
        reset();
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        alertify.error(error.response?.data?.detail || "Ocurrió un error");
      } else {
        alertify.error("Ocurrió un error");
      }
    }
  };

  const toggleAuthMode = () => {
    setIsRegister((prev) => !prev);
    setIsForgotPassword(false);
    reset(); // Reinicia los campos del formulario
  };
  const toggleAuthModeTwo = () => {
    setIsRegister(false);
    setIsForgotPassword(false);
    reset(); // Reinicia los campos del formulario
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-purple-500 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
         <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          {isRegister ? "Registrarse" : isForgotPassword ? "Recuperar contraseña" : "Iniciar Sesión"}
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {isRegister && (
            <div>
              <input
                {...register("name", {
                  required: "El nombre es obligatorio",
                  pattern: {
                    value: /^[A-Za-z]+(?:\s[A-Za-z]+)+$/,
                    message: "El nombre debe tener al menos dos palabras",
                  },
                })}
                placeholder="Nombre Completo"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
            </div>
          )}
      
          <div>
            <input
              {...register("email", {
                required: "El correo es obligatorio",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Correo electrónico no válido",
                },
              })}
              type="email"
              placeholder="Correo Electrónico"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
          </div>
          {!isForgotPassword && (
          <div>
            <input
              {...register("password", {
                required: "La contraseña es obligatoria",
                minLength: {
                  value: 8,
                  message: "La contraseña debe tener al menos 8 caracteres",
                },
                pattern: {
                  value: /^(?=.*[A-Z])(?=.*[.!@#$%^&*])/,
                  message: "Debe contener al menos una mayúscula y un símbolo",
                },
              })}
              type="password"
              placeholder="Contraseña"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
          </div>
          )}
         
          {!isRegister && !isForgotPassword && (
            <p className="text-center text-sm text-blue-500 cursor-pointer" onClick={() => setIsForgotPassword(true)}>
              ¿Olvidaste tu contraseña?
            </p>
          )}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition duration-300"
          >
             {isRegister ? "Registrarse" : isForgotPassword ? "Recuperar contraseña" : "Iniciar Sesión"}
          </button>
        </form>
        {!isForgotPassword && (
        <p className="text-center mt-4 text-gray-600 text-sm">
          {isRegister ? "¿Ya tienes cuenta? " : "¿No tienes cuenta? "}
          <span
            className="text-blue-500 cursor-pointer font-semibold hover:underline"
            onClick={toggleAuthMode}
          >
            {isRegister ? "Inicia sesión" : "Regístrate"}
          </span>
        </p>
        )}
           {isForgotPassword && (
        <p className="text-center mt-4 text-gray-600 text-sm">
          {isForgotPassword ? "Intenta Iniciar Sesión Nuevamente " : "¿No tienes cuenta? "}
          <span
            className="text-blue-500 cursor-pointer font-semibold hover:underline"
            onClick={toggleAuthModeTwo}
          >
            {isForgotPassword ? "Inicia sesión" : "Regístrate"}
          </span>
        </p>
        )}
      </div>
    </div>
  );
}

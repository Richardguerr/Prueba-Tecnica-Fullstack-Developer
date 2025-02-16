import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import alertify from "alertifyjs";

interface ResetPasswordForm {
  password: string;
  confirmPassword: string;
}

const API_URL = process.env.REACT_APP_USERS_SERVICE_URL || "http://localhost:8001/users";

export default function ResetPassword() {
  const { token } = useParams(); // Captura el token desde la URL
  const navigate = useNavigate();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ResetPasswordForm>();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: ResetPasswordForm) => {
    if (data.password !== data.confirmPassword) {
      alertify.error("Las contraseñas no coinciden");
      return;
    }
    reset();
    setLoading(true);

    try {
      await axios.post(`${API_URL}/reset-password`, { 
        token, 
        new_password: data.password 
      });
      alertify.success("Contraseña restablecida correctamente");
     
      navigate("/login"); // Redirige al login
    } catch {
      alertify.error("Error al restablecer la contraseña");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-purple-500 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Restablecer Contraseña</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
          <div>
            <input
              {...register("confirmPassword", { 
                required: "Confirma tu contraseña",
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
              placeholder="Confirmar Contraseña"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>}
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition duration-300"
            disabled={loading}
          >
            {loading ? "Procesando..." : "Restablecer Contraseña"}
          </button>
        </form>
      </div>
    </div>
  );
}

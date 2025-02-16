import { useState } from "react";
import Navbar from "../components/Navbar";
import { updateUser, deleteUser } from "../services/userService";
import { useAuth } from "../hooks/useAuth";
import alertify from "alertifyjs";
import "alertifyjs/build/css/alertify.min.css";
import { useForm } from "react-hook-form";
import { FaUserCircle } from "react-icons/fa";
import { UserUpdate } from "../types/types";


const Profile = () => {
  const { user, logout, token, setUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: user?.email || "",
      name: user?.name || "",
      current_password: "",
      new_password: "",
    },
  });



  const handleUpdate = async (data: UserUpdate) => {
    if (!token) return alertify.error("No autorizado");

    setLoading(true);
    try {
      const updatedUser = await updateUser(data, token);
      setUser(updatedUser);
      alertify.success("Perfil actualizado con éxito. Vuelve a iniciar sesión.");
      logout();
    } catch (error) {
      const errorMessage =
        (error as { response?: { data?: { detail?: string } } }).response?.data?.detail ||
        "Error al actualizar";
        setLoading(false);
      alertify.error(errorMessage);
    }
  };

  const handleDelete = async () => {
    if (!token) return alertify.error("No autorizado");

    setLoading(true);
    try {
      await deleteUser(token);
      alertify.success("Cuenta eliminada");
      logout();
    } catch (error) {
      const errorMessage =
        (error as { response?: { data?: { detail?: string } } }).response?.data?.detail ||
        "Error al eliminar la cuenta";
      alertify.error(errorMessage);
    }
  };

  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto p-6 mt-10 bg-white rounded-lg shadow-lg">
        {/* Tarjeta de perfil */}
        <div className="flex items-center space-x-6 border-b pb-6">
          <FaUserCircle className="text-gray-500 text-6xl" />
          <div>
            <h1 className="text-3xl font-semibold">{user?.name}</h1>
            <p className="text-gray-500">{user?.email}</p>
          </div>
        </div>

        {/* Formulario de edición */}
        <form onSubmit={handleSubmit(handleUpdate)} className="mt-6">
          <h2 className="text-2xl font-bold text-center mb-4">Editar Perfil</h2>

          {/* Email */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium">Correo Electrónico</label>
            <input
              {...register("email", {
                required: "El email es obligatorio",
                pattern: { value: /^[^@]+@[^@]+\.[^@]+$/, message: "Correo no válido" },
              })}
              className="w-full p-2 border rounded"
              type="email"
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
          </div>

          {/* Nombre */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium">Nombre</label>
            <input
              {...register("name", {
                required: "El nombre es obligatorio",
                minLength: { value: 3, message: "Mínimo 3 caracteres" },
              })}
              className="w-full p-2 border rounded"
              type="text"
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
          </div>

          {/* Contraseña actual */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium">Contraseña Actual</label>
            <input
              {...register("current_password", { required: "Obligatorio" })}
              className="w-full p-2 border rounded"
              type="password"
              placeholder="Ingrese su contraseña actual"
            />
            {errors.current_password && (
              <p className="text-red-500 text-sm">{errors.current_password.message}</p>
            )}
          </div>

          {/* Nueva contraseña */}
          <div className="mb-6">
            <label className="block text-gray-700 font-medium">Nueva Contraseña</label>
            <input
              {...register("new_password", {
                required: "Obligatorio",
                minLength: { value: 8, message: "Mínimo 8 caracteres" },
                pattern: { value: /^(?=.*[A-Z])(?=.*[.!@#$%^&*])/, message: "Debe contener una mayúscula y un símbolo" },
              })}
              className="w-full p-2 border rounded"
              type="password"
              placeholder="Ingrese nueva contraseña"
            />
            {errors.new_password && <p className="text-red-500 text-sm">{errors.new_password.message}</p>}
          </div>

          {/* Botones */}
          <div className="flex justify-between">
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              disabled={loading}
            >
              {loading ? "Actualizando..." : "Actualizar"}
            </button>
            <button
              type="button"
              onClick={() => setConfirmDelete(true)}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Eliminar Cuenta
            </button>
          </div>
        </form>

        {/* Modal de confirmación de eliminación */}
        {confirmDelete && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-bold">¿Estás seguro?</h2>
              <p className="mt-2 text-gray-600">Esta acción no se puede deshacer.</p>
              <div className="flex justify-end mt-4">
                <button
                  onClick={() => setConfirmDelete(false)}
                  className="px-4 py-2 bg-gray-400 text-white rounded mr-2"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded"
                  disabled={loading}
                >
                  {loading ? "Eliminando..." : "Sí, eliminar"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Profile;

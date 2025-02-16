import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import me from "../assets/me.jpeg";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-200 dark:bg-gray-900 relative z-50" >
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        {/* Logo */}
        <Link to="/posts" className="flex items-center space-x-3">
          <img src= {me}  className="h-10 w-10 rounded-full mx-auto mr-4" alt="Oscar Ricardo Guerrero" />
          <span className="text-2xl font-semibold dark:text-white">Bienvenido..!</span>
        </Link>

        {/* Botón para abrir menú en móviles */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden p-2 text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none dark:text-gray-400 dark:hover:bg-gray-700"
        >
          <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>

        {/* Menú principal */}
        <div className={`${menuOpen ? "block" : "hidden"} w-full md:flex md:w-auto`}>
          <ul className="flex flex-col p-4 mt-4 bg-gray-50 rounded-lg md:flex-row md:space-x-8 md:mt-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900">
            <li><Link to="/profile" className="py-2 px-3 text-gray-900 dark:text-white hover:text-blue-700">Perfil</Link></li>
            <li><Link to="/posts" className="py-2 px-3 text-gray-900 dark:text-white hover:text-blue-700">Posts</Link></li>
            <li><Link to="/dashboard" className="py-2 px-3 text-gray-900 dark:text-white hover:text-blue-700">DashBoard</Link></li>
            <li><Link to="/contact" className="py-2 px-3 text-gray-900 dark:text-white hover:text-blue-700">Contacto</Link></li>
          </ul>
        </div>

        {/* Menú de usuario */}
        <div className="relative">
          {user ? (
            <>
              <button onClick={() => setMenuOpen(!menuOpen)} className="px-3 py-2 bg-blue-800 text-white rounded-lg">
                {user.name}
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white text-black shadow-lg rounded-lg">
                  <Link to="/profile" className="block px-4 py-2 hover:bg-gray-200">Perfil</Link>
                  <button onClick={logout} className="w-full text-left px-4 py-2 hover:bg-gray-200">Cerrar Sesión</button>
                </div>
              )}
            </>
          ) : (
            <Link to="/login" className="px-3 py-2 bg-blue-600 text-white rounded-lg">Iniciar Sesión</Link>
          )}
        </div>
      </div>
    </nav>
  );
}

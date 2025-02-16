

import me from "../assets/me.jpeg";

import Navbar from "../components/Navbar";

export default function ContactPage() {
  return (
    <div>
      <Navbar />
    
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center p-6">
      <div className="max-w-4xl bg-white p-8 rounded-2xl shadow-2xl w-full text-center">
        {/* Encabezado */}
        <div>
        <img src={me} className="h-24 w-24 rounded-full mx-auto mb-4" alt="Oscar Ricardo Guerrero" />
          <h1 className="text-4xl font-bold text-gray-800">Oscar Ricardo Guerrero</h1>
          <p className="text-gray-600 mt-2">Ingeniero de Sistemas | Desarrollador Full Stack</p>
          <p className="mt-2 text-gray-700">Bogotá, Colombia</p>
        </div>

        {/* Información de contacto */}
        <div className="mt-6">
          <p className="text-lg"><strong>Email:</strong> <a href="mailto:oscarguerr0205@gmail.com" className="text-blue-600 hover:underline">oscarguerr0205@gmail.com</a></p>
          <p className="text-lg"><strong>Teléfono:</strong> +57 301 331 9241</p>
          <p className="text-lg"><strong>LinkedIn:</strong> <a href="https://www.linkedin.com/in/ricardo-guerrero-08a46a293/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Perfil de LinkedIn</a></p>
        </div>

        {/* Descargar CV */}
        <div className="mt-6">
          <a href="/cv/Ricardo_Guerrero_CV.pdf" download className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-700">Descargar CV</a>
        </div>
      </div>
      </div>
    </div>
  );
}

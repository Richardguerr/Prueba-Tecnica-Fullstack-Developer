import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import { createPost, fetchPosts, deletePost, updatePost } from "../services/postService";

interface Post {
  id: number;
  title: string;
  content: string;
  image_url?: string;
}

export default function Posts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState<{ title: string; content: string; image: File | null }>({
    title: "",
    content: "",
    image: null,
  });
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [newImageFile, setNewImageFile] = useState<File | null>(null);
  const [isExpanded, setIsExpanded] = useState(false); // Estado para expandir/cerrar el formulario

  useEffect(() => {
    fetchPosts(setPosts);
  }, []);

  const validateFields = () => {
    const { title, content } = editingPost || newPost;
    return title.trim() !== "" && content.trim() !== "";
  };

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      <Navbar />
      <div className="w-full container mx-auto p-6 flex-grow">
        <h1 className="text-3xl font-bold mb-6">Publicaciones</h1>

        {/* 📌 Botón para expandir/cerrar el formulario */}
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 transition mb-4"
          onClick={() => {
            setIsExpanded(!isExpanded);
            if (!isExpanded) setEditingPost(null); // Al abrir el formulario, se resetea la edición
          }}
        >
          {isExpanded ? "✖ Cerrar publicación" : "➕ Nueva publicación"}
        </button>

        {/* 📌 Formulario Expandible */}
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: isExpanded ? "auto" : 0, opacity: isExpanded ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold mb-2">
              {editingPost ? "Editar publicación" : "Crear publicación"}
            </h2>

            <input
              type="text"
              placeholder="Título"
              className="w-full p-2 border rounded mb-2"
              value={editingPost ? editingPost.title : newPost.title}
              onChange={(e) =>
                editingPost
                  ? setEditingPost({ ...editingPost, title: e.target.value })
                  : setNewPost({ ...newPost, title: e.target.value })
              }
            />

            <textarea
              placeholder="Contenido"
              className="w-full p-2 border rounded mb-2"
              value={editingPost ? editingPost.content : newPost.content}
              onChange={(e) =>
                editingPost
                  ? setEditingPost({ ...editingPost, content: e.target.value })
                  : setNewPost({ ...newPost, content: e.target.value })
              }
            />

            {/* 📌 Subir Imagen */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Subir Imagen</label>
              <div className="flex items-center space-x-4">
                <label
                  htmlFor="fileInput"
                  className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition"
                >
                  📷 Seleccionar archivo
                </label>
                <input
                  id="fileInput"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    if (editingPost) {
                      setNewImageFile(file);
                    } else {
                      setNewPost({ ...newPost, image: file });
                    }
                  }}
                />
                <span className="text-gray-600">
                  {newImageFile
                    ? newImageFile.name
                    : newPost.image
                    ? newPost.image.name
                    : editingPost?.image_url
                    ? "Imagen actual"
                    : "Ninguna imagen seleccionada"}
                </span>
              </div>
            </div>

            {/* 📌 Botones */}
            <div className="flex justify-end space-x-3">
              <button
                className="bg-gray-400 text-white px-4 py-2 rounded-lg shadow hover:bg-gray-500 transition"
                onClick={() => {
                  setIsExpanded(false);
                  setEditingPost(null);
                  setNewPost({ title: "", content: "", image: null });
                  setNewImageFile(null);
                }}
              >
                Cancelar
              </button>

              <button
                className={`px-4 py-2 rounded text-white transition ${
                  validateFields() ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-400 cursor-not-allowed"
                }`}
                disabled={!validateFields()}
                onClick={() => {
                  if (editingPost) {
                    updatePost(editingPost.id, { title: editingPost.title, content: editingPost.content, image: newImageFile }, fetchPosts, setPosts);
                  } else {
                    createPost(newPost, fetchPosts, setPosts, setNewPost);
                  }
                  setIsExpanded(false);
                }}
              >
                {editingPost ? "Actualizar" : "Publicar"}
              </button>
            </div>
          </div>
        </motion.div>

        {/* 📌 Lista de Publicaciones */}
        <motion.div
          initial={{ y: 0 }}
          animate={{ y: isExpanded ? 10 : 0 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-6 transition-all"
        >
          {posts.length > 0 ? (
            posts.map((post) => (
              <div key={post.id} className="bg-white p-6 rounded-2xl shadow-lg relative">
                <div className="w-full h-64 flex justify-center items-center bg-gray-100 rounded-lg">
                  <img
                    src={post.image_url ? `http://localhost:8002${post.image_url}` : "https://via.placeholder.com/800x400"}
                    alt="Imagen del post"
                    className="max-w-full max-h-full object-contain rounded-lg"
                  />
                </div>
                <h2 className="text-2xl font-bold mt-5">{post.title}</h2>
                <p className="text-gray-700 text-lg mt-3">{post.content}</p>

                <div className="absolute top-3 right-3 flex gap-3">
                  <button
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm"
                    onClick={() => {
                      setEditingPost(post);
                      setIsExpanded(true);
                    }}
                  >
                    Editar
                  </button>

                  <button
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm"
                    onClick={() => deletePost(post.id, fetchPosts, setPosts)}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 col-span-full text-center text-lg">No hay publicaciones disponibles.</p>
          )}
        </motion.div>
      </div>
    </div>
  );
}

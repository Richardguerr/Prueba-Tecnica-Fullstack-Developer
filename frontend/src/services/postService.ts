import axios from "axios";

const API_URL = process.env.REACT_APP_POSTS_API || "http://localhost:8002/posts";

// Función para obtener encabezados de autenticación
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return { headers: { Authorization: `Bearer ${token}` } };
};

// Interfaz para representar un Post
interface Post {
  id: number;
  title: string;
  content: string;
  image_url?: string; // URL opcional de la imagen
}

// Interfaz para representar datos de un post
interface PostData {
  title: string;
  content: string;
  image: File | null;
}

export const fetchPosts = async (setPosts?: (posts: Post[]) => void): Promise<Post[]> => {
  try {
    const response = await axios.get<Post[]>(`${API_URL}/getposts`, getAuthHeaders());
    if (setPosts) setPosts(response.data); // Si se proporciona setPosts, actualiza el estado
    console.log(response.data); 
    return response.data; // 🔥 Ahora devuelve la lista de posts
  } catch (error) {
    console.error("Error al obtener publicaciones", error);
    return []; // Devuelve un array vacío en caso de error
  }
};




export const createPost = async (
  postData: PostData,
  fetchPosts: () => Promise<Post[]>, // Ahora retorna posts
  setPosts: (posts: Post[]) => void,
  setNewPost: (newPost: PostData) => void
) => {
  const formData = new FormData();
  formData.append("title", postData.title);
  formData.append("content", postData.content);
  if (postData.image) {
    formData.append("image", postData.image);
  }

  try {
    const response = await axios.post(`${API_URL}/createpost`, formData, getAuthHeaders());

    if (response.status !== 201) throw new Error("Error al crear publicación");

    const updatedPosts = await fetchPosts(); // ✅ Ahora fetchPosts devuelve posts
    setPosts(updatedPosts); // ✅ Se actualiza el estado correctamente
    setNewPost({ title: "", content: "", image: null }); // ✅ Reseteamos el formulario
  } catch (error) {
    console.error("Error al crear publicación", error);
  }
};

export const updatePost = async (
    postId: number,
    postData: { title: string; content: string; image: File | null },
    fetchPosts: () => Promise<Post[]>,
    setPosts: (posts: Post[]) => void
  ) => {
    const formData = new FormData();
    formData.append("title", postData.title);
    formData.append("content", postData.content);
    
    if (postData.image) {
      formData.append("image", postData.image);
    }
  
    console.log("Contenido de FormData: ", postData.image);
for (const [key, value] of formData.entries()) {
  console.log(key, value);
}
    try {
      await axios.put(`${API_URL}/update/${postId}`, formData, getAuthHeaders());     
  
      const updatedPosts = await fetchPosts(); // ✅ Ahora fetchPosts devuelve posts
      setPosts(updatedPosts); // ✅ Se actualiza el estado correctamente
    } catch (error) {
      console.error("Error al actualizar publicación", error);
    }
  };
  

// Eliminar una publicación
export const deletePost = async (
  postId: number,
  fetchPosts: (setPosts: (posts: Post[]) => void) => void,
  setPosts: (posts: Post[]) => void
) => {
  try {
    await axios.delete(`${API_URL}/delete/${postId}`, getAuthHeaders());
    fetchPosts(setPosts);
  } catch (error) {
    console.error("Error al eliminar publicación", error);
  }
};

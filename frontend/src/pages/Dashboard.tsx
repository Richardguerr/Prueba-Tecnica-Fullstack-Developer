import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

const Dashboard = () => {
  return (
    <div> <Navbar />
    <div className="p-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <nav className="mt-4">
        <Link to="/profile" className="mr-4 text-blue-500">Perfil</Link>
        <Link to="/posts" className="text-blue-500">Publicaciones</Link>
      </nav>
      </div>
    </div>
 
  );
};
export default Dashboard;
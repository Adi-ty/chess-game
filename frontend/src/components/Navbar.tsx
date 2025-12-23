import { useAuth } from "../context/authContext";
import { useNavigate } from "react-router-dom";

export const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (!isAuthenticated) return null;

  return (
    <nav className="bg-green-600 text-white p-4 shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <h1
          className="text-xl font-bold cursor-pointer"
          onClick={() => navigate("/")}
        >
          Chess Online
        </h1>
        <div className="flex items-center gap-4">
          {user?.avatar_url && (
            <img
              src={user.avatar_url}
              alt="avatar"
              className="w-8 h-8 rounded-full"
            />
          )}
          <span className="hidden md:block">{user?.display_name}</span>
          <button
            onClick={logout}
            className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-sm"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";

export const Landing = () => {
  const navigate = useNavigate();
  const { isAuthenticated, login, user, logout } = useAuth();

  return (
    <div>
      <div className="mt-2">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <img src={"chess.jpg"} alt="chess board" />
          <div className="flex flex-col items-center gap-2 justify-center">
            <h1 className="text-4xl font-bold">Play Chess Online</h1>
            {isAuthenticated ? (
              <div className="flex flex-col items-center gap-4">
                <div className="flex items-center gap-2">
                  {user?.avatar_url && (
                    <img
                      src={user.avatar_url}
                      alt="avatar"
                      className="w-10 h-10 rounded-full"
                    />
                  )}
                  <span className="text-lg">
                    Welcome, {user?.display_name}!
                  </span>
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={() => navigate("/game")}
                    className="bg-green-400 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
                  >
                    Play Game
                  </button>
                  <button
                    onClick={logout}
                    className="bg-gray-400 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={login}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded flex items-center gap-2"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Sign in with Google
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/authContext";

const API_URL = "http://localhost:8080";

export const AuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setAuthData } = useAuth();
  const token = searchParams.get("token");
  const [error, setError] = useState<string | null>(
    token ? null : "No token received"
  );

  useEffect(() => {
    if (!token) {
      return;
    }

    const fetchUser = async () => {
      try {
        const response = await fetch(`${API_URL}/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const user = await response.json();
          setAuthData(token, user);
          navigate("/game");
        } else {
          setError("Failed to authenticate");
        }
      } catch (err) {
        console.error("Auth callback error:", err);
        setError("Authentication failed");
      }
    };

    fetchUser();
  }, [searchParams, navigate, setAuthData]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <p className="text-red-500 text-xl">{error}</p>
        <button
          onClick={() => navigate("/")}
          className="bg-green-400 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
        >
          Go Home
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-2xl">Authenticating...</p>
    </div>
  );
};

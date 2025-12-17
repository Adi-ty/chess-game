import { useNavigate } from "react-router-dom";

export const Landing = () => {
  const navigate = useNavigate();

  return (
    <div>
      <div className="mt-2">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <img src={"chess.jpg"} alt="chess board" />
          <div className="flex flex-col items-center gap-2 justify-center">
            <h1 className="text-4xl font-bold">Play Chess Online</h1>
            <div className="mt-4">
              <button
                onClick={() => {
                  navigate("/game");
                }}
                className="bg-green-400 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
              >
                Start Game
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

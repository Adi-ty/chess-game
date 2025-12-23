import { useNavigate } from "react-router-dom";

interface GameOverModalProps {
  outcome: string;
  method: string;
  playerColor: "white" | "black";
  onPlayAgain: () => void;
  onClose: () => void;
}

const getOutcomeMessage = (outcome: string, playerColor: "white" | "black") => {
  if (outcome === "1-0")
    return playerColor === "white" ? "You Won!" : "You Lost!";
  if (outcome === "0-1")
    return playerColor === "black" ? "You Won!" : "You Lost!";
  if (outcome === "1/2-1/2") return "It's a Draw!";
  return outcome;
};

export const GameOverModal = ({
  outcome,
  method,
  playerColor,
  onPlayAgain,
  onClose,
}: GameOverModalProps) => {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 bg-transparent bg-opacity-20 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full mx-4">
        <h2 className="text-2xl font-bold mb-4 text-center">
          {getOutcomeMessage(outcome, playerColor)}
        </h2>
        <p className="text-center mb-4">Method: {method}</p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={onPlayAgain}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
          >
            Play Again
          </button>
          <button
            onClick={() => {
              onClose();
              navigate("/");
            }}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
          >
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
};

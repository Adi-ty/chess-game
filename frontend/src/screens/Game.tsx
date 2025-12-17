import { useEffect, useState } from "react";
import { ChessBoard } from "../components/ChessBoard";
import { useSocket } from "../hooks/useSocket";
import { Chess } from "chess.js";

export const Game = () => {
  const socket = useSocket();

  const [chess, setChess] = useState(new Chess());
  const [board, setBoard] = useState(chess.board());
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!socket) return;

    // eslint-disable-next-line react-hooks/immutability
    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);

      switch (message.type) {
        case "game_start":
          chess.reset();
          setBoard(chess.board());
          setStarted(true);
          console.log("Game started, color:", message.color);
          break;
        case "move":
          chess.move(message.move);
          setBoard(chess.board());
          console.log("Move made:", message.move);
          break;
        case "game_over":
          console.log("Game over:", message.outcome, message.method);
          break;
        case "waiting":
          console.log("Waiting for opponent...");
          break;
        case "error":
          console.log("Error:", message.message);
          break;
        default:
          console.log("Unknown message:", message);
          break;
      }
    };
  }, [socket]);

  if (!socket)
    return (
      <div className="text-4xl font-bold">Connecting to game server ...</div>
    );

  return (
    <div className="justify-center flex w-full">
      <div className="pt-8 max-w-5xl w-full">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <div className="md:col-span-4 w-full flex justify-center">
            <ChessBoard socket={socket} board={board} />
          </div>
          <div className="md:col-span-2 flex items-center justify-center">
            {!started && (
              <button
                className="bg-green-400 text-white font-bold px-4 py-4 rounded-lg"
                onClick={() => {
                  socket.send(
                    JSON.stringify({
                      type: "init_game",
                    })
                  );
                }}
              >
                Play
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

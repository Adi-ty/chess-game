import { useEffect, useRef, useState } from "react";
import { ChessBoard } from "../components/ChessBoard";
import { useSocket } from "../hooks/useSocket";
import { Chess } from "chess.js";
import { GameOverModal } from "../components/GameOverModal";

export const Game = () => {
  const { socket } = useSocket();

  const chessRef = useRef(new Chess());
  const [board, setBoard] = useState(chessRef.current.board());
  const [started, setStarted] = useState(false);
  const [waiting, setWaiting] = useState(false);
  const [moveHistory, setMoveHistory] = useState<string[]>([]);
  const [playerColor, setPlayerColor] = useState<"white" | "black" | null>(
    null
  );
  const [gameOver, setGameOver] = useState<{
    outcome: string;
    method: string;
  } | null>(null);

  useEffect(() => {
    if (!socket) return;

    // eslint-disable-next-line react-hooks/immutability
    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);

      switch (message.type) {
        case "game_start":
          chessRef.current.reset();
          setBoard(chessRef.current.board());
          setStarted(true);
          setWaiting(false);
          setGameOver(null);
          setMoveHistory([]);
          setPlayerColor(message.color);
          console.log("Game started, color:", message.color);
          break;
        case "move":
          chessRef.current.move(message.move);
          setBoard(chessRef.current.board());
          setMoveHistory((prev) => [...prev, message.move]);
          console.log("Move made:", message.move);
          break;
        case "board_replay":
          try {
            chessRef.current.reset();
            const moves: string[] = [];
            for (const movePayload of message.moves) {
              chessRef.current.move(movePayload.move);
              moves.push(movePayload.move);
            }
            setBoard(chessRef.current.board());
            setStarted(true);
            setMoveHistory(moves);
            console.log("Board replayed with", message.moves.length, "moves");
          } catch (error) {
            console.error("Error replaying board:", error);
          }
          break;
        case "game_over":
          setStarted(false);
          setGameOver({ outcome: message.outcome, method: message.method });
          console.log("Game over:", message.outcome, message.method);
          break;
        case "waiting":
          setWaiting(true);
          console.log("Waiting for opponent...");
          break;
        case "error":
          setWaiting(false);
          console.log("Error:", message.message);
          break;
        default:
          console.log("Unknown message:", message);
          break;
      }
    };
  }, [socket]);

  const handlePlayAgain = () => {
    setGameOver(null);
    setStarted(false);
    setWaiting(false);
    setMoveHistory([]);
    setPlayerColor(null);
    socket?.send(JSON.stringify({ type: "init_game" }));
  };

  const handlePlay = () => {
    setWaiting(true);
    socket?.send(JSON.stringify({ type: "init_game" }));
  };

  if (!socket)
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-2xl">Connecting to game server...</p>
      </div>
    );

  return (
    <div className="flex justify-center w-full p-8">
      <div className="max-w-7xl w-full">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-8">
          <div className="md:col-span-4 flex justify-center">
            <ChessBoard socket={socket} board={board} />
          </div>
          <div className="md:col-span-2 flex flex-col gap-6">
            {!started && !waiting && !gameOver && (
              <button
                onClick={handlePlay}
                className="bg-green-500 hover:bg-green-600 text-white font-bold px-6 py-3 rounded-lg text-lg"
              >
                Play
              </button>
            )}
            {waiting && (
              <div className="text-center bg-gray-100 p-6 rounded-lg">
                <p className="text-lg font-semibold">Waiting for opponent...</p>
                <div className="mt-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto"></div>
                </div>
              </div>
            )}
            {started && (
              <div className="bg-white p-4 rounded-lg shadow-md">
                <p className="text-lg font-semibold mb-4">Game in progress</p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-bold mb-2">Move History</h3>
                  <table className="w-full text-sm">
                    <tbody>
                      {Array.from(
                        { length: Math.ceil(moveHistory.length / 2) },
                        (_, i) => (
                          <tr
                            key={i}
                            className={i % 2 === 0 ? "bg-gray-100" : "bg-white"}
                          >
                            <td className="py-1 px-2 font-semibold">
                              {i + 1}.
                            </td>
                            <td className="py-1 px-2">
                              {moveHistory[i * 2] || ""}
                            </td>
                            <td className="py-1 px-2">
                              {moveHistory[i * 2 + 1] || ""}
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
        {gameOver && playerColor && (
          <GameOverModal
            outcome={gameOver.outcome}
            method={gameOver.method}
            playerColor={playerColor}
            onPlayAgain={handlePlayAgain}
            onClose={() => setGameOver(null)}
          />
        )}
      </div>
    </div>
  );
};

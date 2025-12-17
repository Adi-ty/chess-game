import type { Color, PieceSymbol, Square } from "chess.js";
import { useState } from "react";

const getSquareNotation = (row: number, col: number): Square => {
  const file = String.fromCharCode("a".charCodeAt(0) + col);
  const rank = 8 - row;
  return `${file}${rank}` as Square;
};

export const ChessBoard = ({
  socket,
  board,
}: {
  socket: WebSocket;
  board: ({
    square: Square;
    type: PieceSymbol;
    color: Color;
  } | null)[][];
}) => {
  const [from, setFrom] = useState<Square | null>(null);

  return (
    <div className="text-white-200">
      {board.map((row, i) => {
        return (
          <div key={i} className="flex w-full">
            {row.map((square, j) => {
              const squareNotation = getSquareNotation(i, j);
              return (
                <div
                  onClick={() => {
                    if (!from) {
                      if (square) setFrom(squareNotation);
                    } else {
                      const to = squareNotation;
                      const move = from + to;

                      try {
                        socket.send(
                          JSON.stringify({
                            type: "move",
                            move: move,
                          })
                        );
                        console.log("Move sent:", move);
                      } catch (e) {
                        console.log("Invalid move:", move + e);
                      }
                      setFrom(null);
                    }
                  }}
                  key={j}
                  className={`w-16 h-16 ${
                    (i + j) % 2 == 0 ? "bg-green-500" : "bg-slate-100"
                  }`}
                >
                  <div className="w-full h-full flex justify-center items-center">
                    {square ? square.type : ""}
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

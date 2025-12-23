import type { Color, PieceSymbol, Square } from "chess.js";
import { useState } from "react";

const getSquareNotation = (row: number, col: number): Square => {
  const file = String.fromCharCode("a".charCodeAt(0) + col);
  const rank = 8 - row;
  return `${file}${rank}` as Square;
};

const getPieceSymbol = (type: PieceSymbol, color: Color): string => {
  const symbols: Record<PieceSymbol, { w: string; b: string }> = {
    k: { w: "♔", b: "♚" }, // King
    q: { w: "♕", b: "♛" }, // Queen
    r: { w: "♖", b: "♜" }, // Rook
    b: { w: "♗", b: "♝" }, // Bishop
    n: { w: "♘", b: "♞" }, // Knight
    p: { w: "♙", b: "♟" }, // Pawn
  };
  return symbols[type][color];
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
                    (i + j) % 2 == 0 ? "bg-green-400" : "bg-slate-400"
                  }`}
                >
                  <div
                    className={`w-full h-full flex justify-center items-center font-bold ${
                      square?.color === "b" ? "text-green-950" : "text-white"
                    }`}
                  >
                    {square ? (
                      <span className="text-2xl font-bold">
                        {getPieceSymbol(square.type, square.color)}
                      </span>
                    ) : (
                      ""
                    )}
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

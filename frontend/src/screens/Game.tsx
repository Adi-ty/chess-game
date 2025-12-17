import { ChessBoard } from "../components/ChessBoard";

export const Game = () => {
  return (
    <div className="justify-center flex w-full">
      <div className="pt-8 max-w-5xl w-full">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <div className="md:col-span-4">
            <ChessBoard />
          </div>
          <div className="md:col-span-2">
            <button>Play</button>
          </div>
        </div>
      </div>
    </div>
  );
};

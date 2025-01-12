import React, { useState, useCallback } from "react";

interface GameState {
  board: string[];
  currentPlayer: "X" | "O"; // Strictly "X" or "O"
  phase: "placement" | "movement";
  selectedCell: number | null;
  piecesPlaced: {
    X: number;
    O: number;
  };
  winner: string | null;
}

const GameBoard: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    board: Array(16).fill(""),
    currentPlayer: "X", // Starts with "X"
    phase: "placement",
    selectedCell: null,
    piecesPlaced: { X: 0, O: 0 },
    winner: null,
  });

  const handleCellClick = useCallback(
    (index: number) => {
      if (gameState.winner) return;

      if (gameState.phase === "placement") {
        handlePlacement(index);
      } else {
        handleMovement(index);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [gameState],
  );

  const handlePlacement = (index: number) => {
    if (gameState.board[index] !== "") return;
    if (gameState.piecesPlaced[gameState.currentPlayer] >= 4) return;

    setGameState((prev) => {
      const newBoard = [...prev.board];
      newBoard[index] = prev.currentPlayer;

      const newPiecesPlaced = {
        ...prev.piecesPlaced,
        [prev.currentPlayer]: prev.piecesPlaced[prev.currentPlayer] + 1,
      };

      const allPiecesPlaced =
        newPiecesPlaced.X === 4 && newPiecesPlaced.O === 4;

      const newState: GameState = {
        ...prev,
        board: newBoard,
        piecesPlaced: newPiecesPlaced,
        phase: allPiecesPlaced ? "movement" : "placement",
        currentPlayer: prev.currentPlayer === "X" ? "O" : "X", // Toggle strictly between "X" and "O"
      };

      sendGameState(newState);

      return newState;
    });
  };

  const handleMovement = (index: number) => {
    setGameState((prev) => {
      if (prev.selectedCell === null) {
        if (prev.board[index] !== prev.currentPlayer) return prev;
        return { ...prev, selectedCell: index };
      } else {
        if (prev.board[index] !== "") {
          if (index === prev.selectedCell) {
            return { ...prev, selectedCell: null };
          }
          return prev;
        }

        const newBoard = [...prev.board];
        newBoard[index] = newBoard[prev.selectedCell];
        newBoard[prev.selectedCell] = "";

        const newState: GameState = {
          ...prev,
          board: newBoard,
          selectedCell: null,
          currentPlayer: prev.currentPlayer === "X" ? "O" : "X", // Toggle strictly between "X" and "O"
        };

        sendGameState(newState);

        return newState;
      }
    });
  };

  const sendGameState = (state: GameState) => {
    const tg = window.Telegram?.WebApp;
    if (tg) {
      tg.sendData(
        JSON.stringify({
          action: "move",
          gameState: state,
        }),
      );
    }
  };

  return (
    <div className="game-container">
      <div className="status">
        {gameState.winner
          ? `Winner: Player ${gameState.winner}`
          : `${gameState.phase === "placement" ? "Placement" : "Movement"} Phase - Player ${gameState.currentPlayer}'s turn`}
      </div>

      <div className="pieces-info">
        <div
          className={`player-badge ${gameState.currentPlayer === "X" ? "active" : ""}`}
        >
          Player X: {gameState.piecesPlaced.X}/4
        </div>
        <div
          className={`player-badge ${gameState.currentPlayer === "O" ? "active" : ""}`}
        >
          Player O: {gameState.piecesPlaced.O}/4
        </div>
      </div>

      <div className="game-board">
        {gameState.board.map((cell, index) => (
          <button
            key={index}
            className={`cell ${cell} ${index === gameState.selectedCell ? "selected" : ""}`}
            onClick={() => handleCellClick(index)}
          >
            {cell}
          </button>
        ))}
      </div>
    </div>
  );
};

export default GameBoard;

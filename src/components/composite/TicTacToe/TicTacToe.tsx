import React, { useEffect, useState, useCallback } from "react";
import styles from "./TicTacToe.module.css";
import { GameState, TelegramWebApp } from "./types";

declare global {
  interface Window {
    Telegram: {
      WebApp: TelegramWebApp;
    };
  }
}

const API_URL = "https://pjimpsons.pythonanywhere.com";
const IS_DEVELOPMENT = window.location.hostname === "localhost";
const POLLING_INTERVAL = 1000;

export const TicTacToe: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    board: Array(4).fill(Array(4).fill("")),
    currentPlayer: "",
    mySymbol: null,
    phase: "placement",
    pieces: { O: 0, X: 0 },
    selectedPiece: null,
    lastMove: null,
    gameEnded: false,
    winner: null,
    players: {},
    joinTimeout: 60000,
    placementTimeout: 60000,
    lastActivityTime: Date.now(),
  });

  const [error, setError] = useState<string | null>(null);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const makeApiCall = async (endpoint: string, data: any) => {
    try {
      const tg = window.Telegram?.WebApp;
      const payload = {
        ...data,
        chatId: tg?.initDataUnsafe?.chat?.id || "default",
        userId: tg?.initDataUnsafe?.user?.id,
        timestamp: Date.now(),
      };

      const response = await fetch(`${API_URL}/${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Origin: IS_DEVELOPMENT
            ? "https://mrarejimmyz.github.io"
            : window.location.origin,
        },
        body: JSON.stringify(payload),
        mode: "cors",
        credentials: "same-origin",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API call error (${endpoint}):`, error);

      // Add user-friendly error handling
      if (error instanceof TypeError && error.message === "Failed to fetch") {
        if (IS_DEVELOPMENT) {
          console.warn(
            "Development environment detected. Please note: This app requires deployment to https://mrarejimmyz.github.io for API access.",
          );
        }
      }

      throw error;
    }
  };

  const checkGameState = useCallback(async () => {
    try {
      const response = await makeApiCall("get_game_state", {});
      if (response.success) {
        setGameState((prevState) => ({ ...prevState, ...response.gameState }));
      }
    } catch (error) {
      console.error("Error checking game state:", error);
      // Don't spam the error message if polling
      if (!IS_DEVELOPMENT) {
        setError("Unable to connect to game server. Please try again later.");
      }
    }
  }, []);

  useEffect(() => {
    const tg = window.Telegram.WebApp;
    tg.ready();
    tg.expand();

    const interval = setInterval(checkGameState, POLLING_INTERVAL);
    return () => clearInterval(interval);
  }, [checkGameState]);

  const handleCellClick = async (row: number, col: number) => {
    if (!gameState.mySymbol || gameState.gameEnded) return;
    if (gameState.currentPlayer !== gameState.mySymbol) return;

    if (gameState.phase === "movement") {
      await handleMovement(row, col);
    } else {
      await handlePlacement(row, col);
    }
  };

  const handlePlacement = async (row: number, col: number) => {
    // Early return if no symbol is selected
    if (
      !gameState.mySymbol ||
      (gameState.mySymbol !== "X" && gameState.mySymbol !== "O")
    )
      return;

    // Check if the cell is empty and if player hasn't placed all pieces
    if (
      gameState.board[row][col] !== "" ||
      gameState.pieces[gameState.mySymbol as keyof typeof gameState.pieces] >= 4
    )
      return;

    try {
      const response = await makeApiCall("make_move", {
        row,
        col,
        symbol: gameState.mySymbol,
      });

      if (response.success) {
        setGameState((prevState) => ({ ...prevState, ...response.gameState }));
      }
    } catch (error) {
      console.error("Error making placement:", error);
    }
  };

  const handleMovement = async (row: number, col: number) => {
    if (!gameState.selectedPiece) {
      // Selecting a piece
      if (gameState.board[row][col] === gameState.mySymbol) {
        setGameState((prevState) => ({
          ...prevState,
          selectedPiece: { row, col },
        }));
      }
      return;
    }

    // Moving a selected piece
    if (
      row === gameState.selectedPiece.row &&
      col === gameState.selectedPiece.col
    ) {
      // Deselect if clicking the same piece
      setGameState((prevState) => ({
        ...prevState,
        selectedPiece: null,
      }));
      return;
    }

    if (gameState.board[row][col] === "") {
      try {
        const response = await makeApiCall("make_move", {
          row,
          col,
          symbol: gameState.mySymbol,
          selectedPiece: gameState.selectedPiece,
        });

        if (response.success) {
          setGameState((prevState) => ({
            ...prevState,
            ...response.gameState,
            selectedPiece: null,
          }));
        }
      } catch (error) {
        console.error("Error making movement:", error);
      }
    }
  };

  const handleJoin = async () => {
    if (gameState.mySymbol) return;

    try {
      const tg = window.Telegram.WebApp;
      const username = tg.initDataUnsafe.user?.username || "Player";

      const response = await makeApiCall("join_game", { username });

      if (response.success) {
        setGameState((prevState) => ({
          ...prevState,
          ...response.gameState,
          mySymbol: response.gameState.mySymbol,
        }));
      }
    } catch (error) {
      console.error("Error joining game:", error);
    }
  };

  const handleReset = async () => {
    try {
      const response = await makeApiCall("reset_game", {});
      if (response.success) {
        setGameState({
          board: Array(4).fill(Array(4).fill("")),
          currentPlayer: "",
          mySymbol: null,
          phase: "placement",
          pieces: { O: 0, X: 0 },
          selectedPiece: null,
          lastMove: null,
          gameEnded: false,
          winner: null,
          players: {},
          joinTimeout: 60000,
          placementTimeout: 60000,
          lastActivityTime: Date.now(),
        });
      }
    } catch (error) {
      console.error("Error resetting game:", error);
    }
  };

  const getStatus = () => {
    if (gameState.gameEnded && gameState.winner) {
      return `${gameState.players[gameState.winner]} (${gameState.winner}) has won! 🎉`;
    }
    if (Object.keys(gameState.players).length < 2) {
      return "Waiting for players...";
    }
    return gameState.currentPlayer === gameState.mySymbol
      ? "Your turn!"
      : `Waiting for ${gameState.players[gameState.currentPlayer]}'s (${gameState.currentPlayer}) move...`;
  };

  const renderCell = (value: string, row: number, col: number) => {
    const cellClasses = [
      styles.cell,
      gameState.selectedPiece?.row === row &&
      gameState.selectedPiece?.col === col
        ? styles.selected
        : "",
      gameState.lastMove?.[0] === row && gameState.lastMove?.[1] === col
        ? styles.lastMove
        : "",
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div
        key={`${row}-${col}`}
        className={cellClasses}
        onClick={() => handleCellClick(row, col)}
      >
        {value}
      </div>
    );
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.gameInfo}>
          <div className={styles.status}>{getStatus()}</div>
          <div className={styles.phaseIndicator}>
            {gameState.phase === "placement"
              ? "Place your pieces"
              : "Move your pieces"}
          </div>
          <div className={styles.piecesCount}>
            {gameState.phase === "placement"
              ? `Pieces placed - X: ${gameState.pieces.X}/4, O: ${gameState.pieces.O}/4`
              : "Move phase: Move your pieces to win!"}
          </div>
        </div>

        {/* {Object.keys(gameState.players).length < 2 && (
          <div className={styles.waitingMessage}>
            Waiting for players to join...
            {gameState.players[gameState.mySymbol || ""] && (
              <span>You're {gameState.mySymbol}!</span>
            )}
          </div>
        )} */}
        {error && (
          <div className={styles.errorMessage}>
            {error}
            {IS_DEVELOPMENT && (
              <div className={styles.developmentNote}>
                Note: In development, API access is restricted. Deploy to
                https://mrarejimmyz.github.io for full functionality.
              </div>
            )}
          </div>
        )}

        <div className={styles.gameBoard}>
          {gameState.board.map((row, i) =>
            row.map((cell, j) => renderCell(cell, i, j)),
          )}
        </div>
      </div>

      <div className={styles.buttonContainer}>
        <button
          className={styles.button}
          onClick={handleJoin}
          disabled={!!gameState.mySymbol}
        >
          Join Game
        </button>
        <button
          className={`${styles.button} ${styles.button1}`}
          onClick={handleReset}
        >
          New Game
        </button>
      </div>
    </>
  );
};

export default TicTacToe;

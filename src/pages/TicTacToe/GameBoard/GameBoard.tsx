import { useState, useEffect } from "react";
import { Star, Trophy, Crown, Ghost, Sparkle } from "lucide-react";
import styles from "./GameBoard.module.css";

interface GameState {
  board: string[];
  currentPlayer: "X" | "O";
  phase: "waiting" | "placement" | "movement" | "finished";
  piecesPlaced: {
    X: number;
    O: number;
  };
  winner: string | null;
  players: {
    X: { id: number; name: string } | null;
    O: { id: number; name: string } | null;
  };
}

const GameBoard = () => {
  const [gameState, setGameState] = useState<GameState>({
    board: Array(16).fill(""),
    currentPlayer: "X",
    phase: "waiting",
    piecesPlaced: { X: 0, O: 0 },
    winner: null,
    players: { X: null, O: null },
  });
  const [selectedCell, setSelectedCell] = useState<number | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (tg) {
      tg.ready();
      tg.expand();
      const user = tg.initDataUnsafe?.user;
      if (user) {
        setCurrentUser(user);
        tg.sendData(
          JSON.stringify({
            action: "join",
            userId: user.id,
            userName: user.first_name,
          }),
        );
      }

      const handleGameUpdate = (event: MessageEvent) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === "gameUpdate") {
            setGameState(data.state);
          }
        } catch (error) {
          console.error("Error processing game update:", error);
        }
      };

      window.addEventListener("message", handleGameUpdate);
      return () => window.removeEventListener("message", handleGameUpdate);
    }
  }, []);

  const handleCellClick = (index: number) => {
    if (!currentUser || gameState.winner) return;

    const tg = window.Telegram?.WebApp;
    if (!tg) return;

    if (gameState.phase === "placement") {
      if (
        gameState.board[index] !== "" ||
        currentUser.id !== gameState.players[gameState.currentPlayer]?.id
      ) {
        return;
      }
      tg.sendData(
        JSON.stringify({
          action: "move",
          position: index,
        }),
      );
    } else if (gameState.phase === "movement") {
      if (currentUser.id !== gameState.players[gameState.currentPlayer]?.id) {
        return;
      }

      if (selectedCell === null) {
        if (gameState.board[index] === gameState.currentPlayer) {
          setSelectedCell(index);
        }
      } else {
        if (index === selectedCell) {
          setSelectedCell(null);
        } else if (gameState.board[index] === "") {
          tg.sendData(
            JSON.stringify({
              action: "move",
              position: index,
              selected: selectedCell,
            }),
          );
          setSelectedCell(null);
        }
      }
    }
  };

  const renderCell = (index: number) => {
    const value = gameState.board[index];
    const isSelected = index === selectedCell;
    const isCurrentPlayer =
      currentUser?.id === gameState.players[gameState.currentPlayer]?.id;
    const canInteract = !gameState.winner && isCurrentPlayer;

    return (
      <button
        key={index}
        onClick={() => handleCellClick(index)}
        className={`
          ${styles.cell}
          ${value === "X" ? styles.cellX : value === "O" ? styles.cellO : styles.cellEmpty}
          ${isSelected ? styles.selected : ""}
          ${!canInteract ? styles.disabled : ""}
        `}
        disabled={!canInteract}
      >
        {value === "X" ? (
          <Star className={styles.icon} />
        ) : value === "O" ? (
          <Ghost className={styles.icon} />
        ) : null}
      </button>
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <h1 className={styles.title}>
          <Star className={styles.titleIcon} />
          4x4 Tic-Tac-Toe
          <Crown className={styles.titleIcon} />
        </h1>

        <div className={styles.playerInfo}>
          <div
            className={`${styles.playerCard} ${styles.playerCardX} ${gameState.currentPlayer === "X" ? styles.activePlayer : ""}`}
          >
            <Star className={styles.playerIcon} />
            <span>Player X: {gameState.piecesPlaced.X}/4</span>
          </div>
          <div
            className={`${styles.playerCard} ${styles.playerCardO} ${gameState.currentPlayer === "O" ? styles.activePlayer : ""}`}
          >
            <Ghost className={styles.playerIcon} />
            <span>Player O: {gameState.piecesPlaced.O}/4</span>
          </div>
        </div>

        <div className={styles.board}>
          {gameState.board.map((_, index) => renderCell(index))}
        </div>

        <div className={styles.status}>
          {gameState.phase === "waiting" ? (
            <div className={styles.statusContent}>
              <Sparkle className={styles.statusIcon} />
              Waiting for opponent... 🎮
            </div>
          ) : gameState.phase === "placement" ? (
            <div className={styles.statusContent}>
              <Sparkle className={styles.statusIcon} />
              Placement Phase - Player {gameState.currentPlayer}'s turn 🎯
            </div>
          ) : gameState.phase === "movement" ? (
            <div className={styles.statusContent}>
              <Crown className={styles.statusIcon} />
              Movement Phase - Player {gameState.currentPlayer}'s turn 🔄
            </div>
          ) : (
            <div className={styles.statusContent}>
              <Trophy className={styles.statusIcon} />
              {gameState.winner
                ? `Player ${gameState.winner} wins! 🎉`
                : "Game Over! 🏁"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GameBoard;

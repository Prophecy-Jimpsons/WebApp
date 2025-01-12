import React, { useState, useCallback } from "react";
import {
  Star,
  Ghost,
  Banana,
  Trophy,
  Crown,
  Sparkle,
  Medal,
} from "lucide-react";
import { GameState, Player, WinLineType, GameAction } from "@/types/game";
import styles from "./GameBoard.module.css";

const INITIAL_STATE: GameState = {
  board: Array(16).fill(""),
  currentPlayer: "X",
  phase: "placement",
  selectedCell: null,
  piecesPlaced: { X: 0, O: 0 },
  winner: null,
};

const moveSound = new Audio(
  "data:audio/wav;base64,UklGRnQGAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YU8GAACAPgAAoD8AALA/AAC4PwAAuD8AALA/AACgPwAAgD8AAEg/AAAQPwAA8D4AAOg+AADwPgAAED8AAEg/",
);
const winSound = new Audio(
  "data:audio/wav;base64,UklGRpIGAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YW0GAACBhYqFSkhHRkhHR0hHR0hHR0hHR0hHR0hHR0hHR0hHR0hH",
);

const GameBoard: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(INITIAL_STATE);
  const [showModal, setShowModal] = useState(false);

  const checkWinner = useCallback(
    (
      board: string[],
    ): {
      winner: Player | "draw" | null;
      line?: { start: number; end: number; type: WinLineType };
    } => {
      const lines = [
        [0, 1, 2, 3],
        [4, 5, 6, 7],
        [8, 9, 10, 11],
        [12, 13, 14, 15], // Horizontal
        [0, 4, 8, 12],
        [1, 5, 9, 13],
        [2, 6, 10, 14],
        [3, 7, 11, 15], // Vertical
        [0, 5, 10, 15],
        [3, 6, 9, 12], // Diagonal
      ];

      for (let i = 0; i < lines.length; i++) {
        const [a, b, c, d] = lines[i];
        if (
          board[a] &&
          board[a] === board[b] &&
          board[a] === board[c] &&
          board[a] === board[d]
        ) {
          const type: WinLineType =
            i < 4 ? "horizontal" : i < 8 ? "vertical" : "diagonal";

          return {
            winner: board[a] as Player,
            line: { start: a, end: d, type },
          };
        }
      }

      if (board.every((cell) => cell !== "")) {
        return { winner: "draw" };
      }

      return { winner: null };
    },
    [],
  );

  const handlePlacement = useCallback(
    (index: number) => {
      if (
        gameState.board[index] !== "" ||
        gameState.piecesPlaced[gameState.currentPlayer] >= 4
      )
        return;

      // Haptic feedback
      if (window.navigator?.vibrate) {
        window.navigator.vibrate(50);
      }

      moveSound.play().catch(() => {});

      setGameState((prev: GameState) => {
        const newBoard = [...prev.board];
        newBoard[index] = prev.currentPlayer;

        const newPiecesPlaced = {
          ...prev.piecesPlaced,
          [prev.currentPlayer]: prev.piecesPlaced[prev.currentPlayer] + 1,
        };

        const allPiecesPlaced =
          newPiecesPlaced.X === 4 && newPiecesPlaced.O === 4;
        const { winner, line } = checkWinner(newBoard);
        const nextPlayer: Player = prev.currentPlayer === "X" ? "O" : "X";

        if (winner) {
          winSound.play().catch(() => {});
          setTimeout(() => setShowModal(true), 500);
        }

        const newState: GameState = {
          ...prev,
          board: newBoard,
          piecesPlaced: newPiecesPlaced,
          phase: allPiecesPlaced ? "movement" : "placement",
          currentPlayer: nextPlayer,
          winner,
          winningLine: line,
        };

        // Send state to Telegram WebApp if available
        if (window.Telegram?.WebApp) {
          const message: GameAction = {
            action: "move",
            gameState: newState,
          };
          window.Telegram.WebApp.sendData(JSON.stringify(message));
        }

        return newState;
      });
    },
    [
      gameState.board,
      gameState.piecesPlaced,
      gameState.currentPlayer,
      checkWinner,
    ],
  );

  const handleMovement = useCallback(
    (index: number) => {
      setGameState((prev: GameState) => {
        if (prev.selectedCell === null) {
          if (prev.board[index] !== prev.currentPlayer) return prev;

          if (window.navigator?.vibrate) {
            window.navigator.vibrate(30);
          }

          return { ...prev, selectedCell: index };
        }

        if (prev.board[index] !== "") {
          if (index === prev.selectedCell) {
            return { ...prev, selectedCell: null };
          }
          return prev;
        }

        if (window.navigator?.vibrate) {
          window.navigator.vibrate([30, 50]);
        }
        moveSound.play().catch(() => {});

        const newBoard = [...prev.board];
        newBoard[index] = newBoard[prev.selectedCell];
        newBoard[prev.selectedCell] = "";

        const { winner, line } = checkWinner(newBoard);
        const nextPlayer: Player = prev.currentPlayer === "X" ? "O" : "X";

        if (winner) {
          winSound.play().catch(() => {});
          setTimeout(() => setShowModal(true), 500);
        }

        const newState: GameState = {
          ...prev,
          board: newBoard,
          selectedCell: null,
          currentPlayer: nextPlayer,
          phase: prev.phase,
          piecesPlaced: prev.piecesPlaced,
          winner,
          winningLine: line,
        };

        if (window.Telegram?.WebApp) {
          const message: GameAction = {
            action: "move",
            gameState: newState,
          };
          window.Telegram.WebApp.sendData(JSON.stringify(message));
        }

        return newState;
      });
    },
    [checkWinner],
  );

  const handleCellClick = useCallback(
    (index: number) => {
      if (gameState.winner) return;

      if (gameState.phase === "placement") {
        handlePlacement(index);
      } else {
        handleMovement(index);
      }
    },
    [gameState.winner, gameState.phase, handlePlacement, handleMovement],
  );

  const handleRestart = useCallback(() => {
    setGameState(INITIAL_STATE);
    setShowModal(false);
  }, []);

  const renderWinningLine = useCallback(() => {
    if (!gameState.winningLine) return null;

    const { start, type } = gameState.winningLine;
    const baseStyle: React.CSSProperties = {
      position: "absolute",
      backgroundColor: "var(--primary-color)",
      zIndex: 1,
    };

    let style: React.CSSProperties = { ...baseStyle };

    switch (type) {
      case "horizontal": {
        const row = Math.floor(start / 4);
        style = {
          ...style,
          top: `${row * 25 + 12.5}%`,
          left: "0",
          width: "100%",
          height: "4px",
        };
        break;
      }
      case "vertical": {
        const col = start % 4;
        style = {
          ...style,
          left: `${col * 25 + 12.5}%`,
          top: "0",
          width: "4px",
          height: "100%",
        };
        break;
      }
      case "diagonal": {
        style = {
          ...style,
          width: "141.4%",
          height: "4px",
          top: "50%",
          left: "-20.7%",
          transformOrigin: "center",
          transform: start === 0 ? "rotate(45deg)" : "rotate(-45deg)",
        };
        break;
      }
    }

    return (
      <div className={`${styles.winningLine} ${styles[type]}`} style={style} />
    );
  }, [gameState.winningLine]);

  return (
    <div className={styles.container}>
      <div className={styles.gameWrapper}>
        <div className={styles.header}>
          <h1 className={styles.title}>
            <Star
              className={`${styles.titleIcon} ${styles.monkeyIcon}`}
              size={40}
            />
            Monkey Tic-Tac-Toe
            <Banana
              className={`${styles.titleIcon} ${styles.bananaIcon}`}
              size={40}
            />
          </h1>
          <div className={styles.status}>
            {gameState.winner ? (
              <div className={styles.statusWithIcon}>
                {gameState.winner === "draw" ? (
                  "It's a Draw!"
                ) : (
                  <>
                    Winner: Player {gameState.winner}
                    <Trophy size={24} className={styles.trophyIcon} />
                  </>
                )}
              </div>
            ) : (
              `${gameState.phase === "placement" ? "🎯 Placement" : "🔄 Movement"} Phase - Player ${gameState.currentPlayer}'s turn`
            )}
          </div>
        </div>

        <div className={styles.playerBadges}>
          <div
            className={`${styles.playerBadge} ${styles.playerX} ${gameState.currentPlayer === "X" ? styles.active : ""}`}
          >
            <div className={styles.playerContent}>
              <Star size={24} />
              <span>Player X: {gameState.piecesPlaced.X}/4</span>
            </div>
          </div>
          <div
            className={`${styles.playerBadge} ${styles.playerO} ${gameState.currentPlayer === "O" ? styles.active : ""}`}
          >
            <div className={styles.playerContent}>
              <Ghost size={24} />
              <span>Player O: {gameState.piecesPlaced.O}/4</span>
            </div>
          </div>
        </div>

        <div className={styles.gameBoard}>
          {renderWinningLine()}
          {gameState.board.map((cell: string, index: number) => (
            <button
              key={index}
              onClick={() => handleCellClick(index)}
              className={`${styles.cell} 
      ${cell === "X" ? styles.cellX : ""} 
      ${cell === "O" ? styles.cellO : ""} 
      ${index === gameState.selectedCell ? styles.selected : ""}`}
              aria-label={`Cell ${index}`}
              disabled={gameState.winner !== null}
            >
              {cell === "X" ? (
                <Star size={32} className={styles.monkeyIcon} />
              ) : cell === "O" ? (
                <Ghost size={32} className={styles.pulse} />
              ) : null}
            </button>
          ))}
        </div>

        {showModal && (
          <div className={styles.modalOverlay} onClick={handleRestart}>
            <div
              className={styles.modalContent}
              onClick={(e) => e.stopPropagation()}
            >
              {gameState.winner === "draw" ? (
                <div className={styles.drawContent}>
                  <div className={styles.confettiContainer}>
                    <Crown className={styles.floatingIcon} size={24} />
                    <Sparkle className={styles.floatingIcon} size={20} />
                    <Star className={styles.floatingIcon} size={22} />
                  </div>
                  <div className={styles.drawIcons}>
                    <div className={styles.playerIconGroup}>
                      <Star className={styles.drawIconX} size={48} />
                      <Crown className={styles.playerCrown} size={24} />
                    </div>
                    <Trophy className={styles.drawTrophy} size={32} />
                    <div className={styles.playerIconGroup}>
                      <Ghost className={styles.drawIconO} size={48} />
                      <Crown className={styles.playerCrown} size={24} />
                    </div>
                  </div>
                  <h2 className={styles.modalTitle}>
                    <Trophy size={24} className={styles.titleIcon} />
                    It's a Draw!
                    <Medal size={24} className={styles.titleIcon} />
                  </h2>
                  <div className={styles.sparkleContainer}>
                    <Sparkle className={styles.sparkleIcon} size={16} />
                    <Star className={styles.sparkleIcon} size={16} />
                    <Sparkle className={styles.sparkleIcon} size={16} />
                  </div>
                </div>
              ) : (
                <div className={styles.winContent}>
                  <div className={styles.confettiContainer}>
                    <Sparkle className={styles.floatingIcon} size={20} />
                    <Star className={styles.floatingIcon} size={24} />
                    <Crown className={styles.floatingIcon} size={22} />
                  </div>
                  <div className={styles.trophyContainer}>
                    <Crown className={styles.crownIcon} size={32} />
                    <Trophy className={styles.trophyIcon} size={64} />
                  </div>
                  <div className={styles.winnerContainer}>
                    {gameState.winner === "X" ? (
                      <div className={styles.playerIconGroup}>
                        <Star className={styles.winnerIcon} size={48} />
                        <Medal className={styles.medalIcon} size={24} />
                      </div>
                    ) : null}
                  </div>
                  <h2 className={styles.modalTitle}>
                    <Crown size={24} className={styles.titleIcon} />
                    Player <span>{gameState.winner}</span> Wins!
                    <Trophy size={24} className={styles.titleIcon} />
                  </h2>
                </div>
              )}
              <button onClick={handleRestart} className={styles.restartButton}>
                Play Again
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GameBoard;

import { useState } from "react";
import styles from "./GameBoard.module.css";
import GameCell from "./GameCell";

interface GameBoardProps {
  username: string;
  onBack: () => void;
}

const MAX_PIECES = 4;

const GameBoard: React.FC<GameBoardProps> = ({ username, onBack }) => {
  const [board, setBoard] = useState<string[][]>(
    Array(4)
      .fill("")
      .map(() => Array(4).fill("")),
  );
  const [currentPlayer, setCurrentPlayer] = useState<"X" | "O">("X");
  const [phase, setPhase] = useState<"placement" | "movement">("placement");
  const [pieces, setPieces] = useState<{ X: number; O: number }>({
    X: 0,
    O: 0,
  });
  const [selectedPiece, setSelectedPiece] = useState<{
    row: number;
    col: number;
  } | null>(null);
  const [winner, setWinner] = useState<string | null>(null);
  const [isGameOver, setIsGameOver] = useState(false);
  const [hint, setHint] = useState<string | null>(null);

  // 🎯 Reset Game
  const resetGame = () => {
    setBoard(
      Array(4)
        .fill("")
        .map(() => Array(4).fill("")),
    );
    setCurrentPlayer("X");
    setPhase("placement");
    setPieces({ X: 0, O: 0 });
    setSelectedPiece(null);
    setWinner(null);
    setIsGameOver(false);
    setHint(null);
  };

  // 🎯 Handle Cell Clicks
  const handleCellClick = (row: number, col: number) => {
    if (winner || isGameOver) return; // Stop clicks after game ends

    if (phase === "placement") {
      if (board[row][col] === "" && pieces[currentPlayer] < MAX_PIECES) {
        placePiece(row, col);
      }
    } else if (phase === "movement") {
      if (!selectedPiece && board[row][col] === currentPlayer) {
        setSelectedPiece({ row, col });
      } else if (selectedPiece?.row === row && selectedPiece?.col === col) {
        setSelectedPiece(null);
      } else if (selectedPiece && board[row][col] === "") {
        movePiece(row, col);
      }
    }
  };

  // ✅ Place a Piece
  const placePiece = (row: number, col: number) => {
    if (pieces[currentPlayer] >= MAX_PIECES) {
      setHint(`🚀 Move a piece! You've placed all 4.`);
      return;
    }

    const newBoard = board.map((r) => [...r]);
    newBoard[row][col] = currentPlayer;
    setBoard(newBoard);

    setPieces((prev) => ({
      ...prev,
      [currentPlayer]: prev[currentPlayer] + 1,
    }));

    if (
      pieces[currentPlayer] + 1 >= MAX_PIECES &&
      pieces[getOpponent()] >= MAX_PIECES
    ) {
      setPhase("movement");
      setHint(`🔄 Move an existing piece to an empty spot.`);
    } else {
      setHint(null);
    }

    checkWinner();
    switchTurn();
  };

  // ✅ Move a Piece
  const movePiece = (row: number, col: number) => {
    if (board[row][col] !== "" || !selectedPiece) return;

    const newBoard = board.map((r) => [...r]);
    newBoard[selectedPiece.row][selectedPiece.col] = "";
    newBoard[row][col] = currentPlayer;
    setBoard(newBoard);
    setSelectedPiece(null);

    checkWinner();
    switchTurn();
  };

  // 🔄 Switch Turns
  const switchTurn = () => {
    setCurrentPlayer(currentPlayer === "X" ? "O" : "X");
  };

  // 🆚 Get Opponent Symbol
  const getOpponent = () => (currentPlayer === "X" ? "O" : "X");

  // ✅ **Check Winner** (Includes 2x2 Square Wins)
  const checkWinner = () => {
    const winPatterns = [
      ...board, // Rows
      ...board[0].map((_, col) => board.map((row) => row[col])), // Columns
      board.map((row, i) => row[i]), // Main diagonal
      board.map((row, i) => row[3 - i]), // Anti-diagonal
    ];

    if (winPatterns.some((line) => line.every((cell) => cell === "X"))) {
      setWinner("X");
      setIsGameOver(true);
      setHint(null); // ❌ Remove hint when the game ends
      return;
    }
    if (winPatterns.some((line) => line.every((cell) => cell === "O"))) {
      setWinner("O");
      setIsGameOver(true);
      setHint(null); // ❌ Remove hint when the game ends
      return;
    }

    // ✅ Check for 2x2 Square Wins
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (
          board[i][j] !== "" &&
          board[i][j] === board[i][j + 1] &&
          board[i][j] === board[i + 1][j] &&
          board[i][j] === board[i + 1][j + 1]
        ) {
          setWinner(board[i][j]);
          setIsGameOver(true);
          setHint(null); // ❌ Remove hint when the game ends
          return;
        }
      }
    }
  };

  return (
    <>
      {/* Back Button */}
      <button className={styles.backButton} onClick={onBack}>
        ← Back
      </button>

      <div className={styles.boardContainer}>
        <h2 className={styles.greeting}>Hello, {username}!</h2>

        {!isGameOver && (
          <p
            className={styles.turnIndicator}
            style={{
              color:
                currentPlayer === "X"
                  ? "var(--color-primary)"
                  : "var(--color-secondary)",
            }}
          >
            🎮{" "}
            {currentPlayer === "X"
              ? `${username} (X) Turn`
              : "Opponent (O) Turn"}
          </p>
        )}

        <div className={styles.board}>
          {board.map((row, rIdx) =>
            row.map((cell, cIdx) => (
              <GameCell
                key={`${rIdx}-${cIdx}`}
                value={cell}
                onClick={() => handleCellClick(rIdx, cIdx)}
                isSelected={
                  selectedPiece?.row === rIdx && selectedPiece?.col === cIdx
                }
              />
            )),
          )}
        </div>

        {isGameOver && (
          <p className={styles.winnerText}>🎉 {winner} Wins! 🎉</p>
        )}

        {/* ✅ Hint is only shown if the game is NOT over */}
        {hint && !isGameOver && <p className={styles.hintMessage}>{hint}</p>}

        <div className={styles.buttonContainer}>
          <button className={styles.newGameButton} onClick={resetGame}>
            New Game
          </button>
        </div>
      </div>
    </>
  );
};

export default GameBoard;

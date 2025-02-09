import { useState, useEffect } from "react";
import axios from "axios";
import Pusher from "pusher-js";
import styles from "./GameBoard.module.css";
import GameCell from "./GameCell";

interface GameBoardProps {
  username: string;
  gameId: string;
  playerId: string;
  onBack: () => void;
}

const API_URL = "https://wanemregmi.pythonanywhere.com";

const GameBoard: React.FC<GameBoardProps> = ({
  username,
  gameId,
  playerId,
  onBack,
}) => {
  const [board, setBoard] = useState<string[][]>(
    Array(4)
      .fill("")
      .map(() => Array(4).fill("")),
  );
  const [currentPlayer, setCurrentPlayer] = useState<number>(1);
  const [winner, setWinner] = useState<string | null>(null);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isWaiting, setIsWaiting] = useState(true); // ✅ Initially waiting for an opponent

  useEffect(() => {
    if (!gameId) return;

    console.log(`📡 Subscribing to Pusher channel: game-${gameId}`);

    const fetchGameState = async () => {
      console.log(`🔄 Fetching game state for Game ID: ${gameId}`);
      try {
        const response = await axios.get(`${API_URL}/get_game_state`, {
          params: { game_id: gameId },
        });

        const { board, current_player, is_game_over, winner, players } =
          response.data;
        setBoard(board);
        setCurrentPlayer(current_player);
        setIsGameOver(is_game_over);
        setWinner(winner || null);

        // ✅ Check if second player has joined
        if (players.length >= 2) {
          setIsWaiting(false);
        }
      } catch (error) {
        console.error(
          `❌ Error fetching game state for game ${gameId}:`,
          error,
        );
      }
    };

    fetchGameState();

    // ✅ Connect to Pusher for real-time updates
    const pusher = new Pusher("9cf0b43853e0406ff8ba", { cluster: "us2" });
    const channel = pusher.subscribe(`game-${gameId}`);

    // 🎯 Listen for moves
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    channel.bind("move-made", (data: any) => {
      console.log("📢 Move received from Pusher:", data);
      setBoard(data.board);
      setCurrentPlayer(data.current_player);
      setWinner(data.winner || null);
      setIsGameOver(data.is_game_over);
    });

    // 🎯 Listen for a new player joining
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    channel.bind("player-joined", (data: any) => {
      console.log("👥 Opponent joined:", data);
      setIsWaiting(false);
    });

    return () => {
      console.log(`❌ Unsubscribing from Pusher channel: game-${gameId}`);
      pusher.unsubscribe(`private-game-${gameId}`);
      pusher.disconnect();
    };
  }, [gameId]);

  // ✅ Handle cell click event (via Pusher, NOT API)
  const handleCellClick = async (row: number, col: number) => {
    if (winner || isGameOver || currentPlayer !== parseInt(playerId)) return;

    console.log(`📤 Sending move: [${row}, ${col}] via API...`);

    try {
      // ✅ Send move to backend (NOT Pusher)
      const response = await axios.post(`${API_URL}/make_move`, {
        game_id: gameId,
        player_id: playerId,
        move_type: "place",
        move: [row, col],
      });

      if (response.data.status === "success") {
        console.log("✅ Move successful! Waiting for update from Pusher...");
      } else {
        console.warn("⚠️ Invalid move:", response.data.error);
      }
    } catch (error) {
      console.error("❌ Error making move:", error);
    }
  };

  return (
    <>
      <button className={styles.backButton} onClick={onBack}>
        ← Back
      </button>

      <div className={styles.boardContainer}>
        <h2 className={styles.greeting}>Hello, {username}!</h2>

        {isWaiting ? (
          <p className={styles.waitingText}>⏳ Waiting for opponent...</p>
        ) : (
          <p
            className={styles.turnIndicator}
            style={{
              color:
                currentPlayer === parseInt(playerId)
                  ? "var(--color-primary)"
                  : "var(--color-secondary)",
            }}
          >
            🎮{" "}
            {currentPlayer === parseInt(playerId)
              ? `${username} (X) Turn`
              : `Opponent (O) Turn`}
          </p>
        )}

        <div className={styles.board}>
          {board.map((row, rIdx) =>
            row.map((cell, cIdx) => (
              <GameCell
                key={`${rIdx}-${cIdx}`}
                value={cell}
                onClick={() => handleCellClick(rIdx, cIdx)}
                isSelected={false}
              />
            )),
          )}
        </div>

        {isGameOver && (
          <p className={styles.winnerText}>🎉 {winner} Wins! 🎉</p>
        )}
      </div>
    </>
  );
};

export default GameBoard;

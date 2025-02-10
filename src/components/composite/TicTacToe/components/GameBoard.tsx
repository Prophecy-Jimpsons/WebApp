import React, { useState, useEffect, useCallback, useMemo } from "react";
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

interface Player {
  id: string;
  symbol: number;
}

interface BoardState {
  board: number[][];
  last_move: null | [number, number];
  phase: "placement" | "movement";
  pieces_placed: Record<string, number>;
}

interface GameState {
  board_state: BoardState;
  current_player: number;
  players: Record<string, Player>;
  players_count: number;
  playing_with_ai: boolean;
  status: string;
}

const API_URL = "https://wanemregmi.pythonanywhere.com";
const pusher = new Pusher("9cf0b43853e0406ff8ba", { cluster: "us2" });

const GameBoard: React.FC<GameBoardProps> = ({
  username,
  gameId,
  playerId,
  onBack,
}) => {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(
    null,
  );

  const fetchGameState = useCallback(async () => {
    console.log(`🔄 Fetching game state for Game ID: ${gameId}`);
    try {
      const response = await axios.get(`${API_URL}/game_info/${gameId}`);
      const data = response.data;

      console.log("✅ Raw Game State from API:", data);

      // Convert backend response to match frontend expectations
      const formattedGameState: GameState = {
        board_state: {
          board: data.board.board,
          last_move: data.board.last_move || null,
          phase: data.board.phase || "placement",
          pieces_placed: data.board.pieces_placed || {},
        },
        current_player: data.current_player,
        players: Object.fromEntries(
          Object.entries(data.players).map(([id, player]) => {
            const typedPlayer = player as { symbol: number }; // ✅ Fix type issue
            return [id, { id, symbol: typedPlayer.symbol }];
          }),
        ),
        players_count: Object.keys(data.players).length,
        playing_with_ai: false,
        status: "ongoing",
      };

      setGameState(formattedGameState);
    } catch (error) {
      console.error(`❌ Error fetching game state for game ${gameId}:`, error);
    }
  }, [gameId]);

  useEffect(() => {
    if (!gameId) return;

    console.log(`📡 Subscribing to Pusher channel: game-${gameId}`);

    fetchGameState();

    const channel = pusher.subscribe(`game-${gameId}`);

    channel.bind("move-made", (data: GameState) => {
      if (!data || !data.board_state) {
        console.warn("⚠️ Received invalid game state from Pusher:", data);
        return;
      }
      console.log("📢 Move received from Pusher:", data);
      setGameState(data);
      setSelectedCell(null);
    });

    channel.bind("player-joined", () => {
      console.log("👥 Opponent joined");
      fetchGameState();
    });

    return () => {
      console.log(`❌ Unsubscribing from Pusher channel: game-${gameId}`);
      pusher.unsubscribe(`game-${gameId}`);
    };
  }, [gameId, fetchGameState]);

  const handleCellClick = useCallback(
    (row: number, col: number) => {
      if (
        !gameState ||
        gameState.status === "finished" ||
        gameState.current_player !== parseInt(playerId)
      )
        return;

      if (gameState.board_state.phase === "placement") {
        console.log(`📤 Sending placement move: [${row}, ${col}]x .`);
        sendMove("place", [row, col]);
      } else if (gameState.board_state.phase === "movement") {
        if (selectedCell) {
          console.log(
            `📤 Sending movement move: ${selectedCell} to [${row}, ${col}] via API...`,
          );
          sendMove("move", [selectedCell[0], selectedCell[1], row, col]);
          setSelectedCell(null);
        } else {
          setSelectedCell([row, col]);
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [gameState, playerId, selectedCell],
  );

  const sendMove = useCallback(
    async (moveType: "place" | "move", move: number[]) => {
      try {
        console.log(`📤 Sending move to API:`, {
          game_id: gameId,
          player_id: playerId,
          move_type: moveType,
          move: move,
        });

        const response = await axios.post(`${API_URL}/make_move`, {
          game_id: gameId,
          player_id: playerId,
          move_type: moveType,
          move: move,
        });

        console.log(`✅ Move response:`, response.data);

        if (response.data.status === "success") {
          console.log(`✅ ${moveType} move sent successfully!`);
        } else {
          console.warn("⚠️ Invalid move:", response.data.error);
        }
      } catch (error) {
        console.error("❌ Error sending move:", error);
      }
    },
    [gameId, playerId],
  );

  const renderBoard = useMemo(() => {
    if (!gameState || !gameState.board_state || !gameState.board_state.board) {
      return <div className={styles.loading}>Loading board...</div>;
    }

    return (
      <div className={styles.board}>
        {gameState.board_state.board.map((row, rIdx) =>
          row.map((cell, cIdx) => (
            <GameCell
              key={`${rIdx}-${cIdx}`}
              value={cell === 0 ? "" : cell === 1 ? "X" : "O"}
              onClick={() => handleCellClick(rIdx, cIdx)}
              isSelected={Boolean(
                selectedCell &&
                  selectedCell[0] === rIdx &&
                  selectedCell[1] === cIdx,
              )}
            />
          )),
        )}
      </div>
    );
  }, [gameState, handleCellClick, selectedCell]);

  if (!gameState) {
    return <div className={styles.loading}>Loading game...</div>;
  }

  return (
    <>
      <button className={styles.backButton} onClick={onBack}>
        ← Back
      </button>

      <div className={styles.boardContainer}>
        <h2 className={styles.greeting}>Hello, {username}!</h2>

        {gameState.players_count < 2 ? (
          <p className={styles.waitingText}>⏳ Waiting for opponent...</p>
        ) : (
          <>
            <p className={styles.phaseIndicator}>
              Current Phase: {gameState.board_state.phase}
            </p>
            <p className={styles.turnIndicator}>
              🎮{" "}
              {gameState.current_player === parseInt(playerId)
                ? `${username} (${gameState.current_player === 1 ? "X" : "O"}) Turn`
                : `Opponent (${gameState.current_player === 1 ? "X" : "O"}) Turn`}
            </p>
          </>
        )}

        {renderBoard}

        {gameState.status === "finished" && (
          <p className={styles.winnerText}>🎉 Game Over! 🎉</p>
        )}
      </div>
    </>
  );
};

export default GameBoard;

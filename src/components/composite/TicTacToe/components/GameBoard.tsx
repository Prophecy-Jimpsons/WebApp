import React, { useCallback, useEffect, useRef, useState } from "react";
import Board from "./Board";
import Controls from "./Controls";
import styles from "./GameBoard.module.css";
import GameStatus from "./GameStatus";
import Timer from "./TimerUI";
import axios from "axios";
import Pusher from "pusher-js";
import { determineWinningCells } from "@/utils/helpers";

interface GameBoardProps {
  username: string;
  gameId: string;
  playerId: string;
  gameMode: "online" | "ai" | "predict" | null;
  onBack: () => void;
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
  players?: Record<string, Player>;
  players_count?: number;
  playing_with_ai: boolean;
  status: string;
  winner?: number | null;
}

interface Player {
  id: string;
  symbol: number;
  type: "human" | "ai";
}

const API_URL = "https://wanemregmi.pythonanywhere.com";
const TIMEOUT_DURATION = 10000; // 10 seconds
const INACTIVITY_THRESHOLD = 3000; // 3 seconds

const GameBoard: React.FC<GameBoardProps> = ({
  onBack,
  username,
  gameId,
  playerId,
  gameMode,
}) => {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(
    null,
  );
  const [highlightedCells, setHighlightedCells] = useState<[number, number][]>(
    [],
  );
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [isTimerActive, setIsTimerActive] = useState<boolean>(false);
  const [timeoutMessage, setTimeoutMessage] = useState<string>("");
  const pusherClientRef = useRef<Pusher | null>(null);

  const initializePusher = useCallback(() => {
    if (pusherClientRef.current) {
      return pusherClientRef.current;
    }

    const client = new Pusher("23f29026f51de66ea541", { cluster: "us2" });
    pusherClientRef.current = client;
    return client;
  }, []);

  const fetchGameState = useCallback(async () => {
    console.log(`🔄 Fetching game state for Game ID: ${gameId}`);
    try {
      const response = await axios.get(`${API_URL}/game_info/${gameId}`);
      const data = response.data;

      console.log("✅ Raw Game State from API:", data);

      const formattedGameState: GameState = {
        board_state: {
          board: data.board.board,
          last_move: data.board.last_move || null,
          phase: data.board.phase || "placement",
          pieces_placed: data.board.pieces_placed || {},
        },
        current_player: data.current_player,
        players: Object.fromEntries(
          Object.entries(data.players).map(([player_id, player]) => {
            const typedPlayer = player as {
              username: string;
              symbol: number;
              type: string;
            };
            return [
              player_id,
              {
                id: player_id,
                symbol: typedPlayer.symbol,
                type: typedPlayer.type as "human" | "ai",
              },
            ];
          }),
        ),
        players_count: Object.keys(data.players).length,
        playing_with_ai: gameMode === "ai",
        status: data.status || "ongoing",
        winner: data.winner || null,
      };
      console.log("✅ Formatted Game State:", formattedGameState);
      setGameState(formattedGameState);
    } catch (error) {
      console.error(`❌ Error fetching game state for game ${gameId}:`, error);
    }
  }, [gameId, gameMode]);

  const resetGame = async () => {
    try {
      await axios.post(`${API_URL}/reset_all`);
      setSelectedCell(null);
      setHighlightedCells([]);
      setIsGameOver(false);
      setTimeoutMessage("");
      onBack();
    } catch (error) {
      console.error("Error resetting the game:", error);
    }
  };

  useEffect(() => {
    if (!gameId) return;

    const client = initializePusher();
    console.log(`📡 Subscribing to Pusher channel: game-${gameId}`);
    fetchGameState();

    const channel = client.subscribe(`game-${gameId}`);

    channel.bind("move-made", (data: any) => {
      if (!data?.board?.board) {
        console.warn("⚠️ Received invalid game state from Pusher:", data);
        return;
      }

      console.log("📢 Move received from Pusher:", data);

      const formattedState: GameState = {
        board_state: {
          board: data.board.board,
          last_move: data.board.last_move || null,
          phase: data.board.phase || "placement",
          pieces_placed: data.board.pieces_placed || {},
        },
        current_player: data.current_player,
        playing_with_ai: gameMode === "ai",
        status: data.is_game_over ? "finished" : "ongoing",
        winner: data.winner,
      };

      setGameState((prevState) => {
        if (prevState) {
          return {
            ...prevState,
            ...formattedState,
          };
        }
        return formattedState;
      });
      setIsTimerActive(false);
    });

    channel.bind("player-joined", (data: any) => {
      console.log("📢 Player Joined event received from Pusher:", data);

      const formattedState: GameState = {
        board_state: {
          board: data.board.board,
          last_move: data.board.last_move || null,
          phase: data.board.phase || "placement",
          pieces_placed: data.board.pieces_placed || {},
        },
        current_player: data.current_player,
        playing_with_ai: gameMode === "ai",
        status: data.status,
        winner: data.winner,
        players: data.players,
        players_count: data.players_count,
      };

      setGameState((prevState) => {
        if (prevState && gameMode !== "ai") {
          return {
            ...prevState,
            ...formattedState,
          };
        }
        return formattedState;
      });
    });

    return () => {
      console.log(`❌ Unsubscribing from Pusher channel: game-${gameId}`);
      client.unsubscribe(`game-${gameId}`);
    };
  }, [gameId, fetchGameState, initializePusher, gameMode]);

  // HANDLE TIMER TO CHECK FOR INACTIVITY
  // useEffect(() => {
  //   let inactivityTimer: NodeJS.Timeout;
  //   let timeoutTimer: NodeJS.Timeout;

  //   if (gameState?.status === "ongoing" && !isGameOver && !isTimerActive) {
  //     inactivityTimer = setTimeout(() => {
  //       setIsTimerActive(true);
  //       timeoutTimer = setTimeout(() => {
  //         setTimeoutMessage("Game Over - Timeout!");
  //         setIsGameOver(true);
  //         setGameState((prev) =>
  //           prev ? { ...prev, status: "finished" } : null,
  //         );
  //       }, TIMEOUT_DURATION);
  //     }, INACTIVITY_THRESHOLD);
  //   }

  //   return () => {
  //     clearTimeout(inactivityTimer);
  //     clearTimeout(timeoutTimer);
  //   };
  // }, [gameState?.status, isGameOver, isTimerActive]);

  const handleQuit = () => {
    resetGame();
    onBack();
  };

  const sendMove = useCallback(
    async (moveType: "place" | "move", move: number[]) => {
      if (!gameId || !playerId) {
        return;
      }
      console.log(`🚀 Attempting to send move:`, {
        game_id: gameId,
        player_id: playerId,
        move_type: moveType,
        move: move,
      });

      try {
        const response = await axios.post(`${API_URL}/make_move`, {
          game_id: gameId,
          player_id: playerId,
          move_type: moveType,
          move: move,
        });

        console.log(`✅ Move successfully sent. Response:`, response.data);

        if (response.data.status !== "success") {
          console.warn("⚠️ Move rejected:", response.data.error);
        }
      } catch (error) {
        console.error("❌ Error sending move:", error);
      }
    },
    [gameId, playerId],
  );

  const handleCellClick = useCallback(
    async (row: number, col: number) => {
      if (
        !gameState ||
        !playerId ||
        gameState.status === "finished" ||
        isGameOver ||
        gameState.current_player !== parseInt(playerId) ||
        gameMode === "predict"
      ) {
        return;
      }

      if (gameState.board_state.phase === "placement") {
        if (gameState.board_state.pieces_placed[playerId] >= 4) {
          console.warn("⛔ Cannot place more than 4 pieces.");
          return;
        }
        await sendMove("place", [row, col]);
      } else if (gameState.board_state.phase === "movement") {
        if (selectedCell) {
          await sendMove("move", [selectedCell[0], selectedCell[1], row, col]);
          setSelectedCell(null);
        } else {
          if (gameState.board_state.board[row][col] === parseInt(playerId)) {
            setSelectedCell([row, col]);
          }
        }
      }
      setIsTimerActive(false);
    },
    [gameState, playerId, selectedCell, gameMode, sendMove, isGameOver],
  );

  useEffect(() => {
    if (gameState?.status === "finished") {
      setSelectedCell(null);
      setIsGameOver(true);
      setHighlightedCells(
        determineWinningCells(
          gameState.board_state.board,
          gameState.winner as number,
        ),
      );

      const refreshTimer = setTimeout(() => {
        window.location.reload();
      }, 6000);

      return () => {
        clearTimeout(refreshTimer);
      };
    }
  }, [gameState]);

  console.log("isGame over: ", isGameOver);
  if (!gameState) {
    return <div className={styles.loading}>Loading game...</div>;
  }

  console.log("gameState: ", gameState);

  return (
    <div className={styles.boardContainer}>
      <Controls
        playerId={playerId as string}
        onBack={handleQuit}
        onReset={resetGame}
        isGameOver={isGameOver}
      />
      <GameStatus
        playerId={playerId as string}
        username={username}
        gameState={gameState}
        timeoutMessage={timeoutMessage}
      />
      {/* {isTimerActive && playerId !== "spectator" && (
        <Timer initialTime={TIMEOUT_DURATION / 1000} onTimeout={() => {}}  timeoutMessage={timeoutMessage}/>
      )} */}
      <Board
        board={gameState.board_state.board}
        onClick={handleCellClick}
        selectedCell={selectedCell}
        highlightedCells={highlightedCells}
        isGameOver={isGameOver}
      />
    </div>
  );
};

export default GameBoard;

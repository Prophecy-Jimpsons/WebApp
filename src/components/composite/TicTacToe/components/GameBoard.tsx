import React, { useCallback, useEffect, useRef, useState } from "react";
import Board from "./Board";
import Controls from "./Controls";
import styles from "./GameBoard.module.css";
import GameStatus from "./GameStatus";
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
  last_activity: number;
}

interface Player {
  id: string;
  symbol: number;
  type: "human" | "ai";
}

const API_URL = "https://wanemregmi.pythonanywhere.com";
const INACTIVITY_THRESHOLD = 30000; // 30 seconds

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
  const [showTimeoutModal, setShowTimeoutModal] = useState<boolean>(false);
  const pusherClientRef = useRef<Pusher | null>(null);
  const lastActivityRef = useRef<number>(Date.now());

  const updateUsernameStorage = useCallback((username: string) => {
    // Update username in localStorage
    localStorage.setItem("username", username);

    // Update username in current game session
    const gameSession = localStorage.getItem("current_game_session");
    if (gameSession) {
      const session = JSON.parse(gameSession);
      session.username = username;
      localStorage.setItem("current_game_session", JSON.stringify(session));
    }
  }, []);

  const initializePusher = useCallback(() => {
    if (!pusherClientRef.current) {
      pusherClientRef.current = new Pusher("23f29026f51de66ea541", {
        cluster: "us2",
      });
    }
    return pusherClientRef.current;
  }, []);

  const fetchGameState = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL}/game_info/${gameId}`);
      const data = response.data;

      // Update username if it exists in the response
      if (data.players && data.players[playerId]) {
        const playerUsername = data.players[playerId].username;
        if (playerUsername) {
          updateUsernameStorage(playerUsername);
        }
      }

      setGameState({
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
                username: typedPlayer.username,
              },
            ];
          }),
        ),
        players_count: Object.keys(data.players).length,
        playing_with_ai: gameMode === "ai",
        status: data.status || "ongoing",
        winner: data.winner || null,
        last_activity: data.last_activity,
      });
      lastActivityRef.current = Date.now();
    } catch (error) {
      console.error(`Error fetching game state for game ${gameId}:`, error);
    }
  }, [gameId, gameMode, playerId, updateUsernameStorage]);

  const resetGame = useCallback(async () => {
    try {
      await axios.post(`${API_URL}/reset_all`);
      setSelectedCell(null);
      setHighlightedCells([]);
      setIsGameOver(false);
      onBack();
    } catch (error) {
      console.error("Error resetting the game:", error);
    }
  }, [onBack]);

  useEffect(() => {
    if (!gameId) return;

    const client = initializePusher();
    fetchGameState();

    const channel = client.subscribe(`game-${gameId}`);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleGameUpdate = (data: any) => {
      // console.log("Current players from Pusher:", data?.players);
      // console.log(
      //   "Current localStorage username:",
      //   localStorage.getItem("username"),
      // );

      if (!data?.board?.board) {
        // console.log("Missing board data in Pusher update");
        return;
      }

      // If we have player data, check the username
      if (data.players && data.players[playerId]) {
        const playerUsername = data.players[playerId].username;
        // console.log("Username from Pusher for current player:", playerUsername);

        if (playerUsername) {
          // Update localStorage
          localStorage.setItem("username", playerUsername);
          // console.log("Updated localStorage with username:", playerUsername);

          // Update game session
          const gameSession = localStorage.getItem("current_game_session");
          if (gameSession) {
            const session = JSON.parse(gameSession);
            session.username = playerUsername;
            localStorage.setItem(
              "current_game_session",
              JSON.stringify(session),
            );
            // console.log("Updated game session with username:", playerUsername);
          }
        }
      }

      setGameState((prevState) => {
        const newState = {
          ...prevState,
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
          last_activity: data.last_activity,
          players: data.players || prevState?.players,
          players_count: data.players
            ? Object.keys(data.players).length
            : prevState?.players_count,
        };
        // console.log("Updated game state:", newState);
        return newState;
      });
      lastActivityRef.current = Date.now();
    };

    channel.bind("move-made", handleGameUpdate);
    channel.bind("player-joined", handleGameUpdate);

    const inactivityCheck = setInterval(() => {
      if (Date.now() - lastActivityRef.current > INACTIVITY_THRESHOLD) {
        setShowTimeoutModal(true);
        setTimeout(() => {
          setShowTimeoutModal(false);
          resetGame();
        }, 5000);
      }
    }, 1000);

    return () => {
      client.unsubscribe(`game-${gameId}`);
      clearInterval(inactivityCheck);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameId, fetchGameState, initializePusher, gameMode, resetGame]);

  const sendMove = useCallback(
    async (moveType: "place" | "move", move: number[]) => {
      if (!gameId || !playerId) return;

      const username = localStorage.getItem("username");
      // console.log("Current username in localStorage:", username); // Check current username

      try {
        const response = await axios.post(`${API_URL}/make_move`, {
          game_id: gameId,
          player_id: playerId,
          move_type: moveType,
          move: move,
          username: username,
        });
        // console.log("Move sent with username:", username); // Log sent username
        console.log("Server response:", response.data); // Check server response
        lastActivityRef.current = Date.now();
      } catch (error) {
        console.error("Error sending move:", error);
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
        if (gameState.board_state.pieces_placed[playerId] < 4) {
          await sendMove("place", [row, col]);
        }
      } else if (gameState.board_state.phase === "movement") {
        if (selectedCell) {
          await sendMove("move", [selectedCell[0], selectedCell[1], row, col]);
          setSelectedCell(null);
        } else if (
          gameState.board_state.board[row][col] === parseInt(playerId)
        ) {
          setSelectedCell([row, col]);
        }
      }
      lastActivityRef.current = Date.now();
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

      // const refreshTimer = setTimeout(() => {
      //   window.location.reload();
      // }, 6000);

      // return () => clearTimeout(refreshTimer);
    }
  }, [gameState]);

  if (!gameState) {
    return <div className={styles.loading}>Loading game...</div>;
  }

  return (
    <div className={styles.boardContainer}>
      <Controls
        playerId={playerId}
        onBack={onBack}
        onReset={resetGame}
        isGameOver={isGameOver}
      />
      <GameStatus
        playerId={playerId}
        username={username}
        gameState={gameState}
        timeoutMessage=""
      />
      <Board
        board={gameState.board_state.board}
        onClick={handleCellClick}
        selectedCell={selectedCell}
        highlightedCells={highlightedCells}
        isGameOver={isGameOver}
      />
      {showTimeoutModal && (
        <div className={styles.timeoutModal}>
          <div className={styles.timeoutModalContent}>
            <h2 className={styles.timeoutModalTitle}>Game Timed Out</h2>
            <p className={styles.timeoutModalMessage}>
              The game has been inactive for too long and will reset.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameBoard;

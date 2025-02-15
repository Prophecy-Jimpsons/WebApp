import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import axios from "axios";
import GameLanding from "./components/GameLanding";
import GameMode from "./components/GameMode";
import GameBoard from "./components/GameBoard";
import styles from "./TicTacToe.module.css";

const API_URL = "https://wanemregmi.pythonanywhere.com";
const CHECK_COOLDOWN = 5000;
const DEBUG = process.env.NODE_ENV === "development";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const logger = (message: string, ...args: any[]) => {
  if (DEBUG) {
    console.log(message, ...args);
  }
};

const TicTacToe: React.FC = () => {
  const [screen, setScreen] = useState<"landing" | "mode" | "board">("landing");
  const [gameId, setGameId] = useState<string | null>("1");
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [gameMode, setGameMode] = useState<"online" | "ai" | "predict" | null>(
    null,
  );
  const [canJoinGame, setCanJoinGame] = useState<boolean>(false);
  const [gameExists, setGameExists] = useState<boolean>(false);
  const lastCheckRef = useRef<number>(0);

  const checkGameStatus = useCallback(async () => {
    const now = Date.now();
    if (now - lastCheckRef.current < CHECK_COOLDOWN) {
      logger("⏳ Skipping check - too recent");
      return;
    }
    lastCheckRef.current = now;

    try {
      logger("🔄 Checking if game exists...");
      const response = await axios.get(`${API_URL}/active_games`);
      const gameData = response.data.active_games["1"];

      if (!gameData) {
        if (!gameExists) {
          logger("❌ No active game. Ready to create.");
        }
        setCanJoinGame(true);
        setGameExists(false);
      } else if (gameData.players_count === 1) {
        logger("🙋 One player in game. Another player can join.");
        setCanJoinGame(true);
        setGameExists(true);
      } else {
        if (canJoinGame) {
          logger("👀 Game is full. Spectate mode only.");
        }
        setCanJoinGame(false);
        setGameExists(true);
      }
    } catch (error) {
      console.error("⚠️ Error checking active games:", error);
      setCanJoinGame(true);
      setGameExists(false);
    }
  }, [canJoinGame, gameExists]);

  useEffect(() => {
    checkGameStatus();
  }, [checkGameStatus]);

  const handleStartGame = useCallback(
    async (mode: "online" | "ai" | "predict") => {
      if (gameExists && !canJoinGame) {
        logger("🚫 Game already full - starting spectator mode");
        setGameMode(mode);
        setScreen("board");
        return;
      }

      setGameMode(mode);
      try {
        logger(`🔄 Starting ${mode} game...`);
        const response = await axios.get(`${API_URL}/active_games`);
        const gameData = response.data.active_games["1"];

        if (!gameData) {
          logger("❌ No active game. Creating new game...");
          await createGame(mode);
        } else if (gameData.players_count === 1 && mode === "online") {
          logger("🙋 Joining existing game as Player 2...");
          await joinGame("2", "human");
        } else {
          console.error("🚨 Game is full");
        }
      } catch (error) {
        console.error("❌ Error:", error);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [gameExists, canJoinGame],
  );

  const createGame = useCallback(async (mode: string) => {
    try {
      logger(`🟢 Creating new ${mode} game...`);
      const response = await axios.post(
        `${API_URL}/create_game`,
        { game_mode: mode },
        { headers: { "Content-Type": "application/json" } },
      );

      if (response.data.status === "success" || response.data.game_id) {
        setGameId("1");
        setPlayerId(mode === "ai" ? "1" : "1");
        setScreen("board");
      }
    } catch (error) {
      console.error("❌ Error creating game:", error);
    }
  }, []);

  const joinGame = useCallback(
    async (playerId: string, playerType: "human" | "ai") => {
      try {
        logger(`🟢 Joining as ${playerType} player ${playerId}...`);
        const response = await axios.post(
          `${API_URL}/join_game`,
          { game_id: "1", player_id: playerId, player_type: playerType },
          { headers: { "Content-Type": "application/json" } },
        );

        if (response.data.status === "success") {
          logger(`✅ Joined as Player ${response.data.symbol}`);
          setPlayerId(response.data.symbol.toString());
          setScreen("board");
        } else {
          console.error("❌ Failed to join game:", response.data.error);
        }
      } catch (error) {
        console.error("❌ Error joining game:", error);
      }
    },
    [],
  );

  const memoizedGameLanding = useMemo(
    () => (
      <GameLanding
        onNext={() => setScreen("mode")}
        onSpectate={() => setScreen("board")}
        setPlayerId={setPlayerId}
        gameExists={gameExists}
        canJoinGame={canJoinGame}
      />
    ),
    [gameExists, canJoinGame],
  );

  const memoizedGameMode = useMemo(
    () => (
      <GameMode
        gameMode={gameMode}
        gameExists={gameExists}
        canJoinGame={canJoinGame}
        onBack={() => setScreen("landing")}
        onStart={handleStartGame}
      />
    ),
    [gameMode, gameExists, canJoinGame, handleStartGame],
  );

  const memoizedGameBoard = useMemo(
    () =>
      gameId && (
        <GameBoard
          username={playerId || "spectator"}
          gameId={gameId}
          playerId={playerId || ""}
          gameMode={gameMode}
          onBack={() => {
            setScreen("mode");
            checkGameStatus();
          }}
        />
      ),
    [gameId, playerId, gameMode, checkGameStatus],
  );

  return (
    <div className={styles.wrapper}>
      <div className={styles.gameContainer}>
        {screen === "landing" && memoizedGameLanding}
        {screen === "mode" && memoizedGameMode}
        {screen === "board" && memoizedGameBoard}
      </div>
    </div>
  );
};

export default React.memo(TicTacToe);

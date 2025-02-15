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
import Pusher from "pusher-js";

const API_URL = "https://wanemregmi.pythonanywhere.com";
const CHECK_COOLDOWN = 5000;
const DEBUG = process.env.NODE_ENV === "development";
const PUSHER_KEY = "23f29026f51de66ea541";
const PUSHER_CLUSTER = "us2";

const logger = (message: string, ...args: any[]) => {
  if (DEBUG) {
    console.log(message, ...args);
  }
};

const TicTacToe: React.FC = () => {
  // Local UI state
  const [screen, setScreen] = useState<"landing" | "mode" | "board">("landing");
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [gameMode, setGameMode] = useState<"online" | "ai" | "predict" | null>(
    null,
  );

  // Game state
  const [gameId, setGameId] = useState<string | null>("1");
  const [canJoinGame, setCanJoinGame] = useState<boolean>(false);
  const [gameExists, setGameExists] = useState<boolean>(false);

  const lastCheckRef = useRef<number>(0);
  const pusherRef = useRef<Pusher | null>(null);

  // Initialize Pusher
  useEffect(() => {
    pusherRef.current = new Pusher(PUSHER_KEY, {
      cluster: PUSHER_CLUSTER,
      forceTLS: true,
    });

    // Subscribe to the general games channel
    const gamesChannel = pusherRef.current.subscribe("games");

    // Listen for new game creation
    gamesChannel.bind("new-game", (data: any) => {
      logger("📢 New game created:", data);
      // Only update game state, not UI state
      setGameExists(true);
      setCanJoinGame(true);
    });

    // Listen for global reset
    gamesChannel.bind("reset", (data: any) => {
      logger("📢 Game reset event received:", data);
      setGameExists(false);
      setCanJoinGame(true);
      // Only reset screen if we were part of the game
      if (playerId) {
        setScreen("landing");
        setPlayerId(null);
      }
    });

    // Subscribe to specific game channel when game ID is set
    if (gameId) {
      const gameChannel = pusherRef.current.subscribe(`game-${gameId}`);

      gameChannel.bind("player-joined", (data: any) => {
        logger("📢 Player joined:", data);
        const gameData = data;
        // set to true game exists
        setGameExists(true);
        // set to true if player can join
        setCanJoinGame(
          gameData?.players && Object.keys(gameData?.players).length < 2,
        );
      });

      // gameChannel.bind("move-made", (data: any) => {
      //   logger("📢 Move made:", data);
      //   // Handle move updates in GameBoard component
      // });
    }

    return () => {
      if (pusherRef.current) {
        pusherRef.current.unsubscribe("games");
        if (gameId) {
          pusherRef.current.unsubscribe(`game-${gameId}`);
        }
      }
    };
  }, [gameId, playerId]);

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
        setCanJoinGame(true); // No game exists, so a player can join
        setGameExists(false);
      } else if (gameData.players_count === 1) {
        logger("🙋 One player in game. Another player can join.");
        setCanJoinGame(true); // One player in game, another can join
        setGameExists(true);
      } else {
        setCanJoinGame(false); // Game is full
        setGameExists(true);
      }
    } catch (error) {
      console.error("⚠️ Error checking active games:", error);
      setCanJoinGame(true);
      setGameExists(false);
    }
  }, []);

  const handleStartGame = useCallback(
    async (mode: "online" | "ai" | "predict") => {
      // If game is full, start spectator mode
      if (gameExists && !canJoinGame) {
        logger("🚫 Game already full - starting spectator mode");
        setGameMode(mode);
        setScreen("board");
        return;
      }
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
        setGameId(response.data.game_id);
        // Update local UI state only for the creating player
        setPlayerId(response.data.player_id);
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
          // Update local UI state only for the joining player
          setPlayerId(response.data.symbol.toString());
          setScreen("board");
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
          pusherClient={pusherRef.current}
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

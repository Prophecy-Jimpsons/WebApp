import { useState, useEffect } from "react";
import axios from "axios";
import GameLanding from "./components/GameLanding";
import GameMode from "./components/GameMode";
import GameBoard from "./components/GameBoard";
import styles from "./TicTacToe.module.css";

const API_URL = "https://wanemregmi.pythonanywhere.com";

const TicTacToe: React.FC = () => {
  const [screen, setScreen] = useState<"landing" | "mode" | "board">("landing");
  const [gameId, setGameId] = useState<string | null>("1");
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [gameMode, setGameMode] = useState<"online" | "ai" | "predict" | null>(
    null,
  );
  const [_canJoinGame, setCanJoinGame] = useState(false);

  useEffect(() => {
    checkGameStatus();
  }, []);

  const checkGameStatus = async () => {
    try {
      console.log("🔄 Checking if game exists...");
      const response = await axios.get(`${API_URL}/active_games`);
      console.log("✅ Active Games Response:", response.data);
      const gameData = response.data.active_games["1"];

      if (!gameData) {
        console.log("❌ No active game. Ready to create.");
        setCanJoinGame(true);
        return;
      }

      if (gameData.players_count === 1) {
        console.log("🙋 One player in game. Another player can join.");
        setCanJoinGame(true);
      } else {
        console.log("👀 Game is full. Spectate mode only.");
        setCanJoinGame(false);
      }
    } catch (error) {
      console.error("⚠️ Error checking active games:", error);
      setCanJoinGame(true);
    }
  };

  const handleStartGame = async (mode: "online" | "ai" | "predict") => {
    setGameMode(mode);
    try {
      console.log(`🔄 Starting ${mode} game...`);
      const response = await axios.get(`${API_URL}/active_games`);
      const gameData = response.data.active_games["1"];

      if (!gameData) {
        // Create new game - will be player 1
        console.log("❌ No active game. Creating new game...");
        await createGame(mode);
      } else if (gameData.players_count === 1 && mode === "online") {
        // Join existing game as player 2
        console.log("🙋 Joining existing game as Player 2...");
        await joinGame("2", "human");
      } else {
        console.error("🚨 Game is full");
      }
    } catch (error) {
      console.error("❌ Error:", error);
    }
  };

  const createGame = async (mode: string) => {
    try {
      console.log(`🟢 Creating new ${mode} game...`);
      const response = await axios.post(
        `${API_URL}/create_game`,
        {
          game_mode: mode,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (response.data.status === "success" || response.data.game_id) {
        setGameId("1");
        if (mode === "ai") {
          // For AI mode, backend handles both players
          setPlayerId("1");
          setScreen("board");
        } else {
          // For online mode, creator is always player 1
          setPlayerId("1");
          setScreen("board");
        }
      }
    } catch (error) {
      console.error("❌ Error creating game:", error);
    }
  };

  const joinGame = async (playerId: string, playerType: "human" | "ai") => {
    try {
      console.log(`🟢 Joining as ${playerType} player ${playerId}...`);
      const response = await axios.post(
        `${API_URL}/join_game`,
        {
          game_id: "1",
          player_id: playerId,
          player_type: playerType,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (response.data.status === "success") {
        console.log(`✅ Joined as Player ${response.data.symbol}`);
        setPlayerId(response.data.symbol.toString());
        setScreen("board");
      } else {
        console.error("❌ Failed to join game:", response.data.error);
      }
    } catch (error) {
      console.error("❌ Error joining game:", error);
    }
  };

  console.log("gamemode", gameMode);

  return (
    <div className={styles.wrapper}>
      <div className={styles.gameContainer}>
        {screen === "landing" && (
          <GameLanding
            onNext={() => {
              setScreen("mode");
            }}
            onSpectate={() => setScreen("board")} // Directly navigate to board for spectators
            setPlayerId={setPlayerId}
          />
        )}
        {screen === "mode" && (
          <GameMode
            onBack={() => setScreen("landing")}
            onStart={handleStartGame}
          />
        )}
        {screen === "board" && gameId && (
          <GameBoard
            username={playerId || "spectator"} // Use spectator as username if spectating
            gameId={gameId}
            playerId={playerId || ""} // Pass empty string for spectators
            gameMode={gameMode}
            onBack={() => {
              setScreen("mode");
              checkGameStatus();
            }}
          />
        )}
      </div>
    </div>
  );
};

export default TicTacToe;

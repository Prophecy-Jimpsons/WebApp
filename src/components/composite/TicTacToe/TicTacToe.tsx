import { useState, useEffect } from "react";
import axios from "axios";
import GameLanding from "./components/GameLanding";
import GameMode from "./components/GameMode";
import UsernamePrompt from "./components/UsernamePrompt";
import GameBoard from "./components/GameBoard";
import styles from "./TicTacToe.module.css";

const API_URL = "https://wanemregmi.pythonanywhere.com";

const TicTacToe: React.FC = () => {
  const [screen, setScreen] = useState<"landing" | "gameMode" | "gameBoard">(
    "landing",
  );
  // Comment out unused state
  // const [showUsernamePrompt, setShowUsernamePrompt] = useState(false);
  // const [username, setUsername] = useState(
  //   localStorage.getItem("username") || "Anonymous",
  // );
  const [gameId, setGameId] = useState<string | null>("1"); // Always game_id = 1
  const [playerId, setPlayerId] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [canJoinGame, setCanJoinGame] = useState(false);

  // ✅ Check active game on mount (but do NOT create a game)
  useEffect(() => {
    console.log("🔄 Checking if game exists...");
    axios
      .get(`${API_URL}/active_games`)
      .then((response) => {
        console.log("✅ Active Games Response:", response.data);

        const gameData = response.data.active_games["1"]; // Always game_id = 1
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
      })
      .catch((error) => {
        console.error("⚠️ Error checking active games:", error);
        setCanJoinGame(true); // Default: Allow game creation
      });
  }, []);

  // Comment out unused function
  // // ✅ Called when "Continue" is clicked after entering username
  // const handleUsernameSubmit = async (name: string) => {
  //   setUsername(name);
  //   setShowUsernamePrompt(false);

  //   try {
  //     console.log("🔄 Checking if game already exists before creating...");

  //     const response = await axios.get(`${API_URL}/active_games`);
  //     console.log("✅ Active Games Response:", response.data);

  //     const gameData = response.data.active_games["1"]; // Always game_id = 1

  //     if (!gameData) {
  //       console.log("❌ No active game. Creating game first...");
  //       await createGame(name);
  //     } else if (gameData.players_count === 1) {
  //       console.log("🙋 One player is in-game. Joining as Player 2...");
  //       await joinGame(name);
  //     } else {
  //       console.error("🚨 Game is already full. Spectate instead.");
  //     }
  //   } catch (error) {
  //     console.error("❌ Error checking game existence:", error);
  //   }
  // };

  // New function to handle game start
  const handleStartGame = async () => {
    try {
      console.log("🔄 Checking if game already exists before creating...");

      const response = await axios.get(`${API_URL}/active_games`);
      console.log("✅ Active Games Response:", response.data);

      const gameData = response.data.active_games["1"]; // Always game_id = 1

      if (!gameData) {
        console.log("❌ No active game. Creating game first...");
        await createGame();
      } else if (gameData.players_count === 1) {
        console.log("🙋 One player is in-game. Joining as Player 2...");
        await joinGame("2");
      } else {
        console.error("🚨 Game is already full. Spectate instead.");
      }
    } catch (error) {
      console.error("❌ Error checking game existence:", error);
    }
  };

  // Modified createGame function
  const createGame = async () => {
    try {
      console.log("🟢 Creating a new game...");
      const response = await axios.post(`${API_URL}/create_game`);
      console.log("✅ Game created:", response.data);

      setGameId("1");
      await joinGame("1"); // Automatically join as Player 1 after creation
    } catch (error) {
      console.error("❌ Error creating game:", error);
    }
  };

  // Modified joinGame function
  const joinGame = async (playerName: string) => {
    try {
      console.log(`🟢 Joining game 1 as ${playerName}...`);
      const response = await axios.post(`${API_URL}/join_game`, {
        game_id: "1",
        player_id: playerName,
        player_type: "human",
      });

      if (response.data.status === "success") {
        console.log(`✅ Joined game 1 as Player ${response.data.symbol}`);
        setPlayerId(response.data.symbol.toString());
        setScreen("gameBoard");
      } else {
        console.error("❌ Error joining game:", response.data);
      }
    } catch (error) {
      console.error("❌ Error joining game:", error);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.gameContainer}>
        {screen === "landing" && (
          <GameLanding onNext={() => setScreen("gameMode")} />
        )}
        {screen === "gameMode" && (
          <GameMode
            onBack={() => setScreen("landing")}
            onStart={handleStartGame} // Changed to use new handleStartGame function
          />
        )}
        {/* Comment out unused component */}
        {/* {showUsernamePrompt && (
          <UsernamePrompt
            onSubmit={handleUsernameSubmit}
            onClose={() => setShowUsernamePrompt(false)}
          />
        )} */}
        {screen === "gameBoard" && gameId && playerId && (
          <GameBoard
            username={playerId} // Changed to use playerId as username
            gameId={gameId}
            playerId={playerId}
            onBack={() => setScreen("gameMode")}
          />
        )}
      </div>
    </div>
  );
};

export default TicTacToe;

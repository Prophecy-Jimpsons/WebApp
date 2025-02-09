import { useState } from "react";
import GameLanding from "./components/GameLanding";
import GameMode from "./components/GameMode";
import UsernamePrompt from "./components/UsernamePrompt";
import GameBoard from "./components/GameBoard"; // Import GameBoard
import styles from "./TicTacToe.module.css";

const TicTacToe: React.FC = () => {
  const [screen, setScreen] = useState<"landing" | "gameMode" | "gameBoard">(
    "landing",
  );
  const [showUsernamePrompt, setShowUsernamePrompt] = useState(false);
  const [username, setUsername] = useState(
    localStorage.getItem("username") || "Anonymous",
  );

  const handleUsernameSubmit = (name: string) => {
    setUsername(name);
    setShowUsernamePrompt(false);
    setScreen("gameBoard"); // Move to game board after entering username
  };

  const handleClosePrompt = () => {
    setShowUsernamePrompt(false);
    setScreen("gameMode"); // Go back to game mode selection when closing prompt
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
            onStart={() => setShowUsernamePrompt(true)}
          />
        )}
        {showUsernamePrompt && (
          <UsernamePrompt
            onSubmit={handleUsernameSubmit}
            onClose={handleClosePrompt}
          />
        )}
        {screen === "gameBoard" && (
          <GameBoard username={username} onBack={() => setScreen("gameMode")} />
        )}
      </div>
    </div>
  );
};

export default TicTacToe;

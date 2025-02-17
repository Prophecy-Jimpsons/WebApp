import styles from "./GameMode.module.css";
import UsernamePrompt from "./UsernamePrompt";
import { useState, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";

interface GameModeProps {
  gameMode: "online" | "ai" | "predict" | null;
  gameExists: boolean;
  canJoinGame: boolean;
  onBack: () => void;
  onStart: (mode: "online" | "ai" | "predict") => void;
}

const GameMode: React.FC<GameModeProps> = ({
  canJoinGame,
  onBack,
  onStart,
  gameExists,
}) => {
  const [showUsernamePrompt, setShowUsernamePrompt] = useState(false);
  const [selectedMode, setSelectedMode] = useState<
    "online" | "ai" | "predict" | null
  >(null);
  const { publicKey } = useWallet();
  const [isCreatingGame, setIsCreatingGame] = useState(true);

  // Debug log to check wallet connection
  useEffect(() => {
    console.log("Wallet public key:", publicKey?.toString());
  }, [publicKey]);

  useEffect(() => {
    const storedMode = localStorage.getItem("gameMode");
    if (
      storedMode === "online" ||
      storedMode === "ai" ||
      storedMode === "predict"
    ) {
      setSelectedMode(storedMode);
    }
  }, []);

  useEffect(() => {
    setIsCreatingGame(!gameExists || !canJoinGame);
  }, [gameExists, canJoinGame]);

  const handleModeClick = (mode: "online" | "ai" | "predict") => {
    setSelectedMode(mode);
    setShowUsernamePrompt(true);
  };

  const handleUsernameSubmit = (username: string) => {
    setShowUsernamePrompt(false);
    if (selectedMode) {
      localStorage.setItem("gameMode", selectedMode);
      localStorage.setItem("username", username);
      onStart(selectedMode);
    }
  };

  return (
    <div className={styles.container}>
      <button className={styles.backButton} onClick={onBack}>
        ← Back
      </button>
      <h1 className={styles.title}>Choose Your Game Mode</h1>
      <button
        className={styles.button}
        onClick={() => handleModeClick("online")}
      >
        {gameExists && canJoinGame ? "Join Game" : "Challenge a Human"}
      </button>
      <button
        className={`${canJoinGame && gameExists ? styles.disabled : ""} ${styles.button}`}
        onClick={() => handleModeClick("ai")}
        disabled={!canJoinGame}
      >
        Face AVAI (AI Opponent)
      </button>
      <button
        className={styles.button + " " + styles.disabled}
        onClick={() => handleModeClick("predict")}
        disabled
      >
        Predict the Game
      </button>

      {showUsernamePrompt && (
        <UsernamePrompt
          onSubmit={handleUsernameSubmit}
          onClose={() => setShowUsernamePrompt(false)}
          publicKey={publicKey?.toString()}
          isCreatingGame={isCreatingGame}
        />
      )}
    </div>
  );
};

export default GameMode;

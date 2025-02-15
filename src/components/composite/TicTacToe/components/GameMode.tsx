import styles from "./GameMode.module.css";

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
  return (
    <div className={styles.container}>
      <button className={styles.backButton} onClick={onBack}>
        ← Back
      </button>
      <h1 className={styles.title}>Choose Your Game Mode</h1>
      <button className={styles.button} onClick={() => onStart("online")}>
        {gameExists && canJoinGame ? "Join Game" : "Challenge a Human"}
      </button>
      <button
        className={`${canJoinGame && gameExists ? styles.disabled : ""} ${styles.button}`}
        onClick={() => onStart("ai")}
        disabled={!canJoinGame}
      >
        Face AVAI (AI Opponent)
      </button>
      <button
        className={styles.button + " " + styles.disabled}
        onClick={() => onStart("predict")}
        disabled
      >
        Predict the Game
      </button>
    </div>
  );
};

export default GameMode;

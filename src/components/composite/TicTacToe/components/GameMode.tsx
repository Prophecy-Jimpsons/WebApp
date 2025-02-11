import styles from "./GameMode.module.css";

interface GameModeProps {
  onBack: () => void;
  onStart: (mode: 'online' | 'ai' | 'predict') => void;
}

const GameMode: React.FC<GameModeProps> = ({ onBack, onStart }) => {
  return (
    <div className={styles.container}>
      <button className={styles.backButton} onClick={onBack}>
        ← Back
      </button>
      <h1 className={styles.title}>Choose Your Game Mode</h1>
      <button className={styles.button} onClick={() => onStart('online')}>
        Online VS
      </button>
      <button className={styles.button} onClick={() => onStart('ai')}>
        Play with AI
      </button>
      <button className={styles.button} onClick={() => onStart('predict')}>
        Predict the Game
      </button>
    </div>
  );
};

export default GameMode;

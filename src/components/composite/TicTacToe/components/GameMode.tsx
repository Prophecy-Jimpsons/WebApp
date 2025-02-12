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
        Challenge a Human
      </button>
      <button className={styles.button} onClick={() => onStart('ai')}>
        Face AVAI (AI Opponent)
      </button>
      <button className={styles.button} onClick={() => onStart('predict')} disabled>
        Predict the Game
      </button>
    </div>
  );
};

export default GameMode;

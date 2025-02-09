// import styles from "./GameMode.module.css";

// interface GameModeProps {
//   onBack: () => void;
//   onStart: () => void;
// }

// const GameMode: React.FC<GameModeProps> = ({ onBack, onStart }) => {
//   return (
//     <div className={styles.container}>
//       <button className={styles.backButton} onClick={onBack}>
//         ← Back
//       </button>
//       <h1 className={styles.title}>Choose Your Game Mode</h1>
//       <button className={styles.button} onClick={onStart}>
//         Online VS
//       </button>
//       <button className={`${styles.button} ${styles.disabled}`} disabled>
//         Play with AI (Coming Soon)
//       </button>
//       <button className={`${styles.button} ${styles.disabled}`} disabled>
//         Predict the Game (Coming Soon)
//       </button>
//     </div>
//   );
// };

// export default GameMode;

import styles from "./GameMode.module.css";

interface GameModeProps {
  onBack: () => void;
  onStart: () => void;
}

const GameMode: React.FC<GameModeProps> = ({ onBack, onStart }) => {
  return (
    <div className={styles.container}>
      <button className={styles.backButton} onClick={onBack}>
        ← Back
      </button>
      <h1 className={styles.title}>Choose Your Game Mode</h1>
      <button className={styles.button} onClick={onStart}>
        Online VS
      </button>
      <button className={styles.button} onClick={onStart}>
        Play with AI
      </button>
      <button className={styles.button} onClick={onStart}>
        Predict the Game
      </button>
    </div>
  );
};

export default GameMode;

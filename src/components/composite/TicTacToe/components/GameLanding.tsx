import { useState } from "react";
import styles from "./GameLanding.module.css";

interface LandingProps {
  onNext: () => void;
}

// Mocking session state (Default: No active session)
const mockSessionActive = false;

const GameLanding: React.FC<LandingProps> = ({ onNext }) => {
  const [sessionActive] = useState(mockSessionActive);

  return (
    <div className={styles.container}>
      {/* Game Title */}
      <h1 className={styles.title}>Tic Tac Toe</h1>
      <p className={styles.subtitle}>A New Era of Strategy & Fun!</p>

      {/* Game Description */}
      <p className={styles.description}>
        Play <b className={styles.primaryColor}>4x4 Super Tic-Tac-Toe</b> with
        friends or spectate real-time battles. A sleek, modern twist to the
        classic strategy game.
      </p>

      {/* Buttons */}
      <div className={styles.buttonContainer}>
        <button
          className={`${styles.primaryButton} ${sessionActive ? styles.disabled : ""}`}
          onClick={onNext}
          disabled={sessionActive}
        >
          Play Game
        </button>
        <button
          className={`${styles.secondaryButton} ${!sessionActive ? styles.disabled : ""}`}
          disabled={!sessionActive}
        >
          Spectate Game
        </button>
      </div>
    </div>
  );
};

export default GameLanding;

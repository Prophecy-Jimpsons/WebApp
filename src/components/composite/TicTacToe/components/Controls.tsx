import React from "react";
import styles from "./GameBoard.module.css";

const Controls: React.FC<{
  onBack: () => void;
  onReset: () => void;
  isGameOver: boolean;
}> = ({ onBack, onReset, isGameOver }) => {
  console.log("isGameOver", isGameOver);
  return (
    <div className={styles.controls}>
      <button className={styles.backButton} onClick={onBack}>
        ← Back
      </button>

      {/* Only visable when game is over */}
      {isGameOver && (
        <button
          className={`${styles.restartButton} ${styles.fadeIn}`}
          onClick={onReset}
        >
          Start New Game
        </button>
      )}
    </div>
  );
};

export default Controls;

import React from "react";
import styles from "./GameBoard.module.css";

const Controls: React.FC<{
  onBack: () => void;
  onReset: () => void;
  playerId: string;
  isGameOver: boolean;
}> = ({ onBack, onReset, isGameOver, playerId }) => {
  return (
    <div className={styles.controls}>
      <button className={styles.backButton} onClick={onBack}>
        ← Back
      </button>

      {/* Only visable when game is over */}
      {isGameOver && playerId !== "spectator" && (
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

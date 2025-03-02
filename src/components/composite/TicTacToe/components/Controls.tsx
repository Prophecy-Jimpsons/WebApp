import React, { useState } from "react";
import styles from "./GameBoard.module.css";

const Controls: React.FC<{
  onBack: () => void;
  onReset: () => void;
  playerId: string;
  isGameOver: boolean;
}> = ({ onBack, onReset, isGameOver, playerId }) => {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleResetClick = () => {
    setShowConfirm(true);
  };

  const confirmReset = () => {
    setShowConfirm(false);
    onReset();
  };

  return (
    <div className={styles.controls}>
      <button className={styles.backButton} onClick={onBack}>
        ← Back
      </button>

      {/* Only visible when the game is over and the player is not a spectator */}
      {isGameOver && playerId !== "spectator" && (
        <button
          className={`${styles.restartButton} ${styles.fadeIn}`}
          onClick={handleResetClick}
        >
          Start New Game
        </button>
      )}

      {/* Confirmation Modal */}
      {/* {showConfirm && (
        <div className={styles.confirmModal}>
          <div className={styles.confirmModalContent}>
            <h2>Restart Game?</h2>
            <p>Are you sure you want to start a new game?</p>
            <button className={styles.confirmButton} onClick={confirmReset}>
              Yes, Restart
            </button>
            <button
              className={styles.cancelButton}
              onClick={() => setShowConfirm(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )} */}
    </div>
  );
};

export default Controls;

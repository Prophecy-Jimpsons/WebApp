import React, { useState } from "react";
import styles from "./GameBoard.module.css";
import axios from "axios";

const API_URL = "https://wanemregmi.pythonanywhere.com";

const Controls: React.FC<{
  onBack: () => void;
  onReset: () => void;
  playerId: string;
  isGameOver: boolean;
}> = ({ onBack, onReset, isGameOver, playerId }) => {
  const [isResetting, setIsResetting] = useState(false);

  const handleResetClick = async () => {
    setIsResetting(true);
    
    try {
      // Check if there are any active games
      const response = await axios.get(`${API_URL}/active_games`);
      const activeGames = response.data.active_games;
      
      // If there are no active games (empty object), call reset
      if (Object.keys(activeGames).length === 0) {
        console.log("No active games found, safe to reset");
        onReset();
      } else {
        console.log("Active games exist, going back to mode selection");
        onBack(); // Just go back without resetting if games exist
      }
    } catch (error) {
      console.error("Error checking active games:", error);
      // On error, still allow reset as a fallback
      onReset();
    } finally {
      setIsResetting(false);
    }
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
          disabled={isResetting}
        >
          {isResetting ? "Checking..." : "Start New Game"}
        </button>
      )}
    </div>
  );
};

export default Controls;


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
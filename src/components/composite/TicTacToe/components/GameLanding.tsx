// GameLanding.tsx
import React, { useCallback, useState } from "react";
import styles from "./GameLanding.module.css";
import RulesModal from "./RulesModal";
import axios from "axios";


const API_URL = "https://wanemregmi.pythonanywhere.com";

interface LandingProps {
  onNext: () => void;
  onSpectate: () => void;
  setPlayerId: (id: string) => void;
  canJoinGame: boolean;
  gameExists: boolean;
}

const GameLanding: React.FC<LandingProps> = ({
  onNext,
  onSpectate,
  setPlayerId,
  canJoinGame,
  gameExists,
}) => {
  const [isRulesOpen, setIsRulesOpen] = useState(false);

  const handleRulesClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsRulesOpen(true);
  };

  // const handleSpectate = () => {
  //   if (gameExists) setPlayerId("spectator");
  //   onSpectate();
  // };

    const callResetEndpoint = useCallback(async () => {
      try {
        await fetch("https://wanemregmi.pythonanywhere.com/reset_all", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });
      } catch (error) {
        console.error("Error calling reset endpoint:", error);
      }
    }, []);

    const handleSpectate = async () => {
      if (gameExists) {
        try {
          // Get current game status when spectating
          const response = await axios.get(`${API_URL}/active_games`);
          const gameData = response.data.active_games["1"];
          
          if (!gameData) {
            console.log("No active game found.");
            setPlayerId("spectator");
            onSpectate();
            return;
          }
          
          // Check last activity timestamp
          const lastActivityTime = gameData.last_activity;
          const currentTime = Date.now() / 1000; // Convert to seconds to match API format
          const inactiveTime = currentTime - lastActivityTime;
          
          // If game has been inactive for more than 30 seconds
          if (inactiveTime > 30) {
            console.log("Game inactive for more than 30 seconds. Resetting...");
            // Call reset endpoint
            await callResetEndpoint();
            // Refresh page to show updated game state
            window.location.reload();
            return;
          }
          
          // Otherwise proceed with spectating
          setPlayerId("spectator");
          onSpectate();
        } catch (error) {
          console.error("Error checking game status:", error);
          // Still allow spectating in case of error
          setPlayerId("spectator");
          onSpectate();
        }
      } else {
        console.log("No game exists to spectate");
      }
    };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>4x4 JIMP-TAC-TOE</h1>
      <p className={styles.subtitle}>Tic-Tac-Toe on Steroids!</p>

      <div className={styles.description}>
        <p>
          Regular Tic-Tac-Toe? Boring! Play our{" "}
          <b className={styles.primaryColor}>
            <a
              href="#"
              onClick={handleRulesClick}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              4x4 version
            </a>
          </b>{" "}
          against friends or AVAI, our AI that's probably planning world
          domination.
        </p>
      </div>

      <div className={styles.buttonContainer}>
        <button
          className={`${styles.primaryButton} ${
            gameExists && !canJoinGame ? styles.disabled : ""
          }`}
          disabled={gameExists && !canJoinGame}
          onClick={onNext}
        >
          {canJoinGame && gameExists ? "Join Game" : "Play Game"}
        </button>

        <button
          className={`${styles.secondaryButton} ${
            !gameExists ? styles.disabled : ""
          }`}
          onClick={handleSpectate}
          disabled={!gameExists}
        >
          Spectate Game
        </button>
      </div>

      <RulesModal isOpen={isRulesOpen} onClose={() => setIsRulesOpen(false)} />
    </div>
  );
};

export default GameLanding;

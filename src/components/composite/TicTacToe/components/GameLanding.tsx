import { useState, useEffect } from "react";
import axios from "axios";
import styles from "./GameLanding.module.css";

interface LandingProps {
  onNext: () => void;
}

const API_URL = "https://wanemregmi.pythonanywhere.com";

const GameLanding: React.FC<LandingProps> = ({ onNext }) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [gameExists, setGameExists] = useState(false);
  const [canSpectate, setCanSpectate] = useState(false);

  // ✅ Check active game on mount
  useEffect(() => {
    console.log("🔄 Checking active games...");
    axios
      .get(`${API_URL}/active_games`)
      .then((response) => {
        console.log("✅ Active Games Response:", response.data);

        const gameData = response.data.active_games["1"]; // Always check game_id = 1
        if (!gameData) {
          console.log("❌ No active game. Allowing Play Game.");
          setGameExists(false);
          setCanSpectate(false);
          return;
        }

        const playerCount = gameData.players_count;
        setGameExists(true);

        if (playerCount === 2) {
          console.log("👀 Game is full. Spectate mode enabled.");
          setCanSpectate(true);
        } else {
          console.log("🎲 Game has space. Allowing Play Game.");
          setCanSpectate(false);
        }
      })
      .catch((error) => {
        console.error("⚠️ Error checking active games:", error);
      });
  }, []);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Tic Tac Toe</h1>
      <p className={styles.subtitle}>A New Era of Strategy & Fun!</p>

      <p className={styles.description}>
        Play <b className={styles.primaryColor}>4x4 Super Tic-Tac-Toe</b> with
        friends or spectate real-time battles. A sleek, modern twist to the
        classic strategy game.
      </p>

      <div className={styles.buttonContainer}>
        <button
          className={`${styles.primaryButton}`}
          onClick={onNext} // ✅ Always allow Play Game
        >
          Play Game
        </button>

        <button
          className={`${styles.secondaryButton} ${
            !canSpectate ? styles.disabled : ""
          }`}
          onClick={() => console.log("🔎 Spectating Game")}
          disabled={!canSpectate} // ✅ Spectate if full
        >
          Spectate Game
        </button>
      </div>
    </div>
  );
};

export default GameLanding;

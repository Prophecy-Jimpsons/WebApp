import React from "react";
import styles from "./GameLanding.module.css";

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
  const handleSpectate = () => {
    if (gameExists) setPlayerId("spectator"); // Set playerId as spectator
    onSpectate(); // Directly navigate to board for spectating
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
              href="https://jimpsons.gitbook.io/jimpsons.org/getting-started/4x4-jimp-tac-toe"
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
          className={`${styles.primaryButton} ${gameExists && !canJoinGame ? styles.disabled : ""}`}
          disabled={gameExists && !canJoinGame}
          onClick={onNext} // ✅ Navigate to board
        >
          {canJoinGame && gameExists ? "Join Game" : "Play Game"}
        </button>

        <button
          className={`${styles.secondaryButton} ${
            !gameExists ? styles.disabled : ""
          }`}
          onClick={handleSpectate}
          disabled={!gameExists} // ✅ Spectate if full
        >
          Spectate Game
        </button>
      </div>
    </div>
  );
};

export default GameLanding;

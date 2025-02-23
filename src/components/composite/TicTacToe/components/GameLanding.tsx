// GameLanding.tsx
import React, { useState } from "react";
import styles from "./GameLanding.module.css";
import RulesModal from "./RulesModal";

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

  const handleSpectate = () => {
    if (gameExists) setPlayerId("spectator");
    onSpectate();
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

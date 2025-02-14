import React from "react";
// import axios from "axios";
import styles from "./GameLanding.module.css";

interface LandingProps {
  onNext: () => void;
  onSpectate: () => void; // Add this prop for spectating
  setPlayerId: (id: string) => void;
  canJoinGame: boolean;
  gameExists: boolean;
}

// const API_URL = "https://wanemregmi.pythonanywhere.com";

const GameLanding: React.FC<LandingProps> = ({
  onNext,
  onSpectate,
  setPlayerId,
  canJoinGame,
  gameExists,
}) => {
  // const [gameExists, setGameExists] = useState(false);
  // const [canJoin, setCanJoin] = useState(false);
  // const [isGameFinished, setIsGameFinished] = useState(false);

  // useEffect(() => {
  //   console.log("🔄 Checking active games...");
  //   axios
  //     .get(`${API_URL}/active_games`)
  //     .then((response) => {
  //       console.log("✅ Active Games Response:", response.data);
  //       const activeGames = response.data.active_games;
  //       setIsGameFinished(Object.keys(activeGames).length === 0);

  //       const gameData = activeGames["1"]; // Always check game_id = 1
  //       if (!gameData) {
  //         console.log("❌ No active game. Allowing Play Game.");
  //         setGameExists(false);
  //         setCanJoin(false);
  //         return;
  //       }

  //       const playerCount = gameData.players_count;
  //       const playingWithAI = gameData.playing_with_ai;
  //       setGameExists(true);

  //       if (playingWithAI) {
  //         console.log("🤖 Playing with AI. Allowing Play Game.");
  //         setCanJoin(false);
  //       } else {
  //         if (playerCount < 2) {
  //           console.log("🎲 Game has space. Allowing Join Game.");
  //           setCanJoin(true);
  //         } else {
  //           console.log("👀 Game is full. Spectate mode enabled.");
  //           setCanJoin(false);
  //         }
  //       }
  //     })
  //     .catch((error) => {
  //       console.error("⚠️ Error checking active games:", error);
  //     });
  // }, []);

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
            Regular Tic-Tac-Toe? Boring! Play our <b className={styles.primaryColor}><a href="https://jimpsons.gitbook.io/jimpsons.org/getting-started/tic-tac-toe-game-for-jimpsons" style={{textDecoration: 'none', color: 'inherit'}}>4x4 version</a></b> against friends or AVAI, our AI that's probably planning world domination.
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

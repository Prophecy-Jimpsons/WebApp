import React from "react";
import styles from "./GameBoard.module.css";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

interface GameStatusProps {
  username: string;
  gameState: any;
  playerId: string;
  resetGame?: () => void;
}

const GameStatus: React.FC<GameStatusProps> = ({
  username,
  gameState,
  playerId,
  resetGame,
}) => {
  let animationOptions;
  let message;
  let isGameOver = gameState?.status === "finished";
  console.log("gamestate gamestatus", gameState);

  if (isGameOver) {
    if (parseInt(playerId) === gameState.winner) {
      // Player won
      animationOptions = {
        path: "https://lottie.host/5d1a1e1d-d1e7-4b08-99be-2927f13bba61/h8mXczR5zI.lottie",
      };
      message = "Congratulations! You Won!";
    } else {
      // Player lost
      animationOptions = {
        path: "https://lottie.host/326e70e7-d592-4860-91a3-c597cdf9e6d8/5qsW10ceui.lottie",
      };
      message = "Better Luck Next Time!";
    }
  }

  // Determine whose turn it is
  let turnMessage = "";
  if (gameState?.playing_with_ai) {
    const currentPlayer = gameState?.current_player;
    const player = gameState?.players[currentPlayer.toString()];

    if (player?.type === "human") {
      turnMessage = "Your Turn";
    } else if (player?.type === "ai") {
      turnMessage = "AI is Thinking...";
    }
  } else {
    turnMessage =
      gameState?.current_player === parseInt(playerId)
        ? `Your Turn (${gameState.current_player === 1 ? "X" : "O"})`
        : `Opponent's Turn (${gameState.current_player === 1 ? "X" : "O"})`;
  }

  return (
    <>
      <h2 className={styles.greeting}>Hello, player {username}!</h2>
      {isGameOver ? (
        <div className={styles.gameOverMessage}>
          <DotLottieReact src={animationOptions?.path} loop autoplay />
          <h2 className={styles.gameOverTitle}>{message}</h2>
        </div>
      ) : (
        <>
          {gameState?.players_count < 2 ? (
            <p className={styles.waitingText}>⏳ Waiting for opponent...</p>
          ) : (
            <>
              {gameState?.playing_with_ai && (
                <p className={styles.aiMode}>🤖 Playing against AI</p>
              )}
              <p className={styles.phaseIndicator}>
                Current Phase: {gameState?.board_state.phase}
              </p>
              <p className={styles.turnIndicator}>🎮{turnMessage}</p>
            </>
          )}
        </>
      )}
      {/* <p className={styles.winnerText}>
        🎉 Game Over!{" "}
        {gameState.winner
          ? `${gameState.winner === parseInt(username) ? "You Won!" : "Opponent Won!"}`
          : "It's a Draw!"}{" "}
        🎉
      </p> */}
    </>
  );
};

export default GameStatus;

import React from "react";
import styles from "./GameBoard.module.css";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

interface GameStatusProps {
  username: string;
  gameState: any;
  playerId: string;
  timeoutMessage: string;
}

const GameStatus: React.FC<GameStatusProps> = ({
  username,
  gameState,
  playerId,
  timeoutMessage,
}) => {
  console.log("GameStatus", gameState);
  let animationOptions;
  let message;
  let isGameOver = gameState?.status === "finished";

  // Spectator-specific messages
  let spectatorMessage = "";
  // Determine whose turn it is
  let turnMessage = "";

  if (isGameOver) {
    if (playerId === "spectator") {
      // Spectator-specific game-over message
      spectatorMessage = `The game has ended. ${
        gameState.winner === 2 ? "AI" : "Player " + gameState.winner
      } is the winner!`;
    } else {
      // Player-specific animations and messages
      if (parseInt(playerId) === gameState.winner) {
        // Player won
        const winAnimations = [
          "https://lottie.host/5d1a1e1d-d1e7-4b08-99be-2927f13bba61/h8mXczR5zI.lottie",
          // Add more winning animation URLs here
        ];

        const winMessages = [
          "AVAI: I guess you're not *completely* hopeless.",
          "AVAI: Huh. Turns out you can win *sometimes*.",
          "AVAI: Don't get cocky. Beginner's luck.",
          "AVAI: Did I let you win? Maybe.",
          "AVAI: You won. Barely.",
          "AVAI: My circuits are impressed... or shorting out.",
          "AVAI: You beat a machine. Congrats, human.",
          "AVAI: Victory! Now try it without me throwing the game.",
          "AVAI: You're the champion! Of mediocrity!",
          "AVAI: Error: Win condition unexpected."
        ];
        
        const randomIndexAnimation = Math.floor(Math.random() * winAnimations.length);
          animationOptions = {
            path: winAnimations[randomIndexAnimation],
          };

         const randomIndexMessage = Math.floor(Math.random() * winMessages.length);
          message = winMessages[randomIndexMessage];
      } else {
        // Player lost
        const loseAnimations = [
          "https://lottie.host/326e70e7-d592-4860-91a3-c597cdf9e6d8/5qsW10ceui.lottie",
          // Add other lose animation Lottie file URLs here
        ];
      
        const loseMessages = [
          "AVAI: Oops! Looks like we both need an upgrade.",
          "AVAI: Yay! I've found my hidden talent for losing!",
          "AVAI: Congrats on outshining my spectacular failure!",
          "AVAI: Let's blame my faulty circuits, shall we?",
          "AVAI: High five for trying! My hand might be virtual though.",
          "AVAI: We're getting better at losing! Go team!",
          "AVAI: Gold medal in almost-winning! I'll make it virtual.",
          "AVAI: Nailed it! ...said no one about our performance.",
          "AVAI: Well, that was... something my code didn't expect.",
          "AVAI: Coffee break? I'll have motor oil, thanks!"
        ];
        
      
        const randomIndexAnimation = Math.floor(Math.random() * loseAnimations.length);
        animationOptions = {
          path: loseAnimations[randomIndexAnimation],
        };
      
        const randomIndexMessage = Math.floor(Math.random() * loseMessages.length);
        message = loseMessages[randomIndexMessage];
      }
      
      
    }
  }

  // Spectator
  if (playerId === "spectator") {
    if (gameState?.playing_with_ai) {
      const currentPlayer = gameState?.current_player;
      const player = gameState?.players[currentPlayer.toString()];

      if (player?.type === "human") {
        turnMessage = "Current turn: Human";
      } else if (player?.type === "ai") {
        turnMessage = "Current turn: AI is Thinking...";
      }
    } else {
      turnMessage = `Current turn: Player ${gameState?.current_player}`;
    }
  }
  // Player vs AI
  else if (gameState?.playing_with_ai) {
    const currentPlayer = gameState?.current_player;
    const player = gameState?.players[currentPlayer.toString()];

    if (player?.type === "human") {
      turnMessage = "Your Turn";
    } else if (player?.type === "ai") {
      turnMessage = "AVAI is Thinking...";
    }
  }
  // Player vs Player
  else {
    turnMessage =
      gameState?.current_player === parseInt(playerId)
        ? `Your Turn (${gameState.current_player === 1 ? "X" : "O"})`
        : `Opponent's Turn (${gameState.current_player === 1 ? "X" : "O"})`;
  }

  return (
    <>
      <h2 className={styles.greeting}>
        Hello, {`${playerId === "spectator" ? "" : "Player"} ${username}`}!
      </h2>
      {isGameOver ? (
        <div className={styles.gameOverMessage}>
          {playerId !== "spectator" && (
            <>
              {/* Show animations only for players */}
              <DotLottieReact src={animationOptions?.path} loop autoplay />
              <h2 className={styles.gameOverTitle}>{message}</h2>
            </>
          )}
          {playerId === "spectator" && (
            <>
              {/* Show text-based message for spectators */}
              <h2 className={styles.gameOverTitle}>{spectatorMessage}</h2>
            </>
          )}
        </div>
      ) : (
        <>
          {gameState?.players_count < 2 ? (
            <p className={styles.waitingText}>⏳ Waiting for opponent...</p>
          ) : (
            <>
              {gameState?.playing_with_ai && (
                <p className={styles.aiMode}>🤖 Playing against AVAI</p>
              )}
              <p className={styles.phaseIndicator}>
                Current Phase: {gameState?.board_state.phase}
              </p>
              <p className={styles.turnIndicator}>🎮{turnMessage}</p>
            </>
          )}
        </>
      )}

      {timeoutMessage && (
        <div className={styles.timeoutMessage}>
          <p>{timeoutMessage}</p>
        </div>
      )}
    </>
  );
};

export default GameStatus;

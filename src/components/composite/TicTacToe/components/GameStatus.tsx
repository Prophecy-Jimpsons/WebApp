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

  const callResetEndpoint = async () => {
    try {
      await fetch('https://wanemregmi.pythonanywhere.com/reset_all', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log('Reset endpoint called successfully');
    } catch (error) {
      console.error('Error calling reset endpoint:', error);
    }
  };

  // Spectator-specific messages
  let spectatorMessage = "";
  // Determine whose turn it is
  let turnMessage = "";

  if (isGameOver) {
    callResetEndpoint();
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
          "AVAI: Wow, you actually won! Did you cheat?",
          "AVAI: Victory! Your trophy is in another castle.",
          "AVAI: Congrats! You've leveled up from 'Noob' to 'Slightly Less Noob'.",
          "AVAI: Winner! Now go touch some grass.",
          "AVAI: You won! Want a cookie? Too bad, I can't bake.",
          "AVAI: Victory dance time! I'll pretend I'm not watching.",
          "AVAI: Winning move! High five! ...Oh right, I'm digital.",
          "AVAI: Champion status unlocked! Use code 'WINNER' for 0% off nothing.",
          "AVAI: You're on fire! Should I call the virtual fire department?",
          "AVAI: Winner! Next challenge: Explain your strategy to a goldfish."
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
          "AVAI: Ouch! Did your skills take a vacation?",
          "AVAI: Congrats! You've mastered the art of not winning.",
          "AVAI: Game over! Have you tried turning yourself off and on again?",
          "AVAI: Lost again? At least you're consistent!",
          "AVAI: You didn't lose, you just came in second-to-last place.",
          "AVAI: Defeat: It's not just a river in Egypt. Oh wait, that's denial.",
          "AVAI: On the bright side, you're really good at losing!",
          "AVAI: Game over! Insert more practice to continue.",
          "AVAI: You participated! That's... something, right?",
          "AVAI: Remember, in games as in life: You win some, you lose most."
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
      {isGameOver
        ? `Game Over! ${gameState.winner === 2 ? "AVAI" : "Player " + gameState.winner} Wins!`
        : `Hello, ${playerId === "spectator" ? "" : "Player"} ${username}!`}
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

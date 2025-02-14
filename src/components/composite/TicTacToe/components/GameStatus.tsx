import React, { useEffect, useState, useCallback, useRef } from "react";
import styles from "./GameBoard.module.css";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export interface GameState {
  board_state: {
    board: number[][];
    last_move: null | [number, number];
    phase: "placement" | "movement";
    pieces_placed: Record<string, number>;
  };
  current_player: number;
  players: Record<string, Player>;
  playing_with_ai: boolean;
  status: string;
  winner?: number | null;
  last_activity: number;
}

interface Player {
  id: string;
  symbol: number;
  type: "human" | "ai";
}

interface GameStatusProps {
  username: string;
  gameState: GameState;
  playerId: string;
  timeoutMessage: string;
}

const AVAI_MESSAGES = {
  waiting: [
    "AVAI: Waiting for another player...",
    "AVAI: Ready when you are!",
    "AVAI: Shall we begin?",
  ],
  placement: [
    "AVAI: Place your pieces wisely!",
    "AVAI: Setting up the board, are we?",
    "AVAI: Strategic placement is key!",
  ],
  movement: [
    "AVAI: Time to make your move!",
    "AVAI: Where will you go next?",
    "AVAI: The game is afoot!",
  ],
  aiTurn: [
    "AVAI: My turn to shine!",
    "AVAI: Calculating optimal move...",
    "AVAI: Watch and learn, human!",
  ],
  victory: [
    "AVAI: Impossible! You must have cheated!",
    "AVAI: Congratulations... I guess.",
    "AVAI: You got lucky this time!",
  ],
  defeat: [
    "AVAI: As expected, I am victorious!",
    "AVAI: Better luck next time, human!",
    "AVAI: Did you even try?",
  ],
};

const GameStatus: React.FC<GameStatusProps> = ({
  username,
  gameState,
  playerId,
  timeoutMessage,
}) => {
  const [avaiMessage, setAvaiMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const getRandomMessage = (messages: string[]) =>
    messages[Math.floor(Math.random() * messages.length)];

  const updateAvaiMessage = useCallback((state: GameState) => {
    setIsTyping(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      let newMessage = "";
      const actualPlayersCount = Object.keys(state.players).length;

      if (actualPlayersCount < 2) {
        newMessage = getRandomMessage(AVAI_MESSAGES.waiting);
      } else if (state.status === "ongoing") {
        if (state.playing_with_ai && state.current_player !== parseInt(playerId)) {
          newMessage = getRandomMessage(AVAI_MESSAGES.aiTurn);
        } else {
          newMessage = getRandomMessage(state.board_state.phase === "placement" 
            ? AVAI_MESSAGES.placement 
            : AVAI_MESSAGES.movement);
        }
      } else if (state.status === "finished") {
        newMessage = state.winner === parseInt(playerId)
          ? getRandomMessage(AVAI_MESSAGES.victory)
          : getRandomMessage(AVAI_MESSAGES.defeat);
      }

      setAvaiMessage(newMessage);
      setIsTyping(false);
    }, 800);
  }, [playerId]);

  useEffect(() => {
    updateAvaiMessage(gameState);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [gameState, updateAvaiMessage]);

  const renderGameStatus = () => {
    const actualPlayersCount = Object.keys(gameState.players).length;

    if (actualPlayersCount < 2) {
      return <p className={styles.waitingText}>⏳ Waiting for opponent to join...</p>;
    }

    if (gameState.status === "ongoing") {
      return (
        <>
          {gameState.playing_with_ai && <p className={styles.aiMode}>🤖 Playing against AVAI</p>}
          <p className={styles.phaseIndicator}>Current Phase: {gameState.board_state.phase}</p>
          <p className={styles.turnIndicator}>
            🎮 {gameState.current_player === parseInt(playerId) ? "Your Turn" : "Opponent's Turn"}
          </p>
        </>
      );
    }

    if (gameState.status === "finished") {
      return (
        <div className={styles.gameOverMessage}>
          <h2 className={styles.gameOverTitle}>
            Game Over! {gameState.winner === parseInt(playerId) ? "You Win!" : "You Lose!"}
          </h2>
        </div>
      );
    }

    return null;
  };

  return (
    <>
      <h2 className={styles.greeting}>Hello, Player {username}!</h2>
      {renderGameStatus()}
      <div className={styles.avaiContainer}>
        <div className={styles.avaiAvatar}>🤖</div>
        <div className={styles.avaiChatBubble}>
          {isTyping ? (
            <div className={styles.typingDots}>
              <span>.</span>
              <span>.</span>
              <span>.</span>
            </div>
          ) : (
            avaiMessage
          )}
        </div>
      </div>
      {timeoutMessage && (
        <div className={styles.timeoutMessage}>
          <p>{timeoutMessage}</p>
        </div>
      )}
    </>
  );
};

export default React.memo(GameStatus);

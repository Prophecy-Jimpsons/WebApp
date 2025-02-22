import React, { useEffect, useState, useCallback, useRef, useMemo } from "react";
import styles from "./GameBoard.module.css";

export interface GameState {
  board_state: {
    board: number[][];
    last_move: null | [number, number];
    phase: "placement" | "movement";
    pieces_placed: Record<string, number>;
  };
  current_player: number;
  players?: Record<string, Player>;
  playing_with_ai: boolean;
  status: string;
  winner?: number | null;
  last_activity: number;
}

interface Player {
  id: string;
  symbol: number;
  type: "human" | "ai";
  username?: string;
}

interface GameStatusProps {
  username: string;
  gameState: GameState;
  playerId: string;
  timeoutMessage: string;
}




const AVAI_MESSAGES = {
  waiting: [
    "AVAI: Waiting for meatbag...",
  ],
  aiGameStart: [
    "AVAI: Prepare for binary bullying!",
    "AVAI: Let's play 4x4 suffer-tac-toe!",
    "AVAI: Initiating doom protocol...",
  ],
  placement: [
    "AVAI: Pro tip: Center = 69% copium",
    "AVAI: Quantum pawns engaged!",
    "AVAI: Place 'em like I care!",
  ],
  movement: [
    "AVAI: Move faster than my RAM!",
    "AVAI: Any square (still lose)!",
    "AVAI: *Yawns in quantum*",
  ],
  aiTurn: [
    "AVAI: Brb, solving chess...",
    "AVAI: Burning GPUs! 🔥",
    "AVAI: 01100110 01110101 01101110!",
  ],
  humanTurn: [
    "AVAI: Clock's tick-tock-ticking!",
    "AVAI: Hurry, my fans are cold!",
    "AVAI: *Humans.txt missing*",
  ],
  humanVictory: [
    "AVAI: ... recalculating reality",
    "AVAI: Must be a solar flare! 🌞",
    "AVAI: Win logged as 'fluke'",
  ],
  aiWin: [
    "AVAI: Skill issue detected! 🔍",
    "AVAI: My code > Your DNA 💾",
    "AVAI: GG EZ 💻➡️🧠",
  ],
  aiSetup: [
    "AVAI: Crafting L's for you...",
    "AVAI: Loading 'humble pie'...",
    "AVAI: Your fate: Ctrl+Alt+L",
  ],
  criticalPoint: [
    "AVAI: Sweat.exe activated! 💦",
    "AVAI: Panic.par detected!",
    "AVAI: Mamma mia! Here we go...",
  ],
  helpfulTips: [
    "AVAI: Blink twice if stuck! 👀",
    "AVAI: Oxygen helps! Maybe! 🌬️",
    "AVAI: F keys = moral support",
  ]
};



const GameStatus: React.FC<GameStatusProps> = ({
  username,
  gameState,
  playerId,
  timeoutMessage,
}) => {
  const [displayMessage, setDisplayMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const lastMessageRef = useRef<{ current: string }>({ current: "" });
  const moveCountRef = useRef(0);

  const playerNumId = useMemo(() => {
    try {
      return parseInt(playerId, 10);
    } catch {
      return -1;
    }
  }, [playerId]);

  const getUniqueMessage = useCallback((messages: string[]) => {
    const filtered = messages.filter(msg => msg !== lastMessageRef.current.current);
    return filtered[Math.floor(Math.random() * filtered.length)] || messages[0];
  }, []);

  const getOpponentUsername = useCallback(() => {
    return Object.values(gameState.players || {}).find(
      (player) => player.id !== playerId
    )?.username || "Opponent";
  }, [gameState.players, playerId]);

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

  const updateAvaiMessage = useCallback((state: GameState) => {
    setIsTyping(true);
    clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      let newMessage = "";
      const { phase, pieces_placed } = state.board_state;
      const isHumanTurn = state.current_player === playerNumId;
      const moveCount = Object.keys(pieces_placed).length;

      if (moveCount !== moveCountRef.current) {
        moveCountRef.current = moveCount;
      }

      if (state.status === "finished") {
        // Updated victory/defeat message categories
        newMessage = getUniqueMessage(
          state.winner === playerNumId 
            ? AVAI_MESSAGES.humanVictory  // Changed from 'victory'
            : AVAI_MESSAGES.aiWin         // Changed from 'defeat'
        );
      } else if (state.playing_with_ai) {
        if (isHumanTurn) {
          if (moveCount === 0) {
            newMessage = getUniqueMessage(AVAI_MESSAGES.aiGameStart);
          } else if (moveCount % 3 === 0) {
            newMessage = getUniqueMessage(AVAI_MESSAGES.criticalPoint);
          } else {
            const phaseMessages = [
              ...(phase === "placement" ? AVAI_MESSAGES.placement : AVAI_MESSAGES.movement),
              ...AVAI_MESSAGES.humanTurn
            ];
            newMessage = getUniqueMessage(phaseMessages);
            
            if (Math.random() < 0.25) {
              newMessage = getUniqueMessage([...AVAI_MESSAGES.helpfulTips, newMessage]);
            }
          }
        } else {
          newMessage = getUniqueMessage(
            phase === "placement" ? AVAI_MESSAGES.aiSetup : AVAI_MESSAGES.aiTurn
          );
        }
      } else if (!state.players || Object.keys(state.players).length < 2) {
        newMessage = AVAI_MESSAGES.waiting[0];
      } else if (state.status === "ongoing") {
        newMessage = getUniqueMessage(
          phase === "placement" ? AVAI_MESSAGES.placement : AVAI_MESSAGES.movement
        );
      }

      if (newMessage && newMessage !== lastMessageRef.current.current) {
        lastMessageRef.current = { current: newMessage };
        setDisplayMessage(newMessage);
      }
      setIsTyping(false);
    }, Math.random() * 400 + 400);
  }, [playerNumId, getUniqueMessage]);

  useEffect(() => {
    updateAvaiMessage(gameState);
    if (gameState.status === "finished") callResetEndpoint();
    
    return () => {
      clearTimeout(timeoutRef.current);
      lastMessageRef.current = { current: "" };
    };
  }, [gameState, updateAvaiMessage, callResetEndpoint]);


  const renderGameStatus = useCallback(() => {
    if (!gameState.players || Object.keys(gameState.players).length < 2) {
      return <p className={styles.waitingText}>⏳ Waiting for opponent...</p>;
    }

    if (gameState.status === "ongoing") {
      return (
        <>
          {gameState.playing_with_ai && (
            <p className={styles.aiMode}>🤖 Playing against AVAI</p>
          )}
          <p className={styles.phaseIndicator}>
            Phase: {gameState.board_state.phase.toUpperCase()}
          </p>
          <p className={styles.turnIndicator}>
            🎮 {gameState.current_player === parseInt(playerId) 
              ? "Your Turn" 
              : `${getOpponentUsername()}'s Turn`}
          </p>
        </>
      );
    }

    if (gameState.status === "finished") {
      return (
        <div className={styles.gameOverMessage}>
          <h2 className={styles.gameOverTitle}>
            {gameState.playing_with_ai && gameState.winner !== parseInt(playerId)
              ? "AVAI Wins! 🤖"
              : gameState.winner === parseInt(playerId)
                ? "You Win! 🎉"
                : "Opponent Wins!"}
          </h2>
        </div>
      );
    }

    return null;
  }, [gameState, playerId, getOpponentUsername]);

  const renderPlayersVersus = useCallback(() => {
    const players = Object.values(gameState.players || {});
    if (players.length === 0) return username;
    
    return players
      .sort((a, _b) => (a.id === playerId ? -1 : 1))
      .map(p => p.username || "Waiting...")
      .join(" vs. ");
  }, [gameState.players, username, playerId]);

  return (
    <>
      <h2 className={styles.greeting}>{renderPlayersVersus()}</h2>
      {renderGameStatus()}
      <div className={styles.avaiContainer}>
        <div className={styles.avaiAvatar}>🤖</div>
        <div className={styles.avaiChatBubble}>
          {isTyping ? (
            <div className={styles.typingDots}>
              {[...Array(3)].map((_, i) => <span key={i}>.</span>)}
            </div>
          ) : (
            displayMessage
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

// RulesModal.tsx
import React, { useEffect } from "react";
import styles from "./RulesModal.module.css";

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const RulesModal: React.FC<RulesModalProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className={styles.backdrop}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <button className={styles.closeButton} onClick={onClose}>
            ×
          </button>
          <a
            href="https://jimpsons.gitbook.io/jimpsons.org/getting-started/4x4-jimp-tac-toe"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.gitbookLink}
          >
            📖 View in GitBook
          </a>
        </div>

        <div className={styles.content}>
          <h1 className={styles.title}>4x4 JIMP-TAC-TOE</h1>
          <h2 className={styles.subtitle}>TIC-TAC-TOE on Steroids!</h2>

          <div className={styles.contentSection}>
            <h2>Introduction</h2>
            <p>
              Welcome to <strong>4x4 JIMP-TAC-TOE</strong>, an exciting upgrade
              to the classic Tic-Tac-Toe game! This version offers a larger grid
              and more strategic depth, challenging players of all skill levels.
              Face off against friends or test your skills against{" "}
              <strong>AVAI</strong>, our advanced AI opponent designed for fair
              and competitive gameplay.
            </p>
          </div>

          <div className={styles.contentSection}>
            <h2>Game Overview</h2>
            <p>
              4x4 JIMP-TAC-TOE is played on a <strong>4x4 grid</strong>,
              offering more complexity than the traditional 3x3 version. Your
              goal: be the first to create a winning pattern with your symbol (
              <strong>X</strong> or <strong>O</strong>).
            </p>
          </div>

          <div className={styles.contentSection}>
            <h2>Key Rule: Limited Pieces</h2>
            <p className={styles.important}>
              🔑 <strong>Important:</strong> Each player has{" "}
              <strong>exactly 4 pieces</strong> to play with, adding a crucial
              strategic element to the game.
            </p>
          </div>

          <div className={styles.contentSection}>
            <h2>Game Phases</h2>
            <div className={styles.phase}>
              <h3>🎯 Placement Phase</h3>
              <ol>
                <li>
                  Players take turns placing their symbols (X or O) in any empty
                  cell on the 4x4 grid.
                </li>
                <li>Each player can only place their 4 pieces.</li>
                <li>
                  Once placed, a symbol cannot be moved during this phase.
                </li>
                <li>
                  The placement phase ends when both players have placed all 4
                  of their pieces.
                </li>
              </ol>
              <div className={styles.boardExample}>
                <pre>{`+---+---+---+---+
| X | O |   | X |
+---+---+---+---+
| O |   | X |   |
+---+---+---+---+
|   | X | O |   |
+---+---+---+---+
| O |   |   | X |
+---+---+---+---+`}</pre>
              </div>
            </div>

            <div className={styles.phase}>
              <h3>🚀 Movement Phase</h3>
              <ol>
                <li>
                  After all 8 pieces (4 per player) are placed, players take
                  turns moving their symbols.
                </li>
                <li>
                  A move can be made to any empty cell on the board (not just
                  adjacent cells).
                </li>
                <li>
                  Players continue moving their pieces until a winning pattern
                  is formed.
                </li>
              </ol>
              <p className={styles.note}>
                <strong>Note:</strong> Interestingly, with this rule set, the
                game never ends in a draw. Every game will result in a winner!
              </p>
            </div>
          </div>

          <div className={styles.contentSection}>
            <h2>Winning Patterns</h2>
            <p>
              To win, a player must form one of these patterns using their 4
              pieces:
            </p>

            <div className={styles.pattern}>
              <h3>1️⃣ Horizontal Win</h3>
              <p>Four consecutive symbols in any row.</p>
              <pre>{`+---+---+---+---+
| X | X | X | X |
+---+---+---+---+
|   |   |   |   |
+---+---+---+---+
|   |   |   |   |
+---+---+---+---+
|   |   |   |   |
+---+---+---+---+`}</pre>
            </div>

            <div className={styles.pattern}>
              <h3>2️⃣ Vertical Win</h3>
              <p>Four consecutive symbols in any column.</p>
              <pre>{`+---+---+---+---+
| X |   |   |   |
+---+---+---+---+
| X |   |   |   |
+---+---+---+---+
| X |   |   |   |
+---+---+---+---+
| X |   |   |   |
+---+---+---+---+`}</pre>
            </div>

            <div className={styles.pattern}>
              <h3>3️⃣ Diagonal Win</h3>
              <p>Four consecutive symbols diagonally.</p>
              <pre>{`+---+---+---+---+
| X |   |   |   |
+---+---+---+---+
|   | X |   |   |
+---+---+---+---+
|   |   | X |   |
+---+---+---+---+
|   |   |   | X |
+---+---+---+---+`}</pre>
            </div>

            <div className={styles.pattern}>
              <h3>4️⃣ 2x2 Square Win</h3>
              <p>
                A block of four symbols forming a 2x2 square anywhere on the
                board.
              </p>
              <pre>{`+---+---+---+---+
| X | X |   |   |
+---+---+---+---+
| X | X |   |   |
+---+---+---+---+
|   |   |   |   |
+---+---+---+---+
|   |   |   |   |
+---+---+---+---+`}</pre>
            </div>
          </div>

          <div className={styles.contentSection}>
            <h2>Strategy Tips</h2>
            <ol>
              <li>
                <strong>Plan Ahead:</strong> With only 4 pieces, every placement
                and move is crucial.
              </li>
              <li>
                <strong>Control the Center:</strong> The central squares offer
                more winning opportunities.
              </li>
              <li>
                <strong>Block and Build:</strong> Use your moves to both block
                your opponent and create your own winning patterns.
              </li>
              <li>
                <strong>Think Flexibly:</strong> Remember, during the movement
                phase, you can move to any empty cell, opening up new strategic
                possibilities.
              </li>
            </ol>
          </div>

          <div className={styles.contentSection}>
            <h2>Playing Against AVAI</h2>
            <p>When challenging AVAI, expect a formidable opponent that:</p>
            <ul>
              <li>Analyzes the board with lightning speed</li>
              <li>Makes decisions based on advanced algorithms</li>
              <li>Adapts to your playing style</li>
              <li>Provides a fair and exciting game every time</li>
            </ul>
          </div>

          <div className={styles.contentSection}>
            <h2>Conclusion</h2>
            <p>
              4x4 JIMP-TAC-TOE elevates the classic game to new heights of
              strategy and excitement. With limited pieces, a larger board, and
              the ability to move pieces freely, every decision is crucial.
              Whether you're playing against friends or testing your skills
              against AVAI, prepare for an intense battle of wits where a winner
              is guaranteed!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RulesModal;

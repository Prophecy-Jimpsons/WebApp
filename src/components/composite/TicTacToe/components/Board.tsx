import React from "react";
import GameCell from "./GameCell";
import styles from "./GameBoard.module.css";

interface BoardProps {
  board: number[][];
  onClick: (row: number, col: number) => void;
  selectedCell: [number, number] | null;
  highlightedCells: [number, number][];
  isGameOver: boolean;
}

const Board: React.FC<BoardProps> = ({
  board,
  onClick,
  selectedCell,
  highlightedCells,
  isGameOver,
}) => {
  console.log("highlightedCells", highlightedCells);
  return (
    <div className={styles.board}>
      {board.map((row, rIdx) =>
        row.map((cell, cIdx) => (
          <GameCell
            key={`${rIdx}-${cIdx}`}
            value={cell === 0 ? "" : cell === 1 ? "X" : "O"}
            onClick={() => onClick(rIdx, cIdx)}
            isSelected={Boolean(
              selectedCell &&
                selectedCell[0] === rIdx &&
                selectedCell[1] === cIdx,
            )}
            isHighlighted={highlightedCells.some(
              (highlightedCell) =>
                highlightedCell[0] === rIdx && highlightedCell[1] === cIdx,
            )}
            isGameOver={isGameOver}
          />
        )),
      )}
    </div>
  );
};

export default Board;

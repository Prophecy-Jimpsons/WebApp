import { Player } from "@/types/game";

export const checkWinner = (board: string[]): Player | null => {
  // Horizontal lines
  for (let i = 0; i < 16; i += 4) {
    if (
      board[i] &&
      board[i] === board[i + 1] &&
      board[i] === board[i + 2] &&
      board[i] === board[i + 3]
    ) {
      return board[i] as Player;
    }
  }

  // Vertical lines
  for (let i = 0; i < 4; i++) {
    if (
      board[i] &&
      board[i] === board[i + 4] &&
      board[i] === board[i + 8] &&
      board[i] === board[i + 12]
    ) {
      return board[i] as Player;
    }
  }

  // Diagonals
  if (
    board[0] &&
    board[0] === board[5] &&
    board[0] === board[10] &&
    board[0] === board[15]
  ) {
    return board[0] as Player;
  }
  if (
    board[3] &&
    board[3] === board[6] &&
    board[3] === board[9] &&
    board[3] === board[12]
  ) {
    return board[3] as Player;
  }

  return null;
};

export const isValidMove = (
  fromIndex: number,
  toIndex: number,
  board: string[],
): boolean => {
  if (board[toIndex] !== "") return false;

  const fromRow = Math.floor(fromIndex / 4);
  const fromCol = fromIndex % 4;
  const toRow = Math.floor(toIndex / 4);
  const toCol = toIndex % 4;

  // Check if move is to adjacent cell (including diagonals)
  const rowDiff = Math.abs(toRow - fromRow);
  const colDiff = Math.abs(toCol - fromCol);

  return rowDiff <= 1 && colDiff <= 1;
};

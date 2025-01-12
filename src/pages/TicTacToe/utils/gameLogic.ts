import { WinningLine, Player, WinLineType } from "@/types/game";

export const checkWinner = (
  board: string[],
): {
  winner: Player | "draw" | null;
  line?: WinningLine;
} => {
  const lines = [
    // Horizontal lines
    [0, 1, 2, 3],
    [4, 5, 6, 7],
    [8, 9, 10, 11],
    [12, 13, 14, 15],
    // Vertical lines
    [0, 4, 8, 12],
    [1, 5, 9, 13],
    [2, 6, 10, 14],
    [3, 7, 11, 15],
    // Diagonal lines
    [0, 5, 10, 15],
    [3, 6, 9, 12],
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c, d] = lines[i];
    if (
      board[a] &&
      board[a] === board[b] &&
      board[a] === board[c] &&
      board[a] === board[d]
    ) {
      const type: WinLineType =
        i < 4 ? "horizontal" : i < 8 ? "vertical" : "diagonal";
      return {
        winner: board[a] as Player,
        line: { start: a, end: d, type },
      };
    }
  }

  // Check for draw
  if (board.every((cell) => cell !== "")) {
    return { winner: "draw" };
  }

  return { winner: null };
};

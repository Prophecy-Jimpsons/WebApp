export type Player = "X" | "O";
export type GamePhase = "placement" | "movement";
export type WinLineType = "horizontal" | "vertical" | "diagonal";

export interface WinningLine {
  start: number;
  end: number;
  type: WinLineType;
}

export interface PiecesPlaced {
  X: number;
  O: number;
}

export interface GameState {
  board: string[];
  currentPlayer: Player;
  phase: GamePhase;
  selectedCell: number | null;
  piecesPlaced: PiecesPlaced;
  winner: Player | "draw" | null;
  winningLine?: WinningLine;
}

export interface GameAction {
  action: "move";
  gameState: GameState;
}

export interface WebApp {
  ready(): unknown;
  expand(): unknown;
  sendData: (data: string) => void;
}

interface WebApp {
  ready(): void;
  expand(): void;
  sendData(data: string): void;
}

declare global {
  interface Window {
    Telegram?: {
      WebApp?: WebApp;
    };
  }
}

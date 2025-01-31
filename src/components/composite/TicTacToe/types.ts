export interface GameState {
  board: string[][];
  currentPlayer: string;
  mySymbol: string | null;
  phase: "placement" | "movement";
  pieces: {
    O: number;
    X: number;
  };
  selectedPiece: { row: number; col: number } | null;
  lastMove: [number, number] | null;
  gameEnded: boolean;
  winner: string | null;
  players: Record<string, string>;
  joinTimeout: number;
  placementTimeout: number;
  lastActivityTime: number;
}

export interface TelegramWebApp {
  ready: () => void;
  expand: () => void;
  initDataUnsafe: {
    chat?: { id: string };
    user?: {
      id: string;
      username?: string;
    };
  };
}

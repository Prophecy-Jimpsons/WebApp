interface GameSession {
  gameId: string;
  playerId: string;
  username: string;
  gameMode: "online" | "ai" | "predict" | null;
}

const GAME_SESSION_KEY = "current_game_session";

export const saveGameSession = (session: GameSession) => {
  localStorage.setItem(GAME_SESSION_KEY, JSON.stringify(session));
};

export const getGameSession = (): GameSession | null => {
  const session = localStorage.getItem(GAME_SESSION_KEY);
  return session ? JSON.parse(session) : null;
};

export const clearGameSession = () => {
  localStorage.removeItem(GAME_SESSION_KEY);
};

export const isInActiveGame = (): boolean => {
  return localStorage.getItem(GAME_SESSION_KEY) !== null;
};

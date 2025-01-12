interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
}

interface GameAction {
  action: "move" | "join";
  position?: number;
  selected?: number;
}

interface TelegramWebApp {
  initDataUnsafe: {
    user?: TelegramUser;
  };
  ready: () => void;
  expand: () => void;
  sendData: (data: string) => void;
  close: () => void;
}

declare global {
  interface Window {
    Telegram?: {
      WebApp?: TelegramWebApp;
    };
  }
}

export const telegram = {
  // Initialize Telegram WebApp
  init: () => {
    const tg = window.Telegram?.WebApp as TelegramWebApp | undefined;
    if (tg) {
      tg.ready();
      tg.expand();
      return tg;
    }
    return null;
  },

  // Get current user
  getUser: (): TelegramUser | null => {
    const tg = window.Telegram?.WebApp as TelegramWebApp | undefined;
    return tg?.initDataUnsafe?.user || null;
  },

  // Send game action to bot
  sendAction: (action: GameAction) => {
    const tg = window.Telegram?.WebApp as TelegramWebApp | undefined;
    if (tg) {
      tg.sendData(JSON.stringify(action));
    }
  },

  // Close WebApp
  close: () => {
    const tg = window.Telegram?.WebApp as TelegramWebApp | undefined;
    if (tg) {
      tg.close();
    }
  },
};

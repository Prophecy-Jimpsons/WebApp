// src/services/telegram.ts
import { GameState } from "@/types/game";

class TelegramService {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private tg: any;

  constructor() {
    this.tg = window.Telegram?.WebApp;
  }

  init() {
    if (this.tg) {
      this.tg.ready();
      this.tg.expand();

      // Set up theme
      const isDarkTheme = this.tg.colorScheme === "dark";
      document.documentElement.setAttribute(
        "data-theme",
        isDarkTheme ? "dark" : "light",
      );
    }
  }

  sendGameState(state: GameState) {
    if (this.tg) {
      this.tg.sendData(
        JSON.stringify({
          action: "move",
          gameState: state,
        }),
      );
    }
  }

  // Add event listener for receiving data from backend
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onReceiveData(callback: (data: any) => void) {
    if (this.tg) {
      this.tg.onEvent("mainButtonClicked", callback);
    }
  }

  // Show loading state
  showLoading() {
    if (this.tg) {
      this.tg.MainButton.showProgress();
    }
  }

  // Hide loading state
  hideLoading() {
    if (this.tg) {
      this.tg.MainButton.hideProgress();
    }
  }
}

export const telegramService = new TelegramService();

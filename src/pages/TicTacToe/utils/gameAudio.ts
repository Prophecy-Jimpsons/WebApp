// gameAudio.ts
class GameAudio {
  private moveSound: HTMLAudioElement;
  private winSound: HTMLAudioElement;
  private selectSound: HTMLAudioElement;
  private enabled: boolean = true;

  constructor() {
    this.moveSound = new Audio(
      "data:audio/wav;base64,UklGRnQGAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YU8GAACAPgAAoD8AALA/AAC4PwAAuD8AALA/AACgPwAAgD8AAEg/AAAQPwAA8D4AAOg+AADwPgAAED8AAEg/AACAPwAAoD8AALA/AAC4PwAAuD8AALA/AACgPwAAgD8AAEg/AAAQPwAA8D4AAOg+AADwPgAAED8AAEg/",
    );
    this.winSound = new Audio(
      "data:audio/wav;base64,UklGRpIGAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YW0GAACBhYqFSkhHRkhHR0hHR0hHR0hHR0hHR0hHR0hHR0hHR0hHR0hHR0hHR0hHR0hHR0hHR0hHR0hHR0hHR0hHR0hHR0hHR0hHR0hHR0hHR0hHR0hHR0hHR0hHR0hHR0hHR0hHR0hHR0hH",
    );
    this.selectSound = new Audio(
      "data:audio/wav;base64,UklGRmQGAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YT8GAACAPwAAgD8AAIA/AACAPwAAgD8AAIA/AACAPwAAgD8AAIA/AACAPwAAgD8AAIA/AACAPwAAgD8AAIA/AACAPwAAgD8=",
    );

    // Preload sounds
    this.moveSound.load();
    this.winSound.load();
    this.selectSound.load();
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  playMove() {
    if (!this.enabled) return;
    this.moveSound.currentTime = 0;
    this.moveSound.play().catch(() => {});
  }

  playWin() {
    if (!this.enabled) return;
    this.winSound.currentTime = 0;
    this.winSound.play().catch(() => {});
  }

  playSelect() {
    if (!this.enabled) return;
    this.selectSound.currentTime = 0;
    this.selectSound.play().catch(() => {});
  }
}

export const gameAudio = new GameAudio();

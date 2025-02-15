import { useState, useEffect, useRef } from "react";
import styles from "./UsernamePrompt.module.css";

interface UsernamePromptProps {
  onSubmit: (username: string) => void;
  onClose: () => void;
  publicKey?: string | null;
  isCreatingGame: boolean;
}

const UsernamePrompt: React.FC<UsernamePromptProps> = ({
  onSubmit,
  onClose,
  publicKey,
  isCreatingGame,
}) => {
  const [closing, setClosing] = useState(false);
  const promptRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState("");

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        promptRef.current &&
        !promptRef.current.contains(event.target as Node)
      ) {
        handleClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const generateUsername = (inputUsername: string): string => {
    // Clean up the input username, default to "Anonymous" only if empty
    const cleanUsername = inputUsername.trim() || "Anonymous";

    // For users with wallet
    if (publicKey) {
      const lastFourDigits = publicKey.slice(-4);
      const walletUsername = `${cleanUsername}#${lastFourDigits}`;
      console.log("Wallet username generated:", walletUsername);
      return walletUsername;
    }

    // For non-wallet users, use their input username
    const min = isCreatingGame ? 1 : 50;
    const max = isCreatingGame ? 50 : 100;
    const randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
    const randomUsername = `${cleanUsername}#${randomNum}`;
    console.log("Random username generated:", randomUsername);
    return randomUsername;
  };

  const handleSubmit = () => {
    console.log("Input value before generation:", input); // Check input value
    const finalUsername = generateUsername(input);
    console.log("Generated username:", finalUsername); // Check generated username

    // Store in localStorage
    localStorage.setItem("username", finalUsername);
    console.log(
      "Username in localStorage after setting:",
      localStorage.getItem("username"),
    ); // Verify storage

    // Update game session
    const gameSession = localStorage.getItem("current_game_session");
    if (gameSession) {
      const session = JSON.parse(gameSession);
      const oldUsername = session.username;
      session.username = finalUsername;
      localStorage.setItem("current_game_session", JSON.stringify(session));
      console.log("Updated game session username:", {
        old: oldUsername,
        new: finalUsername,
      });
    }

    onSubmit(finalUsername);
  };

  return (
    <div className={`${styles.overlay} ${closing ? styles.fadeOut : ""}`}>
      <div className={styles.promptCard} ref={promptRef}>
        <h2 className={styles.title}>Enter Your Username</h2>

        <input
          type="text"
          className={styles.input}
          placeholder="Enter username (or leave empty for anonymous)"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        {publicKey && (
          <p className={styles.walletInfo}>
            Your username will be appended with #{publicKey.slice(-4)}
          </p>
        )}

        <div className={styles.buttonContainer}>
          <button className={styles.primaryButton} onClick={handleSubmit}>
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default UsernamePrompt;

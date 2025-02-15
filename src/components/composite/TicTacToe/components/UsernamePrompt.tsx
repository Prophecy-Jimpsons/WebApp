import { useState, useEffect, useRef } from "react";
import styles from "./UsernamePrompt.module.css";

interface UsernamePromptProps {
  onSubmit: (username: string) => void;
  onClose: () => void;
  publicKey?: string | null;
}

const UsernamePrompt: React.FC<UsernamePromptProps> = ({
  onSubmit,
  onClose,
  publicKey,
}) => {
  const [closing, setClosing] = useState(false);
  const promptRef = useRef<HTMLDivElement>(null);

  // ✅ Restore stored username if available
  const getDefaultUsername = () => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) return storedUsername;

    if (publicKey) {
      const lastFourDigits = publicKey.slice(-4);
      return `Anonymous${lastFourDigits}`;
    }

    return "Anonymous";
  };

  const [input, setInput] = useState(getDefaultUsername());

  // ✅ Update input field if `publicKey` changes
  useEffect(() => {
    setInput(getDefaultUsername());
  }, [publicKey]);

  // ✅ Close prompt when clicking outside
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
  }, []);

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const handleSubmit = () => {
    const finalUsername = input.trim() || getDefaultUsername();
    localStorage.setItem("username", finalUsername); // ✅ Store username for persistence
    onSubmit(finalUsername);
  };

  return (
    <div className={`${styles.overlay} ${closing ? styles.fadeOut : ""}`}>
      <div className={styles.promptCard} ref={promptRef}>
        <h2 className={styles.title}>Enter Your Username</h2>

        <input
          type="text"
          className={styles.input}
          placeholder="Enter your username"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

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

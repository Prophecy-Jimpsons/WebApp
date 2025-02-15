import { useState, useEffect, useRef } from "react";
import styles from "./UsernamePrompt.module.css";

interface UsernamePromptProps {
  onSubmit: (username: string) => void;
  onClose: () => void;
}

const UsernamePrompt: React.FC<UsernamePromptProps> = ({
  onSubmit,
  onClose,
}) => {
  const [input, setInput] = useState(localStorage.getItem("username") || ""); // Remember last username
  const [closing, setClosing] = useState(false);
  const promptRef = useRef<HTMLDivElement>(null);

  // Close prompt when clicking outside
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

  // Handle Closing with Fade-Out
  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
      onClose();
    }, 300); // Delay matches fadeOut animation
  };

  // Handle Submit & Save Username
  const handleSubmit = () => {
    const finalUsername = input.trim() || "Anonymous";
    localStorage.setItem("username", finalUsername); // Save to localStorage
    onSubmit(finalUsername);
  };

  return (
    <div className={`${styles.overlay} ${closing ? styles.fadeOut : ""}`}>
      <div className={styles.promptCard} ref={promptRef}>
        <h2 className={styles.title}>Enter Your Username</h2>
        <input
          type="text"
          className={styles.input}
          placeholder="Anonymous"
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

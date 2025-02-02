import React, { useState } from "react";
import styles from "./AiChat.module.css";
import { ArrowUp } from "lucide-react";

const AiChat = () => {
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
  };
  return (
    <div className={styles.chatContainer}>
      <div className={styles.chatTop}>
        {/* <img src="/assets/images/mainLogo.svg" alt="ProphecyJimpsons Logo" /> */}
        <h1>Hi, I'm AVAI.</h1>
        <p>How can I help you with our project?</p>
      </div>
      <div className={styles.chatBox}>
        <div className={styles.inputContainer}>
          <div className={styles.inputBoxWrapper}>
            <div className={styles.inputBox}>
              <textarea
                placeholder="Message AVAI"
                className={styles.inputField}
                value={inputValue}
                onChange={handleInputChange}
              />
              <div className={styles.inputArea} />
              <div className={styles.sendButtonWrapper}>
                <button
                  className={styles.sendButton}
                  disabled={!inputValue.trim()}
                >
                  <ArrowUp size={18} />
                </button>
              </div>
            </div>
            <div></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiChat;

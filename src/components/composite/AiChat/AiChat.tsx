import React, { useEffect, useRef, useState } from "react";
import styles from "./AiChat.module.css";
import { ArrowUp } from "lucide-react";
import useChat from "@/hooks/useChat";

const AiChat = () => {
  const [inputValue, setInputValue] = useState<string>("");
  const messagesEndRef = useRef(null);
  const { sendMessage, isLoading, error, chatHistory } = useChat();

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    await sendMessage(inputValue);
    setInputValue("");
  };

  // Scroll to bottom whenever chat history changes
  useEffect(() => {
    if (messagesEndRef.current) {
      (messagesEndRef.current as HTMLElement).scrollIntoView({
        behavior: "smooth",
      });
    }
  }, [chatHistory, isLoading]);

  return (
    <div className={styles.chatContainer}>
      <div className={styles.chatTop}>
        {/* <img src="/assets/images/mainLogo.svg" alt="ProphecyJimpsons Logo" /> */}
        <h1>Hi, I'm AVAI.</h1>
        <p>How can I help you with our project?</p>
      </div>
      <div className={styles.chatBox}>
        {/* ............... */}
        <div className={styles.messagesContainer}>
          {chatHistory.map((message, index) => (
            <div
              key={index}
              className={
                message.role === "user"
                  ? styles.userMessageContainer
                  : styles.aiMessageContainer
              }
            >
              <div
                className={
                  message.role === "user"
                    ? styles.userMessage
                    : styles.aiMessage
                }
              >
                {message.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className={styles.aiMessageContainer}>
              <div className={styles.aiMessageLoading}>AVAI is typing...</div>
            </div>
          )}
          <div ref={messagesEndRef} /> {/* Invisible element for scrolling */}
          {/* Simulated Chat Messages */}
          {/* <div className={styles.message}>
            <div className={styles.userMessage}>Hello, AVAI!</div>
          </div>
          <div className={styles.message}>
            <div className={styles.aiMessage}>
              <img src="/assets/images/mainLogo.svg" alt="" />
              {isLoading ? (
                <span className={styles.aiMessageLoading}>.........</span>
              ) : (
                <span>Hi there! How can I assist you today?</span>
              )}
            </div>
          </div> */}
          {/* {isLoading && (
            <div className={styles.message}>
              <div className={styles.aiMessage}>
                <img src="/assets/images/mainLogo.svg" alt="" />
                <span className={styles.aiMessageLoading}>.........</span>
              </div>
            </div>
          )} */}
        </div>
        {/* ------------- */}
        <div className={styles.inputContainer}>
          <div className={styles.inputBoxWrapper}>
            <div className={styles.inputBox}>
              <textarea
                placeholder="Message AVAI"
                className={styles.inputField}
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSendMessage();
                  }
                }}
                disabled={isLoading}
              />
              <div className={styles.inputArea} />
              <div className={styles.sendButtonWrapper}>
                <button
                  className={styles.sendButton}
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isLoading}
                >
                  <ArrowUp className={styles.sendButtonIcon} />
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

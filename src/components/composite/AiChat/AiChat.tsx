import React, { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { dark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Prism, SyntaxHighlighterProps } from "react-syntax-highlighter";
import { ArrowUp } from "lucide-react";
import styles from "./AiChat.module.css";
import useChat from "@/hooks/useChat";
import Modal from "@/components/ui/Modal";
import AIStatusContent from "../AIStatusContent";

const SyntaxHighlighter = Prism as any as React.FC<SyntaxHighlighterProps>;

const AiChat = () => {
  const [inputValue, setInputValue] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const { sendMessage, isLoading, error, chatHistory } = useChat();

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
  };

  const handleSendMessage = async () => {
    const messageToSend = inputValue.trim();
    if (!messageToSend) return;

    setErrorMessage("");
    try {
      setInputValue(""); // Clear input before sending
      await sendMessage(messageToSend);
    } catch (error) {
      // Handle error
      console.error("Failed to send message:", error);
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to send message",
      );
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Prevent new line
      handleSendMessage();
    }
  };

  // Scroll to bottom whenever chat history changes
  useEffect(() => {
    if (messagesEndRef.current) {
      (messagesEndRef.current as HTMLElement).scrollIntoView({
        behavior: "smooth",
      });
    }
  }, [chatHistory, isLoading]);

  // Handle error message
  useEffect(() => {
    if (errorMessage || error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to send message",
      );
      setIsModalOpen(true);
    }
  }, [errorMessage, error]);
  const renderMessage = (content: string) => {
    return (
      <ReactMarkdown
        children={content}
        components={{
          code({ node, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");
            return match ? (
              <SyntaxHighlighter
                children={String(children).replace(/\n$/, "")}
                style={{ ...dark, overflowX: "scroll" } as any}
                language={match[1]}
                PreTag="div"
                {...props}
              />
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
        }}
      />
    );
  };

  return (
    <div className={styles.chatContainer}>
      <div
        className={`${styles.chatTop} ${chatHistory.length > 0 ? styles.chatTopWithHistory : ""}`}
      >
        <h1>Hi, I'm AVAI.</h1>
        <p>How can I help you with our project?</p>
      </div>
      <div className={styles.chatBox}>
        <div
          className={`${styles.messagesContainer} ${
            chatHistory.length > 0 ? styles.messagesContainerWithHistory : ""
          }`}
        >
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
                    : styles.aiMessageWrapper
                }
              >
                {message.role === "user" ? (
                  message.content
                ) : (
                  <>
                    <div className={styles.aiLogoContainer}>
                      <img
                        src="/assets/images/mainLogo.svg"
                        alt="AVAI Logo"
                        className={styles.aiLogo}
                      />
                    </div>

                    <div className={styles.aiMessage}>
                      {renderMessage(message.content)}
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className={styles.aiMessageContainer}>
              <div className={styles.aiMessageWrapper}>
                <div className={styles.aiLogoContainer}>
                  <img
                    src="/assets/images/mainLogo.svg"
                    alt="AVAI Logo"
                    className={styles.aiLogo}
                  />
                </div>
                <div className={styles.aiMessageLoading}>
                  AVAI is thinking
                  <div className={styles.loadingDots}>
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            </div>
          )}
          {errorMessage && (
            <Modal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              title="🛠️ AI Under Maintenance: Recharging Its Witty Circuits!"
            >
              <AIStatusContent />
            </Modal>
          )}
          <div ref={messagesEndRef} />
        </div>
        <div className={styles.inputContainer}>
          <div className={styles.inputBoxWrapper}>
            <div className={styles.inputBox}>
              <textarea
                placeholder="Message AVAI"
                className={styles.inputField}
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiChat;

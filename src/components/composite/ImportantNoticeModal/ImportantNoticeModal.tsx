import { FC, useState } from "react";
import { X } from "lucide-react";
import styles from "./ImportantNoticeModal.module.css";

const ImportantNoticeModal: FC = () => {
  const [isOpen, setIsOpen] = useState(true);

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2 className={styles.title}>⚠️ Important Notice</h2>
          <button
            className={styles.closeButton}
            onClick={() => setIsOpen(false)}
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>
        <div className={styles.content}>
          <p>Dear Community,</p>
          <p>
            We want to inform you that our official X (Twitter) account is
            currently suspended. We are actively working to resolve this
            situation with the X team.
          </p>
          <div className={styles.warning}>
            <p>
              <strong>⚠️ Please be cautious:</strong> We've identified several
              spam websites impersonating our project. Always verify you're
              using our official platforms.
            </p>
          </div>
          <div className={styles.details}>
            <p>What you should know:</p>
            <ul>
              <li>We're in communication with X's support team</li>
              <li>
                This is a temporary situation that we're working to resolve
              </li>
              <li>Our platform and services continue to operate normally</li>
            </ul>
          </div>
          <p className={styles.update}>
            We appreciate your patience and support during this time. We'll
            update the community as soon as this matter is resolved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ImportantNoticeModal;

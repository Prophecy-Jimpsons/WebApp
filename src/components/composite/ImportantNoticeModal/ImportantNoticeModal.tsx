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
            Our team is working on restoring access to our previous X (Twitter)
            account. Until then, you can find our updates at:
          </p>
          <div className={styles.details}>
            <div className={styles.socialLinks}>
              <p>
                <span>X (Twitter):</span>
                <a
                  href="https://x.com/jimpsons_org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.link}
                >
                  @jimpsons_org
                </a>
              </p>
              <p>
                <span>Telegram:</span>
                <a
                  href="https://t.me/+GpIAuMKh_6xkZjgx"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.link}
                >
                  Join our Telegram
                </a>
              </p>
            </div>
          </div>
          <div className={styles.warning}>
            <p>
              <strong>⚠️ Please note:</strong> We will use this account for
              updates until our previous account is restored. Be cautious of any
              impersonators.
            </p>
          </div>
          <div className={styles.details}>
            <p>Stay connected with us for:</p>
            <ul>
              <li>Latest project updates</li>
              <li>Community announcements</li>
              <li>Important platform notifications</li>
            </ul>
          </div>
          <p className={styles.update}>
            Thank you for your continued support and understanding.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ImportantNoticeModal;

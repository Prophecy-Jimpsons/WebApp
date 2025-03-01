import { Clock } from "lucide-react";
import type React from "react";
import styles from "./VoteCard.module.css";

export interface VoteCardProps {
  id: string;
  title: string;
  description: string;
  author: string;
  authorImage?: string;
  votes: number;
  daysLeft: number;
  progress: number;
  isActive?: boolean;
  isSelected?: boolean;
  onSelect?: (id: string) => void;
  children?: React.ReactNode;
}

const VoteCard: React.FC<VoteCardProps> = ({
  id,
  title,
  description,
  author,
  authorImage = "/placeholder.svg?height=40&width=40",
  votes,
  daysLeft,
  progress,
  isActive,
  isSelected = false,
  onSelect,
  children,
}) => {
  const handleSelect = () => {
    if (onSelect) {
      onSelect(id);
    }
  };

  return (
    <div
      className={`${styles.card} ${isSelected ? styles.selected : ""}`}
      onClick={handleSelect}
      role="radio"
      aria-checked={isSelected}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          handleSelect();
          e.preventDefault();
        }
      }}
    >
      <div className={styles.header}>
        <div className={styles.author}>
          <img
            src={authorImage || "/placeholder.svg"}
            alt={`${author}'s avatar`}
            className={styles.avatar}
          />
          <span className={styles.authorText}>
            by <span className={styles.authorName}>{author}</span>
          </span>
        </div>
        <div className={styles.stats}>
          <span className={styles.votes}>
            {votes >= 1000 ? `${Math.floor(votes / 1000)}K+` : votes} Votes
          </span>
          {isActive ? (
            <span className={styles.activeTag}>Active</span>
          ) : (
            <span className={styles.closedTag}>Closed</span>
          )}
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.mainContent}>
          <h3 className={styles.title}>{title}</h3>
          <p className={styles.description}>{description}</p>

          <div className={styles.footer}>
            <div className={styles.timeRemaining}>
              <Clock size={16} className={styles.clockIcon} />
              <span>{daysLeft} days left</span>
            </div>
            <div className={styles.progressBarContainer}>
              <div
                className={styles.progressBar}
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          {children && (
            <div className={styles.childrenContainer}>{children}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VoteCard;

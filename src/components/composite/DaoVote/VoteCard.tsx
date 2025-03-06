import { Clock } from "lucide-react";
import type React from "react";
import styles from "./VoteCard.module.css";
import { OracleSource } from "@/types/dao";

export interface VoteCardProps extends OracleSource {
  isSelected?: boolean;
  onSelect?: (id: string) => void;
  children?: React.ReactNode;
}

const VoteCard: React.FC<VoteCardProps> = ({
  id,
  title,
  endpoints,
  totalVotes,
  daysLeft,
  progress,
  status,
  isSelected = false,
  onSelect,
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
        <div className={styles.stats}>
          <div className={styles.votes}>
            <span className={styles.voteCount}>
              {totalVotes >= 1000
                ? `${Math.floor(totalVotes / 1000)}K+`
                : totalVotes}
            </span>
            <span className={styles.voteLabel}>votes</span>
          </div>
          {status === "active" ? (
            <span className={styles.activeTag}>Active</span>
          ) : (
            <span className={styles.closedTag}>Closed</span>
          )}
        </div>
        <h3 className={styles.title}>{title}</h3>
      </div>
      <div className={styles.content}>
        <div className={styles.sourceHeader}>
          <h4 className={styles.sourceTitle}>
            Sources:{" "}
            <span className={styles.sourceCount}>({endpoints.length})</span>
          </h4>
        </div>

        <div className={styles.sourceList}>
          <span className={styles.sourceNote}>
            Note: For security, we display shortened URLs. To visit the full
            source, click on the link and you will be redirected to the original
            URL.
          </span>
          {endpoints.map((source, index) => (
            <SourceItem key={index} source={source} />
          ))}
        </div>

        <div className={styles.footer}>
          <div className={styles.timeRemaining}>
            <Clock size={16} className={styles.clockIcon} />
            <span>{daysLeft} days left</span>
          </div>
          <div className={styles.progressContainer}>
            {/* <div
              className={styles.progressBar}
              style={{ width: `$${progress}%` }}
            /> */}
          </div>
          <div className={styles.validation}>
            Validation: Multi-Source Verification
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoteCard;

interface Source {
  category: string;
  url: string;
}
interface SourceItemProps {
  source: Source;
}

const SourceItem: React.FC<SourceItemProps> = ({ source }) => {
  return (
    <div className={styles.sourceItem}>
      <span className={styles.sourceType}>{source.category}:</span>
      {/* <a
        href={source.url}
        className={styles.sourceUrl}
        target="_blank"
        rel="noopener noreferrer"
      >
        {source.url}
      </a> */}
      <span className={styles.sourceUrl}>{source.url}</span>
    </div>
  );
};

import { Clock } from "lucide-react";
import React, { useMemo, memo } from "react";
import styles from "./VoteCard.module.css";
import { OracleSource, Endpoint } from "@/types/dao";

// Extracted constant for vote formatting thresholds
const VOTE_THRESHOLDS = {
  MILLION: 1e6,
  THOUSAND: 1e3,
};

// Static formatter function outside component
const formatVotes = (votes: number) => {
  if (votes >= VOTE_THRESHOLDS.MILLION) return `${(votes / 1e6).toFixed(1)}M`;
  if (votes >= VOTE_THRESHOLDS.THOUSAND) return `${(votes / 1e3).toFixed(1)}K`;
  return votes.toFixed(0);
};

// Memoized SourceItem component
const SourceItem = memo(({ source }: { source: Endpoint }) => {
  const fullUrl = `https://${source.url}`;
  const displayUrl = source.url.replace(/(^\w+:|^)\/\/(www\.)?/, '');

  return (
    <div className={styles.sourceItem}>
      <span className={styles.sourceType}>{source.category}:</span>
      <a
        href={fullUrl}
        className={styles.sourceUrl}
        target="_blank"
        rel="noopener noreferrer"
      >
        {displayUrl}
      </a>
    </div>
  );
});

SourceItem.displayName = 'SourceItem'; // Add display name for dev tools

interface VoteCardProps extends OracleSource {
  isSelected?: boolean;
  onSelect?: (id: string) => void;
}

const VoteCard: React.FC<VoteCardProps> = ({
  id,
  title,
  endpoints = [],
  totalVotes = 0,
  weightedVotes = 0,
  daysLeft = 0,
  status = 'closed',
  isSelected = false,
  onSelect,
}) => {
  const handleSelect = () => {
    onSelect?.(id);
  };

  // Memoized source list rendering
  const renderedSources = useMemo(() => (
    (endpoints || []).map((source, index) => (
      <SourceItem
        key={`${id}-source-${source.category}-${index}`}
        source={source}
      />
    ))
  ), [endpoints, id]);

  // Memoized status display
  const statusDisplay = useMemo(() => (
    status?.toUpperCase() || "CLOSED"
  ), [status]);

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
              {formatVotes(totalVotes)}
            </span>
            <span className={styles.voteLabel}>Total Votes</span>
          </div>

          <div className={styles.weightedVotes}>
            <span className={styles.voteCount}>
              {formatVotes(weightedVotes)}
            </span>
            <span className={styles.voteLabel}>Voting Power</span>
          </div>

          <span className={status === "active" ? styles.activeTag : styles.closedTag}>
            {statusDisplay}
          </span>
        </div>
        
        <h3 className={styles.title}>{title}</h3>
      </div>

      <div className={styles.content}>
        <div className={styles.sourceHeader}>
          <h4 className={styles.sourceTitle}>
            API Endpoints ({endpoints?.length || 0})
          </h4>
        </div>

        <div className={styles.sourceList}>
          <div className={styles.sourceNote}>
            Secure preview - click source to verify full URL
          </div>
          {renderedSources}
        </div>

        <div className={styles.footer}>
          <div className={styles.timeRemaining}>
            <Clock size={16} className={styles.clockIcon} />
            <span>{daysLeft} days remaining</span>
          </div>
          <div className={styles.validation}>
            Validation: Multi-Source Verification
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(VoteCard, (prevProps, nextProps) => {
  // Custom comparison function for props
  return (
    prevProps.id === nextProps.id &&
    prevProps.isSelected === nextProps.isSelected &&
    prevProps.totalVotes === nextProps.totalVotes &&
    prevProps.weightedVotes === nextProps.weightedVotes &&
    prevProps.daysLeft === nextProps.daysLeft &&
    prevProps.status === nextProps.status &&
    prevProps.title === nextProps.title &&
    JSON.stringify(prevProps.endpoints) === JSON.stringify(nextProps.endpoints)
  );
});

import React, { useEffect, useState, useMemo } from "react";
import { useWalletInfo } from "@/context/WalletContext";
import { getOracleSources, submitVote } from "@/services/dao-service";
import { OracleSource } from "@/types/dao";
import CardGroup from "./CardGroup";
import styles from "./DaoVote.module.css";
import VoteCard from "./VoteCard";

const MIN_STAKE_REQUIRED = 100;

const DaoVote: React.FC = () => {
  const [selectedSource, setSelectedSource] = useState<string>("");
  const [oracleSources, setOracleSources] = useState<OracleSource[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  const { 
    address, 
    tokenAmount, 
    tier, 
    votingHistory,
    isLoading,
    votingPower
  } = useWalletInfo();

  const hasEnoughStake = tokenAmount >= MIN_STAKE_REQUIRED;

  const formattedVotingPower = useMemo(() => {
    return `${votingPower.weight.toFixed(2)} VP`;
  }, [votingPower.weight]);

  useEffect(() => {
    const fetchOracleSources = async () => {
      try {
        const sources = await getOracleSources(votingHistory);
        setOracleSources(sources);
        setError(null);
      } catch (err) {
        console.error("Error fetching oracle sources:", err);
        setError("Failed to load voting data from IPFS");
      }
    };

    if (votingHistory) fetchOracleSources();
  }, [votingHistory]);

  const handleSourceChange = (id: string) => {
    setSelectedSource(id);
    setError(null);
  };

  const handleVote = async () => {
    if (!address || !selectedSource) return;

    if (!hasEnoughStake) {
      setError(`Minimum stake of ${MIN_STAKE_REQUIRED} JIMP tokens required to vote.`);
      return;
    }

    try {
      const { success, message } = await submitVote(
        selectedSource,
        address.toString(),
        tokenAmount,
        tier.level
      );

      if (success) {
        const updatedSources = await getOracleSources(votingHistory);
        setOracleSources(updatedSources);
        setSuccessMessage(message);
        setError(null);
        setSelectedSource("");
      } else {
        setError(message);
      }
    } catch (err) {
      console.error("Vote submission error:", err);
      setError(err instanceof Error ? err.message : "Vote submission failed");
    }
  };

  if (isLoading) {
    return <div className={styles.loadingSpinner} />;
  }

  if (error && !oracleSources.length) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorHeading}>Data Loading Error</div>
        <div className={styles.errorDetail}>{error}</div>
        <button 
          className={styles.retryButton}
          onClick={() => window.location.reload()}
        >
          Refresh Application
        </button>
      </div>
    );
  }

  return (
    <div className={styles.section}>
      <div className={styles.header}>
        <h1 className={styles.title}>Decentralized Oracle Governance</h1>
        <p className={styles.description}>
          Vote for AI training data sources using your JIMP tokens
        </p>
      </div>

      {successMessage && (
        <div className={styles.successMessage}>
          <div className={styles.successIcon}>✓</div>
          {successMessage}
        </div>
      )}

      <section className={styles.voteSection}>
        <CardGroup
          name="Data Source Groups"
          onChange={handleSourceChange}
          selectedId={selectedSource}
        >
          {oracleSources.map((source) => (
            <VoteCard
              key={source.id}
              {...source}
              isSelected={source.id === selectedSource}
              onSelect={() => handleSourceChange(source.id)}
            />
          ))}
        </CardGroup>

        <div className={styles.voteControls}>
          <div className={styles.stakeStatus}>
            <div className={styles.stakeMetric}>
              <span className={styles.metricLabel}>Your Stake:</span>
              <span className={styles.metricValue}>{tokenAmount} JIMP</span>
            </div>
            <div className={styles.stakeMetric}>
              <span className={styles.metricLabel}>Voting Power:</span>
              <span className={styles.metricValue}>
                {formattedVotingPower}
              </span>
            </div>
          </div>

          {!hasEnoughStake && (
            <div className={styles.stakeWarning}>
              <div className={styles.warningIcon}>!</div>
              Minimum {MIN_STAKE_REQUIRED} JIMP required for governance participation
            </div>
          )}

          {error && (
            <div className={styles.errorMessage}>
              <div className={styles.errorIcon}>×</div>
              {error}
            </div>
          )}

          <button
            className={`${styles.voteButton} ${
              !hasEnoughStake ? styles.disabledButton : ""
            }`}
            onClick={handleVote}
            disabled={!address || !hasEnoughStake}
            aria-label="Submit vote"
          >
            {!address
              ? "Connect Wallet to Participate"
              : !hasEnoughStake
              ? `Required Stake: ${MIN_STAKE_REQUIRED} JIMP`
              : "Confirm Vote"}
          </button>
        </div>
      </section>
    </div>
  );
};

export default DaoVote;

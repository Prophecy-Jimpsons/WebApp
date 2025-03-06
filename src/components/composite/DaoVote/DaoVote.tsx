import { useWalletInfo } from "@/context/WalletContext";
import {
  getOracleSources,
  initializeDatabase,
  submitVote,
} from "@/services/dao-service";
import { OracleSource } from "@/types/dao";
import type React from "react";
import { useEffect, useState } from "react";
import CardGroup from "./CardGroup";
import styles from "./DaoVote.module.css";
import VoteCard from "./VoteCard";

const MIN_STAKE_REQUIRED = 100;

const DaoVote: React.FC = () => {
  const [selectedSource, setSelectedSource] = useState<string>("");
  const [oracleSources, setOracleSources] = useState<OracleSource[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { address, tokenAmount, tier } = useWalletInfo();

  const hasEnoughStake = tokenAmount >= MIN_STAKE_REQUIRED;

  useEffect(() => {
    const fetchOracleSources = async () => {
      setIsLoading(true);
      try {
        // Initialize database if needed
        await initializeDatabase();

        // Fetch oracle sources
        const sources = await getOracleSources();
        setOracleSources(sources);
        setError(null);
      } catch (err) {
        console.error("Error fetching oracle sources:", err);
        setError("Failed to load oracle sources");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOracleSources();
  }, []);

  const handleSourceChange = (id: string) => {
    setSelectedSource(id);
    setError(null);
    // console.log(`Selected Source: ${id}`);
  };

  const handleVote = async () => {
    if (!address || !selectedSource) return;

    // Validate stake amount
    if (!hasEnoughStake) {
      setError(
        `Minimum stake of ${MIN_STAKE_REQUIRED} JIMP tokens required to vote.`,
      );
      return;
    }

    // Create the vote data object
    const voteData = {
      voter: address.toString(),
      source_id: selectedSource,
      stake: tokenAmount,
      tier: tier.level,
      timestamp: Date.now(),
    };

    try {
      // console.log("Submitting vote:", voteData);
      const { success, message } = await submitVote(voteData);

      if (success) {
        // Refresh oracle sources after successful vote
        const updatedSources = await getOracleSources();
        setOracleSources(updatedSources);
        setSuccessMessage(message);
      } else {
        setError(message);
      }
    } catch (err) {
      console.error("Error in vote submission:", err);
      setError("Error submitting vote. Please try again.");
    }
  };

  if (isLoading) {
    return <div className={styles.loadingSpinner} />;
  }

  if (error && !oracleSources.length) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.section}>
      <h1 className={styles.title}>AI Oracle Source Voting </h1>
      {/* <h4 className={styles.subtitle}>Community Governed Data Verification</h4> */}
      <p className={styles.description}>
        Please vote for the best AI Oracle Source
      </p>
      {successMessage && (
        <div className={styles.successMessage}>{successMessage}</div>
      )}
      <section className={styles.voteSection}>
        <CardGroup
          name="Governance Sources"
          onChange={handleSourceChange}
          defaultSelected="Source-1"
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

        <div className={styles.selectedInfo}>
          {!hasEnoughStake && (
            <div className={styles.stakeWarning}>
              Minimum {MIN_STAKE_REQUIRED} JIMP required to vote
            </div>
          )}
          {error && <div className={styles.errorMessage}>{error}</div>}
          <button
            className={`${styles.voteButton} ${!hasEnoughStake ? styles.disabledButton : ""}`}
            onClick={handleVote}
            disabled={!address || !hasEnoughStake}
          >
            {!address
              ? "Connect Wallet to Vote"
              : !hasEnoughStake
                ? `Need ${MIN_STAKE_REQUIRED - tokenAmount} More JIMP`
                : "Vote Source"}
          </button>
        </div>
      </section>
    </div>
  );
};

export default DaoVote;

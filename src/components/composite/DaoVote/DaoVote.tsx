import React, { useEffect, useState, useMemo, useRef } from "react";
import { MerkleVoteTallyService } from "@/utils/vote-tallying";
import { PhantomVotingClient } from "@/config/filebase-dao";
import { useWalletInfo } from "@/context/WalletContext";
import { getOracleSources } from "@/services/dao-service";
import { OracleSource } from "@/types/dao";
import { DAOVote } from "@/context/WalletContext";
import CardGroup from "./CardGroup";
import styles from "./DaoVote.module.css";
import VoteCard from "./VoteCard";


const MIN_STAKE_REQUIRED = 0;

const DaoVote: React.FC = () => {
  const [selectedSource, setSelectedSource] = useState<string>("");
  const [oracleSources, setOracleSources] = useState<OracleSource[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [verificationErrors, setVerificationErrors] = useState<string[]>([]);
  
  // Create a ref to the tally service to persist between renders
  const tallyServiceRef = useRef<MerkleVoteTallyService | null>(null);


  
  const { 
    address, 
    tokenAmount, 
    votingHistory,
    isLoading,
    votingPower,
    submitVote
  } = useWalletInfo();

  const hasEnoughStake = tokenAmount >= MIN_STAKE_REQUIRED;

  const formattedVotingPower = useMemo(() => {
    return `${votingPower.weight.toFixed(2)} VP`;
  }, [votingPower.weight]);

  // Initialize the tally service
  useEffect(() => {
    if (!tallyServiceRef.current) {
      const votingClient = new PhantomVotingClient<DAOVote>();
      tallyServiceRef.current = new MerkleVoteTallyService(votingClient);
    }
  }, []);

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

  // Enhanced handleVote with verification
  const handleVote = async () => {
    if (!address || !selectedSource) return;

    if (!hasEnoughStake) {
      setError(`Minimum stake of ${MIN_STAKE_REQUIRED} JIMP tokens required to vote.`);
      return;
    }

    try {
      setIsRefreshing(true);
      
      // ENHANCED: Verify current vote chain before submitting new vote
      if (tallyServiceRef.current) {
        const verificationResult = await tallyServiceRef.current.processVotesOnDemand(true);
        
        if (!verificationResult.chainVerified) {
          setError("Vote chain integrity check failed. Cannot submit vote.");
          setVerificationErrors(verificationResult.errors);
          return;
        }
        
        if (verificationResult.errors.length > 0) {
          console.warn("Non-critical vote verification warnings:", verificationResult.errors);
        }
      }
      
      // Submit vote
      const cid = await submitVote(
        selectedSource,
        'FOR'  // Using 'FOR' as the choice, adjust if needed
      );
      
      // Process the new vote immediately
      if (tallyServiceRef.current) {
        await tallyServiceRef.current.processVotesOnDemand(true);
      }
      
      // Update UI state
      const updatedSources = await getOracleSources(votingHistory);
      setOracleSources(updatedSources);
      setSuccessMessage(`Vote verified and stored at IPFS CID: ${cid}`);
      setSelectedSource("");
      setVerificationErrors([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Vote failed");
    } finally {
      setIsRefreshing(false);
    }
  };
  
  // Add a manual refresh function with verification
  const handleRefresh = async () => {
    if (!tallyServiceRef.current) return;
    
    try {
      setIsRefreshing(true);
      
      // Force processing of new votes with enhanced error reporting
      const result = await tallyServiceRef.current.processVotesOnDemand(true);
      
      if (!result.success) {
        setError("Failed to refresh vote tallies: " + result.errors.join(', '));
        setVerificationErrors(result.errors);
      } else {
        // Update sources with fresh tallies
        const updatedSources = await getOracleSources(votingHistory);
        setOracleSources(updatedSources);
        
        const message = result.votesProcessed > 0 
          ? `Processed ${result.votesProcessed} new votes successfully` 
          : "No new votes to process";
        
        setSuccessMessage(message);
        
        if (result.errors.length > 0) {
          setVerificationErrors(result.errors);
        } else {
          setVerificationErrors([]);
        }
        
        setTimeout(() => setSuccessMessage(null), 3000);
      }
    } catch (err) {
      setError("Failed to refresh vote tallies: " + (err instanceof Error ? err.message : String(err)));
    } finally {
      setIsRefreshing(false);
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

      {/* Add a refresh button */}
      <div className={styles.refreshContainer}>
        <button 
          className={styles.refreshButton}
          onClick={handleRefresh}
          disabled={isRefreshing}
        >
          {isRefreshing ? "Verifying & Refreshing..." : "Verify & Refresh Vote Tallies"}
        </button>
      </div>
      
      {/* Add verification error display */}
      {verificationErrors.length > 0 && (
        <div className={styles.verificationWarning}>
          <h4 className={styles.warningTitle}>Verification Warnings:</h4>
          <ul className={styles.warningList}>
            {verificationErrors.slice(0, 3).map((error, index) => (
              <li key={index}>{error}</li>
            ))}
            {verificationErrors.length > 3 && (
              <li>...and {verificationErrors.length - 3} more warnings</li>
            )}
          </ul>
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
              !hasEnoughStake || isRefreshing ? styles.disabledButton : ""
            }`}
            onClick={handleVote}
            disabled={!address || !hasEnoughStake || isRefreshing}
            aria-label="Submit vote"
          >
            {isRefreshing
              ? "Verifying..."
              : !address
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

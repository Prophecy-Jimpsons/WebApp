import React, { useEffect, useState, useRef } from 'react';
import { MerkleVoteTallyService } from "@/utils/vote-tallying";
import { PhantomVotingClient } from "@/config/filebase-dao";
import { DAOVote } from "@/context/WalletContext";
import styles from './VoteTallies.module.css';

const VoteTallies: React.FC<{ proposalIds: string[] }> = ({ proposalIds }) => {
  const [tallies, setTallies] = useState<Record<string, { 
    totalVotes: number; 
    weightedVotes: number;
    merkleRoot?: string;
  }>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Create a persistent tally service
  const tallyServiceRef = useRef<MerkleVoteTallyService | null>(null);
  
  useEffect(() => {
    if (!tallyServiceRef.current) {
      const votingClient = new PhantomVotingClient<DAOVote>();
      tallyServiceRef.current = new MerkleVoteTallyService(votingClient);
    }
    
    // Process votes and get tallies
    const processTallies = async () => {
      try {
        setIsLoading(true);
        
        if (!tallyServiceRef.current) return;
        
        // Process all votes in the chain
        const result = await tallyServiceRef.current.processVotesOnDemand(true);
        
        if (!result.success) {
          setError(`Failed to process votes: ${result.errors.join(', ')}`);
          return;
        }
        
        // Get tallies for each proposal
        const tallyResults: Record<string, any> = {};
        for (const proposalId of proposalIds) {
          tallyResults[proposalId] = tallyServiceRef.current.getTally(proposalId);
        }
        
        setTallies(tallyResults);
        setError(null);
      } catch (err) {
        setError(`Error tallying votes: ${err instanceof Error ? err.message : String(err)}`);
      } finally {
        setIsLoading(false);
      }
    };
    
    processTallies();
  }, [proposalIds]);
  
  if (isLoading) {
    return <div>Loading vote tallies...</div>;
  }
  
  if (error) {
    return <div className={styles.error}>{error}</div>;
  }
  
  return (
    <div className={styles.talliesContainer}>
      <h2>Vote Tallies</h2>
      {proposalIds.map(proposalId => (
        <div key={proposalId} className={styles.tallyCard}>
          <h3>Proposal: {proposalId}</h3>
          <div className={styles.tallyStat}>
            <span>Total Votes:</span>
            <span>{tallies[proposalId]?.totalVotes || 0}</span>
          </div>
          <div className={styles.tallyStat}>
            <span>Weighted Votes:</span>
            <span>{(tallies[proposalId]?.weightedVotes || 0).toFixed(2)}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default VoteTallies;

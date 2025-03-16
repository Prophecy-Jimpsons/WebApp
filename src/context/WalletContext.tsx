import React, {
  createContext,
  useContext,
  ReactNode,
  ElementType,
  useState,
  useMemo,
  useCallback,
  useEffect,
} from "react";
import {
  LAMPORTS_PER_SOL,
  ParsedTransactionWithMeta,
  PublicKey,
  VersionedTransactionResponse,
} from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";
import { PhantomVotingClient } from "@/config/filebase-dao";
import {
  useGetATA,
  useGetBalance,
  useGetTokenInfo,
  useGetTxs,
} from "@/hooks/useAccount";
import { getDaysSinceFirstPurchase } from "@/utils/helpers";
import { Star } from "lucide-react";
import { TIER_LEVELS } from "@/components/composite/AccountDetails/config";

// Define VotingDelta interface for vote records with cryptographic proofs
export interface VotingDelta<T> {
  version: string;               // Schema version
  timestamp: string;             // Creation timestamp
  vote: {
    data: T;                     // Actual vote data
    metadata: {
      sourceId: string;          // Proposal identifier
      voter: string;             // Voter's address
      publicKey: string;         // Voter's public key
      weight: {
        raw: number;             // Raw token amount
        tier: string;            // User tier (Diamond, Gold, etc.)
        formula: string;         // Calculation formula description
        calculated: number;      // Final weighted voting power
      };
    };
  };
  proofs: {
    phantom: {
      signature: string;         // Cryptographic signature from wallet
      message: string;           // Message that was signed
    };
    merkle: {
      root: string;              // Root hash of the Merkle tree
      leaf: string;              // Leaf hash for this vote
    };
  };
  storage: {
    previousCID: string;         // Reference to previous vote in chain
    ipfs: {
      cid: string;               // Content identifier on IPFS
      gateway: string;           // IPFS gateway URL
    };
  };
}

// Define tier multipliers for voting power calculation
const TIER_MULTIPLIERS = {
  'Diamond': 2.0,
  'Gold': 1.5,
  'Silver': 1.2,
  'Tier 0': 0
};

// Define the public API for the wallet context
interface WalletContextType {
  address: PublicKey | null;                // User's wallet address
  isConnected: boolean;                     // Connection status
  isLoading: boolean;                       // Loading state for data fetching
  solBalance: number;                       // SOL balance in lamports
  solBalanceFormatted: string;              // Formatted SOL balance
  tokenMint: string;                        // Token mint address
  tokenOwner: string;                       // Token owner address
  tokenAmount: number;                      // Token balance
  tokenState: string;                       // Token account state
  hasTokens: boolean;                       // Whether user has tokens
  ataAddress: string;                       // Associated token account address
  transactions: any[];                      // Transaction history
  isTransactionsError: boolean;             // Transaction fetch error state
  refetchTransactions: () => void;          // Refetch transactions function
  tier: {                                   // User's membership tier
    level: string;                         
    multiplier: number;
    daysRequired: number;
    icon: ElementType<any, keyof JSX.IntrinsicElements>;
  };
  votingPower: {                            // User's voting power details
    weight: number;
    stake: number;
    tierMultiplier: number;
    formula: string;
  };
  votingHistory: VotingDelta<DAOVote>[];    // History of user's votes
  submitVote: (proposalId: string, choice: 'FOR'|'AGAINST') => Promise<string>; // Vote submission function
}

// Define the structure of a DAO vote
export type DAOVote = {
  proposalId: string;          // Proposal identifier
  choice: 'FOR' | 'AGAINST';   // Vote choice
  timestamp: string;           // Vote timestamp
  stake: number;               // User's token stake at time of voting
  tier: string;                // User's tier at time of voting
};

// Create the context with undefined default value
const WalletContext = createContext<WalletContextType | undefined>(undefined);

/**
 * WalletProviderContext - React context provider for wallet functionality
 * Provides wallet connection status, balances, and voting capabilities
 */
export const WalletProviderContext: React.FC<{
  children: ReactNode;
}> = ({ children }) => {
  // Get wallet connection from Solana wallet adapter
  const { publicKey } = useWallet();
  const isConnected = !!publicKey;
  
  // State for voting history and CID chain
  const [votingHistory, setVotingHistory] = useState<VotingDelta<DAOVote>[]>([]);
  const [deltaChain, setDeltaChain] = useState<string[]>([]);
  
  // Create a persistent voting client to maintain Merkle tree state
  const votingClient = useMemo(() => new PhantomVotingClient<DAOVote>(), []);

  // Dummy PublicKey for initial state and unconnected users
  const dummyPublicKey = useMemo(() => {
    try {
      return new PublicKey("11111111111111111111111111111111");
    } catch (e) {
      console.error("Failed to create dummy PublicKey", e);
      return undefined;
    }
  }, []);

  // Use real address when connected, dummy otherwise
  const queryAddress = isConnected ? publicKey : dummyPublicKey;

  // Get SOL balance from blockchain
  const { data: solBalance, isLoading: solLoading } = useGetBalance({
    address: queryAddress as PublicKey,
  });

  // Get token information from blockchain
  const {
    data: tokenInfo,
    isLoading: tokenInfoLoading,
    hasTokens,
  } = useGetTokenInfo({
    address: queryAddress as PublicKey,
  });

  // Extract token data from API response
  const tokenData = isConnected && hasTokens && tokenInfo
    ? tokenInfo.value[0]?.account?.data?.parsed?.info
    : null;

  // Extract specific token details
  const tokenMint = tokenData?.mint ?? "N/A";
  const tokenOwner = tokenData?.owner ?? publicKey?.toString() ?? "N/A";
  const tokenAmount = tokenData?.tokenAmount?.uiAmount ?? 0;
  const tokenState = tokenData?.state ?? "N/A";

  // Get associated token account address
  const { data: ata, isLoading: ataLoading } = useGetATA(
    isConnected && tokenMint !== "N/A" ? tokenMint : undefined,
    isConnected ? publicKey : undefined,
  );

  // Get transaction history for the token account
  const {
    data: transactions,
    isLoading: txsLoading,
    refetch: refetchTransactions,
    isError: isTransactionsError,
  } = useGetTxs({
    ata: isConnected && ata ? ata : "N/A",
  }) as { 
    data: (VersionedTransactionResponse | null)[] | undefined; 
    isLoading: boolean;
    refetch: () => void;
    isError: boolean;
  };

  
  // Filter transactions to get valid ones
  const filteredTxs = transactions?.filter(
    (tx): tx is VersionedTransactionResponse => tx !== null,
  ) as ParsedTransactionWithMeta[] | undefined;

  // Calculate days since first token purchase for tier determination
  const daysSincePurchase = filteredTxs
    ? getDaysSinceFirstPurchase(filteredTxs, queryAddress?.toString() ?? "")
    : 0;

  // Current token stake for voting power calculation
  const currentStake = tokenAmount;
  
  // Determine user's tier based on days held and stake
  const currentTier = (() => {
    if (currentStake === 0) {
      return {
        level: "Tier 0",
        multiplier: TIER_MULTIPLIERS['Tier 0'],
        daysRequired: 0,
        icon: Star,
      };
    }

    // Determine tier based on days held
    if (daysSincePurchase >= 90) {
      return TIER_LEVELS[0]; // Diamond
    } else if (daysSincePurchase >= 60) {
      return TIER_LEVELS[1]; // Gold
    }
    return TIER_LEVELS[2]; // Silver
  })();

  // Calculate voting power based on stake and tier
  const votingWeight = Math.sqrt(currentStake) * currentTier.multiplier;
  
  /**
   * Helper function to walk the vote chain and retrieve all votes
   * Traverses from latest to earliest vote by following previousCID links
   */
  const retrieveVoteChain = useCallback(async (startingCID: string): Promise<VotingDelta<DAOVote>[]> => {
    if (!startingCID) return [];
    
    const votes: VotingDelta<DAOVote>[] = [];
    const processedCIDs = new Set<string>();
    let currentCID = startingCID;
    
    // Walk the chain from newest to oldest vote
    while (currentCID && !processedCIDs.has(currentCID)) {
      processedCIDs.add(currentCID);
      try {
        // Use type assertion to access the private getDelta method
        const delta = await (votingClient as any).getDelta(currentCID);
        votes.push(delta);
        currentCID = delta.storage.previousCID;
      } catch (error) {
        console.error(`Error retrieving vote with CID ${currentCID}:`, error);
        break;
      }
    }
    
    return votes;
  }, [votingClient]);
  
  /**
   * Initialize voting history when wallet connects
   * Retrieves the vote chain from IPFS and rebuilds state
   */
  useEffect(() => {
    const initializeVotingHistory = async () => {
      try {
        // Get the latest vote CID from IPFS
        const latestCID = await (votingClient as any).getLatestCID();
        if (latestCID) {
          // Retrieve the full vote chain
          const votes = await retrieveVoteChain(latestCID);
          setVotingHistory(votes);
          setDeltaChain(prev => [latestCID, ...prev]);
        }
      } catch (error) {
        console.error("Failed to initialize voting history:", error);
      }
    };
    
    if (isConnected) {
      initializeVotingHistory();
    }
  }, [isConnected, retrieveVoteChain, votingClient]);

  /**
   * Submit a vote to the DAO with Merkle tree verification
   * Reconstructs the Merkle tree with all previous votes before submitting
   * 
   * @param proposalId - The ID of the proposal being voted on
   * @param choice - The vote choice (FOR or AGAINST)
   * @returns Promise resolving to the IPFS CID of the stored vote
   */
  const submitVote = async (proposalId: string, choice: 'FOR'|'AGAINST') => {
    if (!publicKey) throw new Error("Wallet not connected");
    const provider = (window as any).phantom?.solana;
    
    if (!provider) throw new Error("Phantom wallet required");

    try {
      // Get the latest CID and reconstruct the Merkle tree
      const latestCID = deltaChain.length > 0 ? deltaChain[0] : await (votingClient as any).getLatestCID();
      const allVotes = latestCID ? await retrieveVoteChain(latestCID) : [];
      
      // Reconstruct the Merkle tree with all previous votes to maintain the chain
      if (allVotes.length > 0) {
        for (const vote of allVotes) {
          // Use type assertion to access the private updateMerkleTree method
          (votingClient as any).updateMerkleTree(vote.proofs.merkle.leaf);
        }
      }
      
      // Prepare vote data with current user state
      const voteData: DAOVote = {
        proposalId,
        choice,
        timestamp: new Date().toISOString(),
        stake: currentStake,
        tier: currentTier.level
      };

      // Create the vote with the reconstructed Merkle tree
      const cid = await votingClient.createVote(voteData, provider);
      
      // Retrieve the created vote from IPFS to get the accurate proofs
      const newVote = await (votingClient as any).getDelta(cid);
      
      // Update state with the new vote information
      setDeltaChain(prev => [cid, ...prev]);
      setVotingHistory(prev => [newVote, ...prev]);
      
      return cid;
    } catch (error) {
      console.error("Voting failed:", error);
      throw error;
    }
  };

  // Combined loading state for all data fetching operations
  const isLoading = isConnected && 
    (solLoading || tokenInfoLoading || ataLoading || txsLoading);

  // Construct the context value object with all wallet and voting data
  const value = {
    address: publicKey,
    isConnected,
    isLoading,
    solBalance: isConnected && solBalance ? solBalance : 0,
    solBalanceFormatted: isConnected && solBalance
      ? (Math.round((solBalance / LAMPORTS_PER_SOL) * 100000) / 100000).toFixed(5)
      : "0",
    tokenMint,
    tokenOwner,
    tokenAmount,
    tokenState,
    hasTokens: isConnected && !!hasTokens,
    ataAddress: isConnected && ata ? ata : "N/A",
    transactions: isConnected && transactions ? transactions : [],
    isTransactionsError: isConnected && isTransactionsError,
    refetchTransactions: isConnected ? refetchTransactions : () => {},
    tier: currentTier,
    votingPower: {
      weight: votingWeight,
      stake: currentStake,
      tierMultiplier: currentTier.multiplier,
      formula: "sqrt(stake) * tierMultiplier"
    },
    votingHistory,
    submitVote
  };

  return (
    <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
  );
};

/**
 * Custom hook for accessing wallet context
 * Provides type-safe access to wallet functionality
 * @returns The wallet context object
 * @throws Error if used outside WalletProviderContext
 */
export const useWalletInfo = (): WalletContextType => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWalletInfo must be used within a WalletProviderContext");
  }
  return context;
};

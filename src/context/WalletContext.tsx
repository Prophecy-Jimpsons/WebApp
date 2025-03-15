import React, {
  createContext,
  useContext,
  ReactNode,
  ElementType,
  useState,
  useMemo,
} from "react";
import {
  LAMPORTS_PER_SOL,
  ParsedTransactionWithMeta,
  PublicKey,
  VersionedTransactionResponse,
} from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";
import { PhantomVotingClient, FILABASE_CONFIG } from "@/config/filebase-dao";
import {
  useGetATA,
  useGetBalance,
  useGetTokenInfo,
  useGetTxs,
} from "@/hooks/useAccount";
import { getDaysSinceFirstPurchase } from "@/utils/helpers";
import { Star } from "lucide-react";
import { TIER_LEVELS } from "@/components/composite/AccountDetails/config";

// Define VotingDelta interface directly instead of importing
export interface VotingDelta<T> {
  version: string;
  timestamp: string;
  vote: {
    data: T;
    metadata: {
      sourceId: string;
      voter: string;
      publicKey: string;
      weight: {
        raw: number;
        tier: string;
        formula: string;
        calculated: number;
      };
    };
  };
  proofs: {
    phantom: {
      signature: string;
      message: string;
    };
    merkle: {
      root: string;
      leaf: string;
    };
  };
  storage: {
    previousCID: string;
    ipfs: {
      cid: string;
      gateway: string;
    };
  };
}




// Define tier multipliers directly
const TIER_MULTIPLIERS = {
  'Diamond': 2.0,
  'Gold': 1.5,
  'Silver': 1.2,
  'Tier 0': 0
};

interface WalletContextType {
  address: PublicKey | null;
  isConnected: boolean;
  isLoading: boolean;
  solBalance: number;
  solBalanceFormatted: string;
  tokenMint: string;
  tokenOwner: string;
  tokenAmount: number;
  tokenState: string;
  hasTokens: boolean;
  ataAddress: string;
  transactions: any[];
  isTransactionsError: boolean;
  refetchTransactions: () => void;
  tier: {
    level: string;
    multiplier: number;
    daysRequired: number;
    icon: ElementType<any, keyof JSX.IntrinsicElements>;
  };
  votingPower: {
    weight: number;
    stake: number;
    tierMultiplier: number;
    formula: string;
  };
  votingHistory: VotingDelta<DAOVote>[];
  submitVote: (proposalId: string, choice: 'FOR'|'AGAINST') => Promise<string>;
}

export type DAOVote = {
  proposalId: string;
  choice: 'FOR' | 'AGAINST';
  timestamp: string;
  stake: number;
  tier: string;
};

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProviderContext: React.FC<{
  children: ReactNode;
}> = ({ children }) => {
  const { publicKey } = useWallet();
  const isConnected = !!publicKey;
  const [votingHistory, setVotingHistory] = useState<VotingDelta<DAOVote>[]>([]);
  const votingClient = useMemo(() => new PhantomVotingClient<DAOVote>(), []);

  // Dummy PublicKey for initial state
  const dummyPublicKey = useMemo(() => {
    try {
      return new PublicKey("11111111111111111111111111111111");
    } catch (e) {
      console.error("Failed to create dummy PublicKey", e);
      return undefined;
    }
  }, []);

  // Query address handling
  const queryAddress = isConnected ? publicKey : dummyPublicKey;

  // Wallet balance and token hooks
  const { data: solBalance, isLoading: solLoading } = useGetBalance({
    address: queryAddress as PublicKey,
  });

  const {
    data: tokenInfo,
    isLoading: tokenInfoLoading,
    hasTokens,
  } = useGetTokenInfo({
    address: queryAddress as PublicKey,
  });

  // Process token data
  const tokenData = isConnected && hasTokens && tokenInfo
    ? tokenInfo.value[0]?.account?.data?.parsed?.info
    : null;

  const tokenMint = tokenData?.mint ?? "N/A";
  const tokenOwner = tokenData?.owner ?? publicKey?.toString() ?? "N/A";
  const tokenAmount = tokenData?.tokenAmount?.uiAmount ?? 0;
  const tokenState = tokenData?.state ?? "N/A";

  // ATA handling
  const { data: ata, isLoading: ataLoading } = useGetATA(
    isConnected && tokenMint !== "N/A" ? tokenMint : undefined,
    isConnected ? publicKey : undefined,
  );

  // Transaction history
  const {
    data: transactions,
    isLoading: txsLoading,
    refetch: refetchTransactions,
    isError: isTransactionsError,
  } = useGetTxs({
    ata: isConnected && ata ? ata : "N/A",
  });

  // Tier calculation
  const filteredTxs = transactions?.filter(
    (tx): tx is VersionedTransactionResponse => tx !== null,
  ) as ParsedTransactionWithMeta[] | undefined;

  const daysSincePurchase = filteredTxs
    ? getDaysSinceFirstPurchase(filteredTxs, queryAddress?.toString() ?? "")
    : 0;

  // Tier and voting power calculation
  const currentStake = tokenAmount;
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

  const votingWeight = Math.sqrt(currentStake) * currentTier.multiplier;
  const [deltaChain, setDeltaChain] = useState<string[]>([]);

  // Voting submission handler
  const submitVote = async (proposalId: string, choice: 'FOR'|'AGAINST') => {
    if (!publicKey) throw new Error("Wallet not connected");
    const provider = (window as any).phantom?.solana;
    
    if (!provider) throw new Error("Phantom wallet required");

    try {
      const voteData: DAOVote = {
        proposalId,
        choice,
        timestamp: new Date().toISOString(),
        stake: currentStake,
        tier: currentTier.level
      };

      const cid = await votingClient.createVote(voteData, provider);
      
      // Instead of accessing private method, store vote directly
      const newVote: VotingDelta<DAOVote> = {
        version: "1.0.0",
        timestamp: new Date().toISOString(),
        vote: {
          data: voteData,
          metadata: {
            sourceId: proposalId,
            voter: publicKey.toString(),
            publicKey: publicKey.toString(),
            weight: {
              raw: currentStake,
              tier: currentTier.level,
              formula: "sqrt(stake) * tierMultiplier",
              calculated: votingWeight
            }
          }
        },
        proofs: {
          phantom: {
            signature: "signature-placeholder",
            message: JSON.stringify(voteData)
          },
          merkle: {
            root: "root-placeholder",
            leaf: "leaf-placeholder"
          }
        },
        storage: {
          previousCID: deltaChain[deltaChain.length - 1] || "",
          ipfs: {
            cid: cid,
            gateway: `${FILABASE_CONFIG.ipfsEndpoint}/ipfs/`
          }
        }
      };

      // After successful upload
      setDeltaChain(prev => [...prev, cid]);
      
      setVotingHistory(prev => [newVote, ...prev]);
      return cid;
    } catch (error) {
      console.error("Voting failed:", error);
      throw error;
    }
  };

  // Combined loading state
  const isLoading = isConnected && 
    (solLoading || tokenInfoLoading || ataLoading || txsLoading);

  // Context value
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

export const useWalletInfo = (): WalletContextType => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWalletInfo must be used within a WalletProviderContext");
  }
  return context;
};

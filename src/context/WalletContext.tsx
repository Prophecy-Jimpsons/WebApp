import React, {
  createContext,
  useContext,
  ReactNode,
  ElementType,
} from "react";
import {
  LAMPORTS_PER_SOL,
  ParsedTransactionWithMeta,
  PublicKey,
  VersionedTransactionResponse,
} from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  useGetATA,
  useGetBalance,
  useGetTokenInfo,
  useGetTxs,
} from "@/hooks/useAccount";
import { getDaysSinceFirstPurchase } from "@/utils/helpers";
import { Star } from "lucide-react";
import { TIER_LEVELS } from "@/components/composite/AccountDetails/config";

interface WalletContextType {
  address: PublicKey | null;
  isConnected: boolean;

  // Combined loading state
  isLoading: boolean;

  // SOL balance
  solBalance: number;
  solBalanceFormatted: string;

  // Token info
  tokenMint: string;
  tokenOwner: string;
  tokenAmount: number;
  tokenState: string;
  hasTokens: boolean;

  // ATA
  ataAddress: string;

  // Transactions
  transactions: any[];
  isTransactionsError: boolean;
  refetchTransactions: () => void;

  //Tier
  tier: {
    level: string;
    multiplier: number;
    daysRequired: number;
    icon: ElementType<any, keyof JSX.IntrinsicElements>;
  };
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProviderContext: React.FC<{
  children: ReactNode;
}> = ({ children }) => {
  const { publicKey } = useWallet();
  const isConnected = !!publicKey;

  // Create a dummy PublicKey for hooks when wallet is not connected
  const dummyPublicKey = React.useMemo(() => {
    try {
      return new PublicKey("11111111111111111111111111111111");
    } catch (e) {
      console.error("Failed to create dummy PublicKey", e);
      return undefined;
    }
  }, []);

  // Use the actual publicKey if connected, otherwise use dummy
  const queryAddress = isConnected ? publicKey : dummyPublicKey;

  // Always call hooks with a valid PublicKey (real or dummy)
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

  // Process data only if connected and data exists
  const tokenData =
    isConnected && hasTokens && tokenInfo
      ? tokenInfo.value[0]?.account?.data?.parsed?.info
      : null;

  const tokenMint = tokenData?.mint ?? "N/A";
  const tokenOwner = tokenData?.owner ?? publicKey?.toString() ?? "N/A";
  const tokenAmount = tokenData?.tokenAmount?.uiAmount ?? 0;
  const tokenState = tokenData?.state ?? "N/A";

  // Continue calling hooks with appropriate parameters
  const { data: ata, isLoading: ataLoading } = useGetATA(
    isConnected && tokenMint !== "N/A" ? tokenMint : undefined,
    isConnected ? publicKey : undefined,
  );

  const {
    data: transactions,
    isLoading: txsLoading,
    refetch: refetchTransactions,
    isError: isTransactionsError,
  } = useGetTxs({
    ata: isConnected && ata ? ata : "N/A",
  });

  // User tier level
  const filteredTxs = transactions?.filter(
    (tx): tx is VersionedTransactionResponse => tx !== null,
  ) as ParsedTransactionWithMeta[] | undefined;

  const daysSincePurchase = filteredTxs
    ? getDaysSinceFirstPurchase(filteredTxs, queryAddress?.toString() ?? "")
    : 0;

  const currentTier = (() => {
    if (tokenAmount === 0) {
      return {
        level: "Tier 0",
        multiplier: 0,
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

  // Combined loading state
  const isLoading =
    isConnected && (solLoading || tokenInfoLoading || ataLoading || txsLoading);

  // Create context value with combined loading state
  const value = {
    address: publicKey,
    isConnected,

    // Combined loading state
    isLoading,

    // SOL balance
    solBalance: isConnected && solBalance ? solBalance : 0,
    solBalanceFormatted:
      isConnected && solBalance
        ? (
            Math.round((solBalance / LAMPORTS_PER_SOL) * 100000) / 100000
          ).toFixed(5)
        : "0",

    // Token info
    tokenMint,
    tokenOwner,
    tokenAmount,
    tokenState,
    hasTokens: isConnected && !!hasTokens,

    // ATA
    ataAddress: isConnected && ata ? ata : "N/A",

    // Transactions
    transactions: isConnected && transactions ? transactions : [],
    isTransactionsError: isConnected && isTransactionsError,
    refetchTransactions: isConnected ? refetchTransactions : () => {},

    // User tier level
    tier: currentTier,
  };

  return (
    <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
  );
};

export const useWalletInfo = (): WalletContextType => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error(
      "useWalletInfo must be used within a WalletProviderContext",
    );
  }
  return context;
};

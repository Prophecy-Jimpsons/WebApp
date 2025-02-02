import {
  ConfirmedSignatureInfo,
  ParsedTransactionWithMeta,
} from "@solana/web3.js";
import { TokenTransfer, TransactionMeta } from "@/types/blockchain";

export interface Transaction extends ConfirmedSignatureInfo {
  tokenTransfers?: TokenTransfer[];
  meta?: TransactionMeta;
}

export const formatDistanceToNow = (timestamp: number): string => {
  const now = new Date();
  const date = new Date(timestamp * 1000);
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
  };

  for (const [unit, seconds] of Object.entries(intervals)) {
    const interval = Math.floor(diffInSeconds / seconds);
    if (interval >= 1) {
      return `${interval} ${unit}${interval === 1 ? "" : "s"} ago`;
    }
  }

  return "just now";
};

export const formatAddress = (address: string): string =>
  `${address.slice(0, 4)}...${address.slice(-4)}`;

export const formatTimeAgo = (timestamp: number) => {
  const now = new Date();
  const txDate = new Date(timestamp * 1000);
  const diffInDays = Math.floor(
    (now.getTime() - txDate.getTime()) / (1000 * 60 * 60 * 24),
  );
  return `${diffInDays} days ago`;
};

export function getDaysSinceFirstPurchaseOld(
  transactions: ParsedTransactionWithMeta[],
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _address: string,
): number {
  const startDate = new Date("2025-01-03T00:00:00.000Z");

  // Sort and filter transactions after Jan 3, 2025
  const relevantTransactions = transactions
    .filter((tx) => {
      if (!tx.blockTime) return false;
      const txDate = new Date(tx.blockTime * 1000);
      return txDate >= startDate;
    })
    .sort((a, b) => (a.blockTime || 0) - (b.blockTime || 0));

  console.log("Filtered transactions:", {
    total: transactions.length,
    filtered: relevantTransactions.length,
  });

  // Find first JIMP purchase transaction after Jan 3
  const firstPurchase = relevantTransactions.find((tx) => {
    if (tx.meta?.err !== null) return false;
    return true; // For now, consider any successful transaction
  });

  if (!firstPurchase || !firstPurchase.blockTime) {
    console.log("No valid purchase found after Jan 3, 2025");
    return 0;
  }

  const purchaseDate = new Date(firstPurchase.blockTime * 1000);
  const today = new Date(); // 5 PM EST

  today.setHours(0, 0, 0, 0);

  console.log("Date calculations:", {
    purchaseDate: purchaseDate.toISOString(),
    today: today.toISOString(),
  });

  const diffTime = Math.abs(today.getTime() - purchaseDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  console.log(`Days held: ${diffDays}`);

  return diffDays;
}

export function getDaysSinceFirstPurchase(
  transactions: ParsedTransactionWithMeta[],
  address: string,
): number {
  const startDate = new Date("2025-01-03T00:00:00.000Z");

  // Filter transactions after Jan 3, 2025, and ensure they are successful
  const relevantTransactions = transactions
    .filter((tx) => {
      if (!tx.blockTime) return false; // Skip transactions without a blockTime
      const txDate = new Date(tx.blockTime * 1000);
      return txDate >= startDate && tx.meta?.err === null; // Only successful transactions after Jan 3
    })
    .sort((a, b) => (a.blockTime || 0) - (b.blockTime || 0)); // Sort by blockTime (ascending)

  // Track the token balance over time
  let tokenBalance = 0;
  let firstPurchaseDate: Date | null = null;
  let zeroBalanceDate: Date | null = null;

  for (const tx of relevantTransactions) {
    const txDate = new Date(tx.blockTime! * 1000);

    // Check if the transaction involves the SPL token
    const tokenBalanceChange = tx.meta?.postTokenBalances?.find(
      (balance) => balance.owner === address,
    )?.uiTokenAmount.uiAmount;

    if (tokenBalanceChange !== undefined) {
      tokenBalance = tokenBalanceChange ?? 0;

      // If the token balance becomes zero, record the date
      if (tokenBalance === 0 && !zeroBalanceDate) {
        zeroBalanceDate = txDate;
      }

      // If the token balance increases from zero, reset the zeroBalanceDate
      if (tokenBalance > 0 && zeroBalanceDate) {
        zeroBalanceDate = null;
      }

      // Record the first purchase date if it hasn't been set yet
      if (tokenBalance > 0 && !firstPurchaseDate) {
        firstPurchaseDate = txDate;
      }
    }
  }

  // If the token balance is zero, use the zeroBalanceDate as the start date
  const startDateForCalculation =
    tokenBalance === 0 ? zeroBalanceDate : firstPurchaseDate;

  if (!startDateForCalculation) {
    // console.warn("No valid purchase or zero balance found after Jan 3, 2025");
    return 0;
  }

  const today = new Date(); // Current date
  today.setHours(0, 0, 0, 0); // Normalize to midnight for accurate day calculation

  const diffTime = Math.abs(
    today.getTime() - startDateForCalculation.getTime(),
  );
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays;
}

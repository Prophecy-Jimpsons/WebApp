import { ConfirmedSignatureInfo } from "@solana/web3.js";
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

// TODO: Need to fix this, filter transactions is not working as expected
export function getDaysSinceFirstPurchase(
  transactions: Transaction[],
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _address: string,
): number {
  console.log("transactions in helpers", transactions);
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
    console.log("Checking transaction:", {
      date: new Date(tx.blockTime! * 1000).toISOString(),
      signature: tx.signature,
    });

    if (tx.err) return false;
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

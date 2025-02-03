import { ParsedTransactionWithMeta } from "@solana/web3.js";
import { RefreshCw } from "lucide-react";
import { useState } from "react";
import styles from "./AccountTransactions.module.css";
import TransactionTable from "./TransactionTable";
interface AccountTransactionsProps {
  transactions: ParsedTransactionWithMeta[];
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
}

export function AccountTransactions({
  transactions,
  isLoading,
  isError,
  refetch,
}: AccountTransactionsProps) {
  const [showAll, setShowAll] = useState<boolean>(false);
  const ITEMS_PER_PAGE = 5; // constant for number of items to show at a time

  const hasMoreTransactions = transactions?.length > ITEMS_PER_PAGE;

  const displayedTransactions = showAll
    ? transactions || []
    : transactions?.slice(0, 5) || [];

  return (
    <div className={styles.transactionsSection}>
      <div className={styles.header}>
        <h2 className={styles.title}>Transaction History</h2>
        <button className={styles.refreshButton} onClick={() => refetch()}>
          <RefreshCw size={16} />
        </button>
      </div>

      {isLoading ? (
        <div>
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className={`${styles.loadingRow} ${styles.loadingPulse}`}
            >
              <div className={styles.loadingCell} />
              <div className={styles.loadingCell} />
              <div className={styles.loadingCell} />
              <div className={styles.loadingCell} />
              <div className={styles.loadingCell} />
            </div>
          ))}
        </div>
      ) : isError ? (
        <div className={styles.errorMessage}>Error fetching transactions</div>
      ) : displayedTransactions.length === 0 ? (
        <div className={styles.emptyMessage}>No transactions found</div>
      ) : (
        <>
          <TransactionTable transactions={displayedTransactions} />

          {hasMoreTransactions && (
            <div className={styles.showMoreContainer}>
              <button
                className={styles.showMoreButton}
                onClick={() => setShowAll(!showAll)}
              >
                {showAll ? "Show Less" : `Show All (${transactions.length})`}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

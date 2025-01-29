import { formatAddress, formatTimeAgo } from "@/utils/helpers";
import { ParsedTransactionWithMeta } from "@solana/web3.js";
import { Check, Copy } from "lucide-react";
import styles from "./TransactionTable.module.css";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";

export default function TransactionTable({
  transactions,
}: {
  transactions: ParsedTransactionWithMeta[];
}) {
  const { copiedMap, copyToClipboard } = useCopyToClipboard();
  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Signature</th>
            <th>Block</th>
            <th>Age</th>
            <th>Timestamp</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {transactions &&
            transactions.map((transaction: ParsedTransactionWithMeta) => {
              const signature = transaction.transaction.signatures[0];
              return (
                <tr key={transaction.blockTime}>
                  <td>
                    <div className={styles.signatureCell}>
                      <span className={styles.monospace}>
                        {formatAddress(signature)}
                      </span>
                      <button
                        className={styles.copyButton}
                        onClick={() => copyToClipboard(signature, signature)}
                      >
                        <span className={styles.copyIcon}>
                          {copiedMap[signature] ? (
                            <Check size={16} />
                          ) : (
                            <Copy size={16} />
                          )}
                        </span>
                      </button>
                    </div>
                  </td>
                  <td>{transaction.slot}</td>
                  <td>{formatTimeAgo(transaction.blockTime ?? 0)}</td>
                  <td>
                    {transaction.blockTime
                      ? new Date(transaction.blockTime * 1000).toISOString()
                      : ""}
                  </td>
                  <td>
                    <span
                      className={
                        transaction.meta?.err === null
                          ? styles.success
                          : styles.failed
                      }
                    >
                      {transaction.meta?.err === null ? "Success" : "Failed"}
                    </span>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
}

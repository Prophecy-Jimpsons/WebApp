import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { RefreshCw, Trophy, Crown, Star } from "lucide-react";
import { useMemo, useState } from "react";
import {
  useGetBalance,
  useGetTokenAccounts,
  useGetSignatures,
} from "./AccountDataAccess";
import styles from "./AccountUI.module.css";

type TierInfo = {
  level: string;
  multiplier: number;
  daysRequired: number;
  icon: React.ElementType;
};

const TIER_LEVELS: TierInfo[] = [
  {
    level: "Diamond",
    multiplier: 5,
    daysRequired: 90,
    icon: Trophy,
  },
  {
    level: "Gold",
    multiplier: 3,
    daysRequired: 60,
    icon: Crown,
  },
  {
    level: "Silver",
    multiplier: 2,
    daysRequired: 30,
    icon: Star,
  },
];

function LoadingBalance() {
  return (
    <div className={styles.loadingPulse}>
      <div className={styles.loadingBar} style={{ width: "6rem" }} />
      <div
        className={`${styles.loadingBar} ${styles.loadingBarLarge}`}
        style={{ width: "8rem" }}
      />
    </div>
  );
}

function TierLevel({ address }: { address: PublicKey }) {
  const tokenQuery = useGetTokenAccounts({ address });

  const jimpBalance = useMemo(() => {
    return (
      tokenQuery.data?.find(
        (item) =>
          item.account.data.parsed.info.mint ===
          "D86WEcSeM4YkQKqP6LLLt8bRypbJnaQcPUxHAVsopump",
      )?.account.data.parsed.info.tokenAmount.uiAmount ?? 0
    );
  }, [tokenQuery.data]);

  const currentTier = useMemo(() => {
    if (jimpBalance === 0) {
      return {
        level: "Tier 0",
        multiplier: 0,
        daysRequired: 0,
        icon: Star,
      };
    }
    return TIER_LEVELS[2]; // Default Silver
  }, [jimpBalance]);

  if (tokenQuery.isLoading) {
    return <LoadingBalance />;
  }

  return (
    <div className={styles.tierSection}>
      <h2 className={styles.tierTitle}>HODL Tier Level</h2>
      <div className={styles.tierCard}>
        <div className={styles.tierHeader}>
          <currentTier.icon size={24} className={styles.tierIcon} />
          <h3>{currentTier.level}</h3>
        </div>
        <div className={styles.tierDetails}>
          <p>Reward Multiplier: {currentTier.multiplier}X</p>
          {currentTier.level !== "Tier 0" && (
            <p>Required Days: {currentTier.daysRequired}+</p>
          )}
        </div>
        {currentTier.level !== "Tier 0" && (
          <div className={styles.tierProgress}>
            <div
              className={styles.progressBar}
              style={{ width: `${(30 / currentTier.daysRequired) * 100}%` }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export function AccountBalance({ address }: { address: PublicKey }) {
  const solQuery = useGetBalance({ address });
  const tokenQuery = useGetTokenAccounts({ address });

  const jimpBalance = useMemo(() => {
    return (
      tokenQuery.data?.find(
        (item) =>
          item.account.data.parsed.info.mint ===
          "D86WEcSeM4YkQKqP6LLLt8bRypbJnaQcPUxHAVsopump",
      )?.account.data.parsed.info.tokenAmount.uiAmount ?? 0
    );
  }, [tokenQuery.data]);

  return (
    <>
      <div className={styles.titleSection}>
        <h1 className={styles.mainTitle}>ACCOUNT DETAILS</h1>
      </div>
      <div className={styles.balanceSection}>
        <div className={styles.balanceItem}>
          <h2 className={styles.balanceLabel}>SOL Balance</h2>
          <h1
            className={styles.balanceTitle}
            onClick={() => solQuery.refetch()}
          >
            {solQuery.isLoading ? (
              <LoadingBalance />
            ) : (
              <>
                {solQuery.data
                  ? Math.round((solQuery.data / LAMPORTS_PER_SOL) * 100000) /
                    100000
                  : "0"}{" "}
                SOL
              </>
            )}
          </h1>
        </div>

        <div className={styles.balanceItem}>
          <h2 className={styles.balanceLabel}>JIMP Balance</h2>
          <h1 className={styles.balanceTitle}>
            {tokenQuery.isLoading ? (
              <LoadingBalance />
            ) : (
              <>{jimpBalance} JIMP</>
            )}
          </h1>
        </div>
        <TierLevel address={address} />
      </div>
    </>
  );
}

export function AccountTransactions({ address }: { address: PublicKey }) {
  const query = useGetSignatures({ address });
  const [showAll, setShowAll] = useState(false);

  const items = useMemo(() => {
    if (!query.data) return [];
    return query.data.slice(0, showAll ? undefined : 5).map((item) => ({
      signature: item.signature,
      slot: item.slot,
      time: new Date((item.blockTime ?? 0) * 1000).toLocaleString(),
      status: item.err ? "Failed" : "Success",
    }));
  }, [query.data, showAll]);

  return (
    <div className={styles.transactionsSection}>
      <div className={styles.header}>
        <h2 className={styles.title}>Transaction History</h2>
        <button
          className={styles.refreshButton}
          onClick={() => query.refetch()}
        >
          <RefreshCw size={16} />
        </button>
      </div>

      {query.isLoading ? (
        <div>
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className={`${styles.loadingRow} ${styles.loadingPulse}`}
            >
              <div className={styles.loadingCell} />
              <div className={styles.loadingCell} />
              <div className={styles.loadingCell} />
              <div className={styles.loadingCell} />
            </div>
          ))}
        </div>
      ) : query.isError ? (
        <div className={styles.errorMessage}>
          Error: {(query.error as Error)?.message || "An error occurred"}
        </div>
      ) : items.length === 0 ? (
        <div className={styles.emptyMessage}>No transactions found</div>
      ) : (
        <>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Signature</th>
                <th>Slot</th>
                <th>Time</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.signature}>
                  <td style={{ fontFamily: "monospace" }}>
                    {item.signature.slice(0, 8)}...
                  </td>
                  <td>{item.slot}</td>
                  <td>{item.time}</td>
                  <td
                    className={
                      item.status === "Success"
                        ? styles.statusSuccess
                        : styles.statusFailed
                    }
                  >
                    {item.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {query.data && query.data.length > 5 && (
            <div style={{ textAlign: "center", marginTop: "1rem" }}>
              <button
                className={styles.refreshButton}
                onClick={() => setShowAll(!showAll)}
              >
                {showAll ? "Show Less" : "Show All"}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

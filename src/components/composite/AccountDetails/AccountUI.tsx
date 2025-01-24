import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { RefreshCw, Star } from "lucide-react";
import { useState } from "react";

import styles from "./AccountUI.module.css";
import {
  useGetBalance,
  useGetSignatures,
  useGetTokenAccounts,
  useGetTxs,
} from "@/hooks/useAccount";
import { getDaysSinceFirstPurchase } from "@/utils/helpers";

import { TIER_LEVELS } from "./config";
import SignatureTable from "./SignaturesTable";
import { getTxsByToken, useSPLTransfers } from "@/hooks/useSPLTransfers";
import TokenHistory from "./TokenHistory";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";

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
  const tokenMint = "D86WEcSeM4YkQKqP6LLLt8bRypbJnaQcPUxHAVsopump";
  const walletAdd = "5fiyYUBDeearyqFGvZ4VCb6z4UXhQzNsGQqFNuiNVg9V";
  const { data: tokenAccounts, isLoading: isTokenLoading } =
    useGetTokenAccounts({ address });
  const { data: signatures, isLoading: isSignaturesLoading } = useGetSignatures(
    { address },
  );

  const jimpBalance =
    tokenAccounts?.find(
      (item) =>
        item.account.data.parsed.info.mint ===
        "D86WEcSeM4YkQKqP6LLLt8bRypbJnaQcPUxHAVsopump",
    )?.account.data.parsed.info.tokenAmount.uiAmount ?? 0;

  const daysSincePurchase = signatures
    ? getDaysSinceFirstPurchase(signatures, address.toString())
    : 0;

  const currentTier = (() => {
    if (jimpBalance === 0) {
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

  if (isTokenLoading || isSignaturesLoading) {
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
            <>
              <p>Required Days: {currentTier.daysRequired}+</p>
              <p>Days Held: {daysSincePurchase}</p>
            </>
          )}
        </div>
        {currentTier.level !== "Tier 0" && (
          <div className={styles.tierProgress}>
            <div
              className={styles.progressBar}
              style={{
                width: `${(daysSincePurchase / currentTier.daysRequired) * 100}%`,
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export function AccountBalance({ address }: { address: PublicKey }) {
  const { data: solBalance, isLoading: solLoading } = useGetBalance({
    address,
  });

  const { data: tokenAccounts, isLoading: tokenLoading } = useGetTokenAccounts({
    address,
  });

  const jimpBalance =
    tokenAccounts?.find(
      (token) =>
        token.account.data.parsed.info.mint ===
        "D86WEcSeM4YkQKqP6LLLt8bRypbJnaQcPUxHAVsopump",
      "D86WEcSeM4YkQKqP6LLLt8bRypbJnaQcPUxHAVsopump",
    )?.account.data.parsed.info.tokenAmount.uiAmount ?? 0;

  if (solLoading || tokenLoading) {
    return <LoadingBalance />;
  }

  return (
    <>
      <div className={styles.titleSection}>
        <h1 className={styles.mainTitle}>ACCOUNT DETAILS</h1>
      </div>
      <div className={styles.balanceSection}>
        <div className={styles.balanceItem}>
          <h2 className={styles.balanceLabel}>SOL Balance</h2>
          <h1 className={styles.balanceTitle}>
            {solLoading ? (
              <LoadingBalance />
            ) : (
              <>
                {solBalance
                  ? Math.round((solBalance / LAMPORTS_PER_SOL) * 100000) /
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
            {tokenLoading ? <LoadingBalance /> : <>{jimpBalance} JIMP</>}
          </h1>
        </div>
        <TierLevel address={address} />
      </div>
    </>
  );
}

const tokenMint = "D86WEcSeM4YkQKqP6LLLt8bRypbJnaQcPUxHAVsopump";
const walletAddress = "5fiyYUBDeearyqFGvZ4VCb6z4UXhQzNsGQqFNuiNVg9V";
const ataAddress = "Do4A8XFQJJrb1UA5tnzcK9JkZgoFHVFpAPfFXfEAVSqf";
export function AccountTransactions({ address }: { address: PublicKey }) {
  const [showAll, setShowAll] = useState<boolean>(false);

  // if (splError) {
  //   return (
  //     <div>
  //       <p>Error: {splError}</p>
  //       <button onClick={fetchSPLTransfers}>Try Again</button>
  //     </div>
  //   );
  // }

  const ataAddPubkey = new PublicKey(ataAddress);

  const {
    data: signatures,
    refetch,
    isLoading,
    isError,
    error,
  } = useGetSignatures({ address });
  const { data: txs, isLoading: txsLoading } = useGetTxs({ ataAddPubkey });

  console.log("txs:", txs);

  const displayedSignatures = showAll
    ? signatures || []
    : signatures?.slice(0, 5) || [];

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
      ) : isError ? (
        <div className={styles.errorMessage}>
          Error: {(error as Error)?.message || "An error occurred"}
        </div>
      ) : signatures.length === 0 ? (
        <div className={styles.emptyMessage}>No transactions found</div>
      ) : (
        <>
          <SignatureTable signatures={displayedSignatures} />
          {/* <TokenHistory /> */}

          {signatures && signatures.length > 5 && (
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

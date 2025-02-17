import { Star } from "lucide-react";
import styles from "./TierLevel.module.css";
import { ParsedTransactionWithMeta, PublicKey } from "@solana/web3.js";
import { getDaysSinceFirstPurchase } from "@/utils/helpers";
import { TIER_LEVELS } from "./config";
import { Card } from "./Card";

interface TierInfoProps {
  address: PublicKey;
  jimpBalance: number;
  transactions: ParsedTransactionWithMeta[];
  isLoading: boolean;
}

export default function TierLevel({
  address,
  jimpBalance,
  transactions,
  isLoading,
}: TierInfoProps) {
  const daysSincePurchase = transactions
    ? getDaysSinceFirstPurchase(transactions, address.toString())
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

  const noDataFound =
    !isLoading && (transactions.length === 0 || jimpBalance === 0);

  return (
    <Card title="HODL Tier Level">
      {noDataFound && (
        <div className={styles.noDataMessage}>
          <p>
            No data found. Make sure you have JIMP tokens in your wallet and
            have made transactions to qualify for a tier.
          </p>
        </div>
      )}
      {!noDataFound && (
        <div className={styles.tierSection}>
          <div className={styles.tierHeader}>
            <currentTier.icon size={24} className={styles.tierIcon} />
            <h3>{currentTier.level}</h3>
          </div>
          <div className={styles.tierDetails}>
            <p>Reward Multiplier: {currentTier.multiplier}X</p>
            {currentTier.level !== "Tier 0" && (
              <>
                <p>
                  Required Days: <span>{currentTier.daysRequired}+ </span> days
                </p>

                <p>
                  Days Held:{" "}
                  {isLoading ? (
                    <span className={styles.loading}>00</span>
                  ) : (
                    daysSincePurchase.toString()
                  )}{" "}
                  days
                </p>
              </>
            )}
          </div>
          {currentTier.level !== "Tier 0" && (
            <div className={styles.tierProgress}>
              {isLoading && (
                <div
                  className={`${styles.loadingProgressBar} ${styles.loading}`}
                />
              )}
              <div
                className={styles.progressBar}
                style={{
                  width: `${(daysSincePurchase / currentTier.daysRequired) * 100}%`,
                }}
              />
            </div>
          )}
        </div>
      )}
    </Card>
  );
}

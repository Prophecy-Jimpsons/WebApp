import { Star } from "lucide-react";
import styles from "./TierLevel.module.css";
import { ParsedTransactionWithMeta, PublicKey } from "@solana/web3.js";
import { getDaysSinceFirstPurchase } from "@/utils/helpers";
import { TIER_LEVELS } from "./config";

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


  return (
    <div className={styles.tierSection}>
      <h2 className={styles.tierTitle}>HODL Tier Level</h2>
      <div className={`${styles.tierCard} ${isLoading ? styles.loading : ""}`}>
        <div className={styles.tierHeader}>
          {isLoading ? (
            <div className={styles.loadingIcon} />
          ) : (
            <currentTier.icon size={24} className={styles.tierIcon} />
          )}
          <h3>
            {isLoading ? (
              <div className={styles.loadingText} />
            ) : (
              currentTier.level
            )}
          </h3>
        </div>
        <div className={styles.tierDetails}>
          <p>
            {isLoading ? (
              <div className={styles.loadingText} />
            ) : (
              `Reward Multiplier: ${currentTier.multiplier}X`
            )}
          </p>
          {currentTier.level !== "Tier 0" && (
            <>
              <p>
                {isLoading ? (
                  <div className={styles.loadingText} />
                ) : (
                  `Required Days: ${currentTier.daysRequired}+`
                )}
              </p>
              <p>
                {isLoading ? (
                  <div className={styles.loadingText} />
                ) : (
                  `Days Held: ${daysSincePurchase}`
                )}
              </p>
            </>
          )}
        </div>
        {currentTier.level !== "Tier 0" && (
          <div className={styles.tierProgress}>
            {isLoading ? (
              <div className={styles.loadingProgressBar} />
            ) : (
              <div
                className={styles.progressBar}
                style={{
                  width: `${(daysSincePurchase / currentTier.daysRequired) * 100}%`,
                }}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

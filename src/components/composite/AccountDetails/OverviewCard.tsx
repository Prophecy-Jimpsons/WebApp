import { Check, Copy } from "lucide-react";

import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";
import { Card } from "./Card";
import styles from "./OverviewCard.module.css";

interface OverviewCardProps {
  token: string;
  solBalance: number | string;
  jimpBalance: number;
  owner: string;
  mint: string;
  state: "initialized" | "uninitialized";
  isLoading: boolean;
}

export function OverviewCard({
  token,
  solBalance,
  jimpBalance,
  owner,
  mint,
  state,
  isLoading,
}: OverviewCardProps) {
  const { copiedMap, copyToClipboard } = useCopyToClipboard();
  return (
    <Card title="Overview">
      <div className={styles.infoGrid}>
        <div className={styles.infoRow}>
          <span className={styles.label}>Token Address</span>
          <div className={styles.valueWrapper}>
            <span
              className={isLoading ? styles.loadingText : styles.addressLink}
            >
              {token}
            </span>
            <button
              className={styles.copyButton}
              onClick={async () => await copyToClipboard(token, "token")}
            >
              <span className={styles.copyIcon}>
                {copiedMap["token"] ? <Check size={16} /> : <Copy size={16} />}
              </span>
            </button>
          </div>
        </div>

        <div className={styles.infoRow}>
          <span className={styles.label}>SOL Balance</span>
          <span className={isLoading ? styles.loadingText : styles.value}>
            {solBalance} SOL
          </span>
        </div>

        <div className={styles.infoRow}>
          <span className={styles.label}>Mint</span>
          <div className={styles.valueWrapper}>
            <span
              className={isLoading ? styles.loadingText : styles.addressLink}
            >
              {mint}
            </span>
            <button
              className={styles.copyButton}
              onClick={async () => await copyToClipboard(mint, "mint")}
            >
              <span className={styles.copyIcon}>
                {copiedMap["mint"] ? <Check size={16} /> : <Copy size={16} />}
              </span>
            </button>
          </div>
        </div>

        <div className={styles.infoRow}>
          <span className={styles.label}>Owner</span>
          <div className={styles.valueWrapper}>
            <span
              className={isLoading ? styles.loadingText : styles.addressLink}
            >
              {owner}
            </span>
            <button
              className={styles.copyButton}
              onClick={async () => await copyToClipboard(owner, "owner")}
            >
              <span className={styles.copyIcon}>
                {copiedMap["owner"] ? <Check size={16} /> : <Copy size={16} />}
              </span>
            </button>
          </div>
        </div>

        <div className={styles.infoRow}>
          <span className={styles.label}>Balance</span>
          <span className={isLoading ? styles.loadingText : styles.value}>
            {jimpBalance} JIMP
          </span>
        </div>
        <div className={styles.infoRow}>
          <span className={styles.label}>State</span>
          <span className={isLoading ? styles.loadingText : styles.value}>
            {state}
          </span>
        </div>
      </div>
    </Card>
  );
}

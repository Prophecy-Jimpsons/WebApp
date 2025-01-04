import { FC, useState } from "react";
import Button from "@/components/ui/Button";
import styles from "./Hero.module.css";

import SOLANA from "@/assets/icons/chains/Solana_Network_Logo.png";
import BASE from "@/assets/icons/chains/Base_Network_Logo.svg";
import POLYGON from "@/assets/icons/chains/Polygon_Network_Logo.png";
import STARKNET from "@/assets/icons/chains/Starknet_Network_Logo.svg";

const Hero: FC = () => {
  const [copied, setCopied] = useState(false);
  const solanaAddress = "0x1234567890abcdef1234567890abcdef12345678";

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(solanaAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <section className={styles.heroWrapper}>
      <div className={styles.hero}>
        <div className={styles.floatingIcons}>
          <div className={`${styles.icon} ${styles.icon1}`}>
            <img src={SOLANA} alt="Solana logo" />
          </div>
          <div className={`${styles.icon} ${styles.icon2}`}>
            <img src={BASE} alt="Base logo" />
          </div>
          <div className={`${styles.icon} ${styles.icon3}`}>
            <img src={POLYGON} alt="Polygon logo" />
          </div>
          <div className={`${styles.icon} ${styles.icon4}`}>
            <img src={STARKNET} alt="Starknet logo" />
          </div>
        </div>

        <div className={styles.content}>
          <h1 className={styles.title}>
            <span className={styles.highlight}>PROPHECY</span>
            <span className={styles.regularText}>JIMPSONS</span>
          </h1>

          <h2 className={styles.subtitle}>
            Next Generation of{" "}
            <span className={styles.highlight}>Predictive NFTs</span>
          </h2>

          <p className={styles.description}>
            Create and trade predictions as unique NFTs with{" "}
            <span className={styles.highlight}>zero initial cost</span>. Powered
            by AI with verification and multi-chain support for maximum value.
          </p>

          <div className={styles.buttonGroup}>
            <Button variant="primary" to="/account-details">
              Account Details
            </Button>
            <Button
              variant="secondary"
              to="https://jimpsons.gitbook.io/jimpsons.org"
            >
              White paper
            </Button>
          </div>

          <div className={styles.contractContainer}>
            <span className={styles.contractLabel}>Contract Address</span>
            <div className={styles.addressWrapper}>
              <span className={styles.chainLabel}>JIMP</span>
              <span className={styles.address}>
                {formatAddress(solanaAddress)}
              </span>
              <button
                onClick={copyToClipboard}
                className={styles.copyButton}
                aria-label="Copy Solana contract address"
              >
                {copied ? (
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

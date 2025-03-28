import { FC, useState } from "react";
import Button from "@/components/ui/Button";
import styles from "./Hero.module.css";

import SOLANA from "@/assets/icons/chains/Solana_Network_Logo.png";
import SOLANA2 from "@/assets/icons/chains/Solana_Network_Logo_2.png";
import SOLANA3 from "@/assets/icons/chains/Solana_Network_Logo_3.png";
import SOLANA4 from "@/assets/icons/chains/Solana_Network_Logo_4.png";
import DexScreener from "@/assets/icons/chains/dex-screener-seeklogo.png";
// import BASE from "@/assets/icons/chains/Base_Network_Logo.svg";
// import POLYGON from "@/assets/icons/chains/Polygon_Network_Logo.png";
// import STARKNET from "@/assets/icons/chains/Starknet_Network_Logo.svg";

const Hero: FC = () => {
  const [copied, setCopied] = useState(false);
  const solanaAddress = "D86WEcSeM4YkQKqP6LLLt8bRypbJnaQcPUxHAVsopump";

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(solanaAddress);
      setCopied(true);
      if (navigator.vibrate) {
        navigator.vibrate(50);
      }
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
        {/* Floating Icons */}
        <div className={styles.floatingIcons}>
          <div className={`${styles.icon} ${styles.icon1}`}>
            <img src={SOLANA} alt="Solana logo" />
          </div>
          <div className={`${styles.icon} ${styles.icon2}`}>
            <img src={SOLANA2} alt="Base logo" />
          </div>
          <div className={`${styles.icon} ${styles.icon3}`}>
            <img src={SOLANA3} alt="Polygon logo" />
          </div>
          <div className={`${styles.icon} ${styles.icon4}`}>
            <img src={SOLANA4} alt="Starknet logo" />
          </div>
        </div>

        <div className={styles.content}>
                <h1 className={styles.title} style={{ textAlign: "center", marginBottom: "0.5em" }}>
          <span className={styles.highlight} style={{ color: "#4CAF50", fontSize: "0.5em", fontWeight: "bold" }}>
            PROPHECY
          </span>
          <span className={styles.regularText} style={{ color: "#FFFFFF", fontSize: "0.5em", fontWeight: "300" }}>
            JIMPSONS
          </span>
        </h1>

        <h2 className={styles.subtitle} style={{ textAlign: "center", marginBottom: "1em", color: "#00BFFF", fontSize: "1.5em" }}>
          Where Memes <span className={styles.highlight} style={{ fontWeight: "bold", color: "#FFD700" }}>Predict the Future</span>
        </h2>

        <p className={styles.description} style={{ textAlign: "center", lineHeight: "1.8", color: "#EAEAEA", fontSize: "1.1em" }}>
          <span style={{ fontSize: "1.6em", fontWeight: "bold", color: "#4CAF50" }}>
            Decode the Future
          </span><br />
          with <span style={{ color: "#00BFFF" }}>AI-driven predictions</span>,<br />
          immortalized as <span style={{ color: "#FFD700" }}>Solana-compressed NFTs</span>.<br /><br />
          Governed by <span style={{ color: "#00BFFF" }}>quadratic community voting</span><br />
          and fueled by <span style={{ color: "#FFD700" }}>Prophet status rewards</span>.<br /><br />
          <span style={{ fontSize: "1.3em", fontStyle: "italic", color: "#FFA500" }}>
            Your foresight becomes crypto history.
          </span>
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

          {/* Contract Address Section */}
          <div className={styles.contractContainer}>
            <span className={styles.contractLabel}>Contract Address</span>
            <div className={styles.addressWrapper}>
              <span className={styles.chainLabel}>JIMP</span>
              <span
                className={styles.address}
                onClick={copyToClipboard}
                role="button"
                tabIndex={0}
                onKeyPress={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    copyToClipboard();
                  }
                }}
              >
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

            {/* Trading Section */}
            <div className={styles.tradingContainer}>
              <span className={styles.tradingLabel}>Trading on</span>
              <div className={styles.tradingWrapper}>
                <a
                  href="https://dexscreener.com/solana/5kzotp2ziwpgyjjqk1xpsnev7htrakkckgmpjnj48qs5"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.buyLink}
                >
                  <img
                    src={DexScreener}
                    alt="dexscreener"
                    className={styles.tradingLogo}
                    width="24"
                    height="24"
                  />
                  Dex Screener
                  <svg
                    className={styles.buyIcon}
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

import { useState } from "react";
import { PublicKey } from "@solana/web3.js";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { Link } from "react-router-dom";
import {
  Wallet,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Fingerprint,
  Download,
  ArrowRight,
  Boxes,
} from "lucide-react";
import styles from "./styles/PreviewSection.module.css";

interface GeneratedNFT {
  ipfs: {
    url: string;
    cid: string;
  };
  prompt: string;
  "Image hash": string;
}

interface PreviewSectionProps {
  connected: boolean;
  generatedNFT: GeneratedNFT | null;
  isLoading: boolean;
  generationError: boolean;
  publicKey: PublicKey | null;
  verificationStatus: string | null;
  verifyNFT: (imageHash: string, walletAddress: string) => Promise<boolean>;
  downloadNFT: (url: string, prompt: string) => void;
}

const PreviewSection = ({
  connected,
  generatedNFT,
  isLoading,
  generationError,
  publicKey,
  verificationStatus,
  verifyNFT,
  downloadNFT,
}: PreviewSectionProps) => {
  const [localVerificationStatus, setLocalVerificationStatus] = useState<
    string | null
  >(null);

  const handleVerify = async () => {
    if (generatedNFT && publicKey) {
      const result = await verifyNFT(
        generatedNFT["Image hash"],
        publicKey.toString()
      );
      setLocalVerificationStatus(result ? "verified" : "not-found");
    }
  };

  const renderPreviewContent = () => {
    if (!connected) {
      return (
        <div className={styles.emptyPreview}>
          <Wallet size={64} />
          <p>Connect your wallet to start generating NFTs</p>
          <div className={styles.walletButtonWrapper}>
            <WalletMultiButton />
          </div>
        </div>
      );
    }

    if (isLoading) {
      return (
        <div className={styles.nftCard}>
          <div className={styles.imageContainer}>
            <div className={styles.skeleton}></div>
          </div>
          <div className={styles.loadingOverlay}>
            <RefreshCw className={styles.loadingIcon} size={32} />
            <p>Creating your unique NFT...</p>
          </div>
        </div>
      );
    }

    if (generationError) {
      return (
        <div className={styles.nftCard}>
          <div className={styles.errorPreview}>
            <AlertCircle size={48} className={styles.errorIcon} />
            <p>Unable to generate NFT</p>
            <p className={styles.hint}>Please try adjusting your inputs</p>
          </div>
        </div>
      );
    }

    if (generatedNFT) {
      return (
        <div className={styles.nftCard}>
          <div className={styles.imageContainer}>
            <img
              src={generatedNFT.ipfs.url}
              alt={generatedNFT.prompt}
              loading="lazy"
            />
          </div>
          <div className={styles.actionButtons}>
            <button
              onClick={handleVerify}
              className={`${styles.verifyButton} ${
                verificationStatus === "verified" || localVerificationStatus === "verified"
                  ? styles.verified
                  : ""
              }`}
            >
              {verificationStatus === "verified" || localVerificationStatus === "verified" ? (
                <>
                  <CheckCircle size={20} />
                  Verified
                </>
              ) : (
                <>
                  <Fingerprint size={20} />
                  Verify NFT
                </>
              )}
            </button>
            <button
              onClick={() => downloadNFT(generatedNFT.ipfs.url, generatedNFT.prompt)}
              className={styles.downloadButton}
            >
              <Download size={20} />
              Download
            </button>
            <Link to="/nft-collection" className={styles.collectionLink}>
              View Collection
              <ArrowRight size={16} />
            </Link>
          </div>
          {(verificationStatus === "not-found" || localVerificationStatus === "not-found") && (
            <p className={styles.verificationError}>
              NFT not found or not owned by this wallet
            </p>
          )}
        </div>
      );
    }

    return (
      <div className={styles.emptyPreview}>
        <Boxes size={64} />
        <p>Your NFT preview will appear here</p>
      </div>
    );
  };

  return (
    <div className={styles.previewSection}>
      <div className={styles.cardHeader}>
        <div className={styles.titleGroup}>
          <h2 className={styles.title}>NFT Preview</h2>
        </div>
      </div>
      {renderPreviewContent()}
      <div className={styles.legalNotes}>
        <p>
          No intellectual property rights are infringed in the generation of
          these NFTs. All AI-generated content is original and unique.
        </p>
      </div>
    </div>
  );
};

export default PreviewSection;

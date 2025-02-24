import { PublicKey } from "@solana/web3.js";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { Link } from "react-router-dom";
import {
  Wallet,
  RefreshCw,
  AlertCircle,
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
  downloadNFT,
}: PreviewSectionProps) => {
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
              onClick={() =>
                downloadNFT(generatedNFT.ipfs.url, generatedNFT.prompt)
              }
              className={styles.downloadButton}
            >
              <Download size={20} />
              Download NFT
            </button>
            <Link to="/nft-collection" className={styles.collectionLink}>
              View Collection
              <ArrowRight size={20} />
            </Link>
          </div>
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
    <>
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
            these NFTs, as all AI-generated content is original and unique.
          </p>
          <p>
            <strong>Important Notice:</strong> If an NFT generates as a black
            image with only a watermark, it indicates that the content may be
            considered <em>Not Safe For Work (NSFW)</em>. Please regenerate the
            NFT in such cases.
          </p>
        </div>
      </div>
    </>
  );
};

export default PreviewSection;

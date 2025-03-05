import { CheckCircle, RefreshCw, Sparkles, Fingerprint, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import styles from "./styles/NFTDetails.module.css";

interface GeneratedNFT {
  ipfs: {
    url: string;
    cid: string;
  };
  prompt: string;
  "Image hash": string;
}

interface Metadata {
  cid: string;
  url: string;
}

interface NFTDetailsProps {
  generatedNFT: GeneratedNFT | null;
  metadata: Metadata | null;
  isGeneratingMetadata: boolean;
  isMinting: boolean;
  isMintSuccess: boolean;
}

const NFTDetails = ({
  generatedNFT,
  metadata,
  isGeneratingMetadata,
  isMinting,
  isMintSuccess
}: NFTDetailsProps) => {
  if (!generatedNFT) return null;

  return (
    <div className={styles.nftDetails}>
      <div className={styles.detailsGrid}>
        {/* Prompt Details */}
        <div className={styles.detailItem}>
          <h3>
            <Sparkles className={styles.infoIcon} size={16} />
            Prompt
          </h3>
          <p>{generatedNFT.prompt}</p>
        </div>

        {/* IPFS Hash */}
        <div className={styles.detailItem}>
          <h3>
            <Fingerprint className={styles.infoIcon} size={16} />
            IPFS Hash
          </h3>
          <p
            className={styles.hash}
            onClick={() => window.open(generatedNFT.ipfs.url, "_blank")}
          >
            {generatedNFT.ipfs.cid}
          </p>
        </div>

        {/* Metadata Generation Status */}
        {isGeneratingMetadata ? (
          <div className={styles.detailItem}>
            <h3>
              <RefreshCw
                className={`${styles.spinIcon} ${styles.infoIcon}`}
                size={16}
              />
              Generating Metadata...
            </h3>
          </div>
        ) : metadata && (
          <div className={styles.detailItem}>
            <h3>
              <Fingerprint className={styles.infoIcon} size={16} />
              Metadata URI
            </h3>
            <p
              className={styles.hash}
              onClick={() => window.open(metadata.url, "_blank")}
            >
              {metadata.cid}
            </p>
          </div>
        )}

        {/* Minting Status */}
        <div className={styles.detailItem}>
          <h3>
            {isMinting ? (
              <>
                <RefreshCw
                  className={`${styles.spinIcon} ${styles.infoIcon}`}
                  size={16}
                />
                Minting NFT...
              </>
            ) : isMintSuccess ? (
              <>
                <CheckCircle className={styles.infoIcon} size={16} />
                <div className={styles.statusGroup}>
                  <p className={styles.successText}>NFT Minted Successfully</p>
                  <Link to="/nft-collection" className={styles.collectionLink}>
                    View Collection
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </>
            ) : (
              <>
                <Sparkles className={styles.infoIcon} size={16} />
                Ready to Mint
              </>
            )}
          </h3>
        </div>
      </div>
    </div>
  );
};

export default NFTDetails;

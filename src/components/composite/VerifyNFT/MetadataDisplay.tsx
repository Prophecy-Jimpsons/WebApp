import React from "react";
import { IPFSMetadata } from "./VerifyIPFSContent";
import styles from "./MetadataDisplay.module.css";

interface MetadataDisplayProps {
  metadata: IPFSMetadata | null;
}

export const MetadataDisplay: React.FC<MetadataDisplayProps> = ({
  metadata,
}) => {
  if (!metadata) return null;

  return (
    <div className={styles.metadataContainer}>
      <h3>NFT Details</h3>
      <div className={styles.metadataContent}>
        <p>
          <span>Prompt:</span> {metadata.prompt}
        </p>
        <p>
          <span>Created:</span> {metadata.createdAt}
        </p>
        <p>
          <span>Wallet:</span> {metadata.walletAddress}
        </p>
        <a href={metadata.ipfsUrl} target="_blank" rel="noopener noreferrer">
          View on IPFS
        </a>
      </div>
    </div>
  );
};

import React, { useState } from "react";
import axios from "axios";
import { Alchemy, Network, OwnedNft } from "alchemy-sdk";
import { Loader2 } from "lucide-react";
import styles from "./NFTCollection.module.css";

interface NFTMetadata {
  name: string;
  symbol: string;
  image: string;
  description: string;
  tokenId: string;
  contract: string;
}

const NFTCollection: React.FC = () => {
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [nfts, setNfts] = useState<NFTMetadata[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNFTs = async () => {
    if (!walletAddress) {
      setError("Please enter a wallet address");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const config = {
        apiKey: "WfMFixkQJXsLe70eyg_Ev2ROL4SlZl_2",
        network: Network.ETH_MAINNET,
      };
      const alchemy = new Alchemy(config);

      const nftsForOwner = await alchemy.nft.getNftsForOwner(walletAddress);
      console.log("NFTs found:", nftsForOwner.totalCount);

      const nftMetadata: NFTMetadata[] = await Promise.all(
        nftsForOwner.ownedNfts.map(async (nft: OwnedNft) => {
          const metadata: NFTMetadata = {
            name: nft.name || "Unnamed NFT",
            symbol: nft.contract.symbol || "N/A",
            image: (nft?.image as string) || "",
            description: nft.description || "No description available",
            tokenId: nft.tokenId,
            contract: nft.contract.address,
          };

          if (!metadata.image || !metadata.description) {
            try {
              const response = await axios.get(nft.tokenUri || "");
              const additionalMetadata = response.data;
              metadata.image = metadata.image || additionalMetadata.image || "";
              metadata.description =
                metadata.description ||
                additionalMetadata.description ||
                "No description available";
            } catch (error) {
              console.error("Error fetching additional metadata:", error);
            }
          }

          if (!metadata.image || !metadata.description) {
            try {
              const response = await axios.get(nft.tokenUri || "");
              const additionalMetadata = response.data;
              metadata.image = metadata.image || additionalMetadata.image || "";
              metadata.description =
                metadata.description ||
                additionalMetadata.description ||
                "No description available";
            } catch (error) {
              console.error("Error fetching additional metadata:", error);
            }
          }

          return metadata;
        }),
      );

      setNfts(nftMetadata);
    } catch (err) {
      console.error("Error fetching NFTs:", err);
      setError("Failed to fetch NFTs. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>NFT Collection</h1>
          <div className={styles.inputWrapper}>
            <input
              type="text"
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
              placeholder="Enter Ethereum wallet address"
              className={styles.input}
            />
            <button onClick={fetchNFTs} className={styles.button}>
              Fetch NFTs
            </button>
          </div>
        </div>

        <div className={styles.content}>
          {isLoading ? (
            <div className={styles.loadingState}>
              <Loader2 size={48} className={styles.loadingIcon} />
              <p>Loading NFTs...</p>
            </div>
          ) : error ? (
            <div className={styles.errorState}>
              <p className={styles.errorMessage}>{error}</p>
            </div>
          ) : nfts.length === 0 ? (
            <p className={styles.placeholder}>No NFTs found for this address</p>
          ) : (
            <div className={styles.nftGrid}>
              {nfts.map((nft, index) => (
                <div key={index} className={styles.nftCard}>
                  {nft.image && (
                    <img
                      src={nft.image}
                      alt={nft.name}
                      className={styles.nftImage}
                    />
                  )}
                  <div className={styles.nftInfo}>
                    <h3 className={styles.nftName}>{nft.name}</h3>
                    <p className={styles.nftSymbol}>Symbol: {nft.symbol}</p>
                    <p className={styles.nftDescription}>{nft.description}</p>
                    <p className={styles.nftContract}>
                      Contract: {nft.contract}
                    </p>
                    <p className={styles.nftTokenId}>Token ID: {nft.tokenId}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NFTCollection;

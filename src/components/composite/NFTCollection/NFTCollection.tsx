import React, { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import styles from "./NFTCollection.module.css";

interface NFTMetadata {
  NFTAddress: string;
  OwnerAddress: string;
  name?: string;
  image?: string;
}

const HELIUS_API_KEY = import.meta.env.VITE_HELIUS_API;
const NFTCollection: React.FC = () => {
  const [walletAddress, setWalletAddress] = useState("");
  const [nfts, setNfts] = useState<NFTMetadata[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNFTs = async (address: string) => {
    if (!address) {
      setError("No wallet address available");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://devnet.helius-rpc.com/?api-key=${HELIUS_API_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            jsonrpc: "2.0",
            id: "my-id",
            method: "getAssetsByOwner",
            params: {
              ownerAddress: address,
              page: 1,
              limit: 9,
            },
          }),
        },
      );

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      console.log(data);

      if (!data.result?.items) {
        throw new Error("Invalid response format");
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const nftMetadata = data.result.items.map((item: any) => ({
        NFTAddress: item.id,
        OwnerAddress: item.ownership.owner,
        name: item.content?.metadata?.name,
        image: item.content?.files?.[0]?.uri,
      }));

      setNfts(nftMetadata);
    } catch (err) {
      console.error("Error fetching NFTs:", err);
      setError("Failed to fetch NFTs. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const getConnectedWallet = async () => {
      try {
        if (window.solana && window.solana.isPhantom) {
          const response = await window.solana.connect({ onlyIfTrusted: true });
          const address = response.publicKey.toString();
          setWalletAddress(address);
          fetchNFTs(address);
        }
      } catch (error) {
        console.error("Error connecting to wallet:", error);
      }
    };

    getConnectedWallet();
  }, []);

  const handleManualFetch = () => {
    fetchNFTs(walletAddress);
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
              placeholder="Enter Wallet Address"
              className={styles.input}
            />
            <button
              onClick={handleManualFetch}
              className={styles.button}
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : "Fetch NFTs"}
            </button>
          </div>
        </div>

        <div className={styles.content}>
          {isLoading ? (
            <div className={styles.loadingState}>
              <Loader2 className={styles.loadingIcon} />
              <p>Loading NFTs...</p>
            </div>
          ) : error ? (
            <div className={styles.errorState}>
              <p className={styles.errorMessage}>{error}</p>
            </div>
          ) : nfts.length === 0 ? (
            <p className={styles.placeholder}>No NFTs found for this wallet</p>
          ) : (
            <div className={styles.nftGrid}>
              {nfts.map((nft, index) => (
                <div key={index} className={styles.nftCard}>
                  {nft.image && (
                    <img
                      src={nft.image}
                      alt={nft.name || "NFT"}
                      className={styles.nftImage}
                    />
                  )}
                  <div className={styles.nftInfo}>
                    <h3 className={styles.nftName}>
                      {nft.name || "Unnamed NFT"}
                    </h3>
                    <p className={styles.nftAddress}>
                      NFT Address: {nft.NFTAddress}
                    </p>
                    <p className={styles.nftOwner}>Owner: {nft.OwnerAddress}</p>
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

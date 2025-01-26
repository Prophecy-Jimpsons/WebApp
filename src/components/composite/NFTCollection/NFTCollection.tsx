import React, { useState, useEffect, useCallback } from "react";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import styles from "./NFTCollection.module.css";

interface NFTMetadata {
  NFTAddress: string;
  OwnerAddress: string;
  name?: string;
  image?: string;
  network: "mainnet" | "devnet";
  verified?: boolean;
  prompt?: string;
  ipfsHash?: string;
}

interface HeliusItem {
  id: string;
  ownership: {
    owner: string;
  };
  content?: {
    metadata?: {
      name?: string;
      description?: string;
    };
    files?: Array<{
      uri?: string;
    }>;
    links?: {
      image?: string;
    };
  };
}

const HELIUS_API_KEY =
  process.env.VITE_HELIUS_API || import.meta.env.VITE_HELIUS_API;

const NFTCollection: React.FC = () => {
  const [nfts, setNfts] = useState<NFTMetadata[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const verifyNFT = async (nft: NFTMetadata): Promise<NFTMetadata> => {
    try {
      if (!nft.image?.includes("myfilebase.com")) {
        return { ...nft, verified: false };
      }

      const ipfsHash = nft.image.split("/ipfs/")?.[1];
      if (!ipfsHash) return { ...nft, verified: false };

      const response = await fetch(
        `https://ipfs.filebase.io/ipfs/${ipfsHash}`,
        {
          method: "HEAD",
          mode: "no-cors",
        },
      );

      return {
        ...nft,
        verified: !!response,
        ipfsHash,
      };
    } catch (error) {
      console.error("Verification failed:", error);
      return { ...nft, verified: false };
    }
  };

  const fetchNFTsFromNetwork = async (
    address: string,
    network: "mainnet" | "devnet",
  ) => {
    try {
      const response = await fetch(
        `https://${network}.helius-rpc.com/?api-key=${HELIUS_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            jsonrpc: "2.0",
            id: "my-id",
            method: "getAssetsByOwner",
            params: {
              ownerAddress: address,
              page: 1,
              limit: 50,
            },
          }),
        },
      );

      if (!response.ok) throw new Error(`API error: ${response.status}`);
      const data = await response.json();
      if (!data.result?.items) return [];

      const verifiedNFTs = await Promise.all(
        (data.result.items as HeliusItem[]).map(async (item) => {
          const baseNFT = {
            NFTAddress: item.id,
            OwnerAddress: item.ownership.owner,
            name: item.content?.metadata?.name,
            image: item.content?.files?.[0]?.uri || item.content?.links?.image,
            network,
            verified: false,
          };
          return await verifyNFT(baseNFT);
        }),
      );

      return verifiedNFTs;
    } catch (err) {
      console.error(`Error fetching NFTs from ${network}:`, err);
      return [];
    }
  };

  const fetchAllNFTs = useCallback(async (address: string) => {
    if (!address) return;
    setIsLoading(true);
    setError(null);

    try {
      const [mainnetNFTs, devnetNFTs] = await Promise.all([
        fetchNFTsFromNetwork(address, "mainnet"),
        fetchNFTsFromNetwork(address, "devnet"),
      ]);

      const allNFTs = [...mainnetNFTs, ...devnetNFTs];
      setNfts(allNFTs);

      if (allNFTs.length === 0) {
        setError("No NFTs found in your wallet");
      }
    } catch (err) {
      console.error("Error fetching NFTs:", err);
      setError("Failed to fetch NFTs. Please try again later.");
    } finally {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const getConnectedWallet = async () => {
      try {
        if (window.solana?.isPhantom) {
          const response = await window.solana.connect({ onlyIfTrusted: true });
          const address = response.publicKey.toString();
          fetchAllNFTs(address);
        }
      } catch (error) {
        console.error("Error connecting to wallet:", error);
        setError("Please connect your wallet to view NFTs");
      }
    };

    getConnectedWallet();
  }, [fetchAllNFTs]);

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>Your NFT Collection</h1>
        </div>

        <div className={styles.content}>
          {isLoading ? (
            <div className={styles.loadingState}>
              <Loader2 className={styles.loadingIcon} />
              <p>Loading your NFTs...</p>
            </div>
          ) : error ? (
            <div className={styles.errorState}>
              <p className={styles.errorMessage}>{error}</p>
            </div>
          ) : (
            <div className={styles.nftGrid}>
              {nfts.map((nft) => (
                <div
                  key={`${nft.NFTAddress}-${nft.network}`}
                  className={styles.nftCard}
                >
                  <div className={styles.badges}>
                    <span
                      className={`${styles.networkBadge} ${styles[nft.network]}`}
                    >
                      {nft.network}
                    </span>
                    <span
                      className={`${styles.verificationBadge} ${nft.verified ? styles.verified : styles.unverified}`}
                    >
                      {nft.verified ? (
                        <>
                          <CheckCircle size={12} /> <span>Verified</span>
                        </>
                      ) : (
                        <>
                          <XCircle size={12} /> <span>Unverified</span>
                        </>
                      )}
                    </span>
                  </div>
                  {nft.image && (
                    <img
                      src={nft.image}
                      alt={nft.name || "NFT"}
                      className={styles.nftImage}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "/placeholder-nft.png";
                      }}
                    />
                  )}
                  <div className={styles.nftInfo}>
                    <h3 className={styles.nftName}>
                      {nft.name || "Unnamed NFT"}
                    </h3>
                    {nft.prompt && (
                      <p className={styles.nftPrompt}>Prompt: {nft.prompt}</p>
                    )}
                    <p className={styles.nftAddress}>
                      NFT: {nft.NFTAddress.slice(0, 6)}...
                      {nft.NFTAddress.slice(-4)}
                    </p>
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

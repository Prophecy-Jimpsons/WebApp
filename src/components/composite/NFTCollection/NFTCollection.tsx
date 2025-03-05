import React, { useState, useEffect } from "react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import {
  NFTVerificationService,
  NFTMetadata,
  VerificationResult,
} from "./NFTVerification";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/config/firebase";
import styles from "./NFTCollection.module.css";

interface HeliusResponse {
  result?: {
    items: Array<{
      id: string;
      ownership: { owner: string };
      content?: {
        json_uri?: string;
        metadata?: { name?: string; description?: string };
      };
    }>;
  };
  error?: { code: number; message: string };
}

const NFTCollection: React.FC = () => {
  const [nfts, setNfts] = useState<NFTMetadata[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // @ts-ignore
  const [verificationResults, setVerificationResults] = useState<
    Record<string, VerificationResult>
  >({});
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  useEffect(() => {
    async function checkFirestore() {
      if (!walletAddress) return;

      try {
        const nftsRef = collection(db, "nfts");
        const q = query(nftsRef, where("ownerAddress", "==", walletAddress));
        // @ts-ignore
        const snapshot = await getDocs(q);
      } catch (err) {
        console.error("Error checking Firestore:", err);
      }
    }

    if (walletAddress) {
      checkFirestore();
    }
  }, [walletAddress]);

  const fetchNFTsFromNetwork = async (
    address: string,
    network: "mainnet" | "devnet",
  ) => {
    try {
      const response = await fetch(
        `https://${network}.helius-rpc.com/v0/rpc?api-key=70eef812-8d6b-496f-bc30-1725d5acb800`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            jsonrpc: "2.0",
            id: "my-id",
            method: "getAssetsByOwner",
            params: { ownerAddress: address, page: 1, limit: 50 },
          }),
        },
      );

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      const data: HeliusResponse = await response.json();
      if (data.error) throw new Error(`API error: ${data.error.message}`);

      return data.result?.items || [];
    } catch (error) {
      console.error(`Error fetching NFTs from ${network}:`, error);
      return [];
    }
  };

  const extractImageUrl = async (item: any): Promise<string> => {
    let imageUrl = "/placeholder-nft.png";

    if (item.content?.json_uri) {
      try {
        const response = await fetch(item.content.json_uri);
        const metadata = await response.json();
        if (metadata.image) {
          imageUrl = metadata.image.startsWith("ipfs://")
            ? `https://cloudflare-ipfs.com/ipfs/${metadata.image.substring(7)}`
            : metadata.image;
        }
      } catch (error) {
        console.error("Failed to fetch image from json_uri:", error);
      }
    }

    return imageUrl;
  };

  const fetchAllNFTs = async (address: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const [mainnetItems, devnetItems] = await Promise.all([
        fetchNFTsFromNetwork(address, "mainnet"),
        fetchNFTsFromNetwork(address, "devnet"),
      ]);

      const allNFTs: NFTMetadata[] = await Promise.all(
        [...mainnetItems, ...devnetItems].map(async (item) => {
          const imageUrl = await extractImageUrl(item);
          return {
            NFTAddress: item.id,
            OwnerAddress: item.ownership.owner,
            name: item.content?.metadata?.name || "Unnamed NFT",
            image: imageUrl || "/placeholder-nft.png",
            network: item.ownership.owner.includes("mainnet")
              ? "mainnet"
              : ("devnet" as "mainnet" | "devnet"),
          };
        }),
      );

      if (allNFTs.length === 0) {
        setError("No NFTs found in this wallet address");
      } else {
        setNfts(allNFTs);
      }
    } catch (err) {
      console.error("Error in fetchAllNFTs:", err);
      setError(
        `Failed to fetch NFTs: ${err instanceof Error ? err.message : String(err)}`,
      );
    } finally {
      setIsLoading(false);
    }
  };

  // @ts-ignore
  const verifyNFTs = async (nftsToVerify: NFTMetadata[]) => {
    const results: Record<string, VerificationResult> = {};

    for (const nft of nftsToVerify) {
      const result = await NFTVerificationService.verifyNFT(nft);
      results[nft.NFTAddress] = result;
    }
    setVerificationResults(results);
  };

  const connectWallet = async (onlyIfTrusted = true) => {
    try {
      if (!window.solana?.isPhantom)
        throw new Error("Phantom wallet not detected");

      const response = await window.solana.connect({ onlyIfTrusted });
      setWalletConnected(true);
      setWalletAddress(response.publicKey.toString());
      await fetchAllNFTs(response.publicKey.toString());
    } catch (error) {
      console.error("Wallet connection failed:", error);
      setError(error instanceof Error ? error.message : String(error));
      setWalletConnected(false);
    }
  };

  useEffect(() => {
    connectWallet(true);
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>Your NFT Collection</h1>
          {!walletConnected ? (
            <WalletMultiButton />
          ) : (
            <p className={styles.walletAddress}>Connected: {walletAddress}</p>
          )}
        </div>

        {isLoading ? (
          <p className={styles.loadingState}>Loading NFTs...</p>
        ) : error ? (
          <p className={styles.errorMessage}>{error}</p>
        ) : (
          <div className={styles.nftGrid}>
            {nfts.map((nft) => (
              <div key={nft.NFTAddress} className={styles.nftCard}>
                <img
                  src={nft.image}
                  alt={nft.name}
                  className={styles.nftImage}
                  loading="lazy"
                  onError={(e) =>
                    ((e.target as HTMLImageElement).src =
                      "/placeholder-nft.png")
                  }
                />
                <h3 className={styles.nftName}>{nft.name}</h3>
                <p className={styles.nftAddress}>Owner: {nft.OwnerAddress}</p>
                <p className={styles.networkBadge}>{nft.network}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NFTCollection;

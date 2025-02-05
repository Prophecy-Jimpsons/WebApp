import React, { useState, useEffect } from "react";
import { Loader2, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import {
  NFTVerificationService,
  NFTMetadata,
  VerificationResult,
} from "./NFTVerification";
import styles from "./NFTCollection.module.css";

interface HeliusResponse {
  result?: {
    items: Array<{
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
    }>;
  };
}

const NFTCollection: React.FC = () => {
  const [nfts, setNfts] = useState<NFTMetadata[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [verificationResults, setVerificationResults] = useState<
    Record<string, VerificationResult>
  >({});

  const VITE_HELIUS_API = window.env.HELIUS_API;

  if (!VITE_HELIUS_API) {
    throw new Error("HELIUS_API environment variable is missing");
  }

  const fetchNFTsFromNetwork = async (
    address: string,
    network: "mainnet" | "devnet",
  ) => {
    const response = await fetch(
      `https://${network}.helius-rpc.com/?api-key=70eef812-8d6b-496f-bc30-1725d5acb800`,
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

    const data: HeliusResponse = await response.json();
    return data.result?.items || [];
  };

  const verifyNFTs = async (nftsToVerify: NFTMetadata[]) => {
    const results: Record<string, VerificationResult> = {};

    for (const nft of nftsToVerify) {
      const result = await NFTVerificationService.verifyNFT(nft);
      results[nft.NFTAddress] = result;
    }

    setVerificationResults(results);
  };

  const fetchAllNFTs = async (address: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const [mainnetItems, devnetItems] = await Promise.all([
        fetchNFTsFromNetwork(address, "mainnet"),
        fetchNFTsFromNetwork(address, "devnet"),
      ]);

      const allNFTs: NFTMetadata[] = [
        ...mainnetItems.map((item) => ({
          NFTAddress: item.id,
          OwnerAddress: item.ownership.owner,
          name: item.content?.metadata?.name,
          image: item.content?.files?.[0]?.uri || item.content?.links?.image,
          network: "mainnet" as const,
        })),
        ...devnetItems.map((item) => ({
          NFTAddress: item.id,
          OwnerAddress: item.ownership.owner,
          name: item.content?.metadata?.name,
          image: item.content?.files?.[0]?.uri || item.content?.links?.image,
          network: "devnet" as const,
        })),
      ];

      setNfts(allNFTs);
      await verifyNFTs(allNFTs);
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
        if (window.solana?.isPhantom) {
          const response = await window.solana.connect({ onlyIfTrusted: true });
          await fetchAllNFTs(response.publicKey.toString());
        }
      } catch (error) {
        console.error("Error connecting to wallet:", error);
        setError("Please connect your wallet to view NFTs");
      }
    };

    getConnectedWallet();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderVerificationStatus = (nft: NFTMetadata) => {
    const result = verificationResults[nft.NFTAddress];

    if (!result) {
      return (
        <span className={styles.verificationPending}>
          <Loader2 size={12} className={styles.spinningIcon} />
          <span>Verifying...</span>
        </span>
      );
    }

    return (
      <span
        className={`${styles.verificationBadge} ${result.isVerified ? styles.verified : styles.unverified}`}
      >
        {result.isVerified ? (
          <>
            <CheckCircle size={12} />
            <span>Verified</span>
          </>
        ) : (
          <>
            <XCircle size={12} />
            <span>Unverified</span>
          </>
        )}
      </span>
    );
  };

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
              <AlertCircle size={24} />
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
                    {renderVerificationStatus(nft)}
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
                    {verificationResults[nft.NFTAddress]?.details
                      ?.mintSignature && (
                      <p className={styles.mintSignature}>
                        Mint:{" "}
                        {verificationResults[
                          nft.NFTAddress
                        ]?.details?.mintSignature?.slice(0, 6)}
                        ...
                      </p>
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

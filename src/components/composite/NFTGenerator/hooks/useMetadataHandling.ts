import { useState, useCallback, useEffect } from "react";
import { PublicKey } from "@solana/web3.js";
import {
  doc,
  setDoc,
  query,
  where,
  getDocs,
  collection,
} from "firebase/firestore";
import { db } from "@/config/firebase";
import { useNFTGeneration } from "@/hooks/useNFTGeneration";
import { useMintNFT } from "@/hooks/useMintNFT";
import type { MetadataResponse, Metadata } from "../types";

const useMetadataHandling = (publicKey: PublicKey | null) => {
  const [metadata, setMetadata] = useState<Metadata | null>(null);
  const [isMintSuccess, setIsMintSuccess] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<string | null>(
    null,
  );
  const [isGeneratingMetadata, setIsGeneratingMetadata] = useState(false);

  const { generatedNFT, nftGenerate, isLoading, generationError } =
    useNFTGeneration();
  const { mintNFT, isLoading: isMinting } = useMintNFT();

  const storeNFTData = useCallback(
    async (metadataResponse: MetadataResponse) => {
      if (!publicKey) {
        console.error("❌ Firestore Error: Wallet address is missing.");
        return;
      }
      if (!generatedNFT) {
        console.error("❌ Firestore Error: No NFT data available.");
        return;
      }

      if (!metadataResponse.metadata_uri?.cid) {
        console.error(
          "❌ Firestore Error: CID is missing from metadata!",
          metadataResponse,
        );
        return;
      }

      console.log(
        "🔥 Storing NFT in Firestore with CID:",
        metadataResponse.metadata_uri.cid,
      );

      try {
        const nftData = {
          name: generatedNFT.prompt ?? "Unknown NFT",
          symbol: "PREDICT",
          description: "AI-generated prediction NFT",
          imageUrl: generatedNFT.ipfs.url ?? "",
          imageHash: generatedNFT["Image hash"] ?? "",
          walletAddress: publicKey.toString(),
          metadata_uri: metadataResponse.metadata_uri,
          createdAt: new Date().toISOString(),
        };

        await setDoc(doc(db, "nfts", generatedNFT["Image hash"]), nftData);

        console.log(
          "✅ NFT stored successfully in Firestore with CID:",
          metadataResponse.metadata_uri.cid,
        );
      } catch (error) {
        console.error("❌ Firestore storage error:", error);
      }
    },
    [publicKey, generatedNFT],
  );

  const generateMetadata = useCallback(async () => {
    if (!generatedNFT || !publicKey) return;

    setIsGeneratingMetadata(true);
    try {
      const response = await fetch(
        `https://173.34.178.13:8000/generate-metadata`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: generatedNFT.prompt,
            symbol: "PREDICT",
            description: "AI-generated prediction NFT",
            ipfs_url: generatedNFT.ipfs.url,
            wallet_address: publicKey.toString(),
          }),
        },
      );

      if (!response.ok) throw new Error("Metadata generation failed");

      const data: MetadataResponse = await response.json();
      console.log("🔥 Metadata API Response:", data);

      if (!data.metadata_uri?.cid) {
        throw new Error("CID is missing from metadata response");
      }

      const formattedMetadata: Metadata = {
        cid: data.metadata_uri.cid,
        url: data.metadata_uri.url,
        name: generatedNFT.prompt,
        symbol: "PREDICT",
        description: "AI-generated prediction NFT",
        metadata_uri: data.metadata_uri,
      };

      setMetadata(formattedMetadata);
      await storeNFTData(data);
    } catch (error) {
      console.error("❌ Metadata error:", error);
    } finally {
      setIsGeneratingMetadata(false);
    }
  }, [generatedNFT, publicKey, storeNFTData]);

  const verifyNFT = useCallback(
    async (imageHash: string, walletAddress: string) => {
      try {
        const q = query(
          collection(db, "nfts"),
          where("imageHash", "==", imageHash),
          where("walletAddress", "==", walletAddress),
        );

        const querySnapshot = await getDocs(q);
        const isValid = !querySnapshot.empty;
        setVerificationStatus(isValid ? "verified" : "not-found");
        return isValid;
      } catch (error) {
        console.error("Verification error:", error);
        setVerificationStatus("verification-error");
        return false;
      }
    },
    [],
  );

  const downloadNFT = useCallback(async (url: string, prompt: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `${prompt.trim().replace(/\s+/g, "_")}_nft.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error("Download error:", error);
    }
  }, []);

  // Auto-generate metadata when NFT is generated
  useEffect(() => {
    if (generatedNFT && !metadata) {
      generateMetadata();
    }
  }, [generatedNFT, metadata, generateMetadata]);

  // Auto-mint when metadata is ready
  useEffect(() => {
    const handleMint = async () => {
      if (metadata && publicKey && generatedNFT) {
        try {
          const mintSignature = await mintNFT({
            name: metadata.name || "",
            symbol: metadata.symbol || "PREDICT",
            uri: metadata.url,
          });

          if (mintSignature) {
            await setDoc(
              doc(db, "nfts", generatedNFT["Image hash"]),
              {
                mintSignature,
                mintAddress: publicKey.toString(),
              },
              { merge: true },
            );

            setIsMintSuccess(true);
          }
        } catch (error) {
          console.error("Minting error:", error);
          setIsMintSuccess(false);
        }
      }
    };

    handleMint();
  }, [metadata, publicKey, mintNFT, generatedNFT]);

  return {
    generatedNFT,
    metadata,
    isGeneratingMetadata: isGeneratingMetadata || isLoading,
    isMinting,
    isMintSuccess,
    generationError,
    verificationStatus,
    nftGenerate,
    storeNFTData,
    verifyNFT,
    downloadNFT,
  };
};

export default useMetadataHandling;

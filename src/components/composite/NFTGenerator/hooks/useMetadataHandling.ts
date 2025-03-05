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

// Maximum length for NFT name allowed by the Solana program
const MAX_NFT_NAME_LENGTH = 32;

const useMetadataHandling = (publicKey: PublicKey | null) => {
  const [metadata, setMetadata] = useState<Metadata | null>(null);
  const [isMintSuccess, setIsMintSuccess] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<string | null>(
    null,
  );
  const [isGeneratingMetadata, setIsGeneratingMetadata] = useState(false);
  const [mintingAttempted, setMintingAttempted] = useState(false);

  const { generatedNFT, nftGenerate, isLoading, generationError } =
    useNFTGeneration();
  const { mintNFT, isLoading: isMinting } = useMintNFT();

  const checkForExistingMint = useCallback(
    async (imageHash: string): Promise<boolean> => {
      if (!imageHash) return false;

      try {
        const nftsRef = collection(db, "nfts");
        const q = query(
          nftsRef,
          where("imageHash", "==", imageHash),
          where("mintSignature", "!=", null),
        );

        const querySnapshot = await getDocs(q);
        const exists = !querySnapshot.empty;

        if (exists) {
          console.log("NFT already minted:", querySnapshot.docs[0].data());
        }

        return exists;
      } catch (error) {
        return false;
      }
    },
    [],
  );

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

      try {
        const nftData = {
          name: generatedNFT.prompt ?? "Unknown NFT",
          symbol: "PREDICT",
          description: "AI-generated prediction NFT",
          imageUrl: generatedNFT.ipfs.url ?? "",
          imageHash: generatedNFT["Image hash"] ?? "",
          walletAddress: publicKey.toString(),
          ipfsCid: metadataResponse.metadata_uri.cid, // Ensure consistent field naming
          metadata_uri: metadataResponse.metadata_uri,
          createdAt: new Date().toISOString(),
          mintingAttempted: false, // Track if we've attempted to mint
        };

        await setDoc(doc(db, "nfts", generatedNFT["Image hash"]), nftData);
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
      if (!metadata || !publicKey || !generatedNFT) return;

      // Track that we've attempted minting to prevent duplicate attempts
      setMintingAttempted(true);

      try {
        // First check if this NFT has already been minted
        const alreadyMinted = await checkForExistingMint(
          generatedNFT["Image hash"],
        );

        if (alreadyMinted) {
          setIsMintSuccess(true);
          return;
        }

        // Mark that we're attempting to mint this NFT
        await setDoc(
          doc(db, "nfts", generatedNFT["Image hash"]),
          { mintingAttempted: true },
          { merge: true },
        );

        // Truncate name to fit Solana program limits
        const originalName = metadata.name || "";
        const truncatedName =
          originalName.length > MAX_NFT_NAME_LENGTH
            ? originalName.substring(0, MAX_NFT_NAME_LENGTH)
            : originalName;

        // console.log(
        //   `Minting NFT with name: "${truncatedName}" (${truncatedName.length} chars)`,
        // );

        const mintResult = await mintNFT({
          name: truncatedName,
          symbol: metadata.symbol || "PREDICT",
          uri: metadata.url,
        });

        if (mintResult.success && mintResult.signature) {
          console.log("NFT minted successfully:", mintResult);

          await setDoc(
            doc(db, "nfts", generatedNFT["Image hash"]),
            {
              mintSignature: mintResult.signature,
              mintAddress: mintResult.leafOwner || publicKey.toString(),
              nftAddress: mintResult.leafOwner || publicKey.toString(),
              mintingAttempted: true,
              mintingCompleted: true,
              mintedAt: new Date().toISOString(),
            },
            { merge: true },
          );

          setIsMintSuccess(true);
        } else {
          console.error(
            "Mint returned success=false or no signature:",
            mintResult,
          );

          // Update the record to show mint attempt failed
          await setDoc(
            doc(db, "nfts", generatedNFT["Image hash"]),
            {
              mintError: mintResult.error || "Unknown minting error",
              mintingAttempted: true,
              mintingCompleted: false,
            },
            { merge: true },
          );

          setIsMintSuccess(false);
        }
      } catch (error) {
        console.error("Minting error:", error);

        // Record the error
        if (generatedNFT) {
          await setDoc(
            doc(db, "nfts", generatedNFT["Image hash"]),
            {
              mintError:
                error instanceof Error ? error.message : "Unknown error",
              mintingAttempted: true,
              mintingCompleted: false,
            },
            { merge: true },
          );
        }

        setIsMintSuccess(false);
      }
    };

    // Only attempt minting if:
    // 1. We have metadata
    // 2. We're not already minting
    // 3. We haven't successfully minted yet
    // 4. We haven't already attempted minting
    if (metadata && !isMinting && !isMintSuccess && !mintingAttempted) {
      handleMint();
    }
  }, [
    metadata,
    publicKey,
    mintNFT,
    generatedNFT,
    isMintSuccess,
    isMinting,
    mintingAttempted,
    checkForExistingMint,
  ]);

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

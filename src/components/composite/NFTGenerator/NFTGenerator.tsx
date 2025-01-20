import { useState, ChangeEvent, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import styles from "./NFTGenerator.module.css";
import "@solana/wallet-adapter-react-ui/styles.css";
import { useNFTGeneration } from "@/hooks/useNFTGeneration";
import { db } from "@/config/firebase";
import VerifyNFT from "../VerifyNFT/VerifyNFT";
import { Link } from "react-router-dom";

import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  getDocs,
} from "firebase/firestore";

import {
  Boxes,
  Sparkles,
  Code2,
  Fingerprint,
  AlertCircle,
  RefreshCw,
  Wallet,
  Download,
  CheckCircle,
  ArrowRight,
} from "lucide-react";

const NFTGenerator = () => {
  const { connected, publicKey } = useWallet();
  const [prompt, setPrompt] = useState("");
  const [inputError, setInputError] = useState("");
  const [touched, setTouched] = useState(false);
  const [hasAttempted, setHasAttempted] = useState(false);
  const [storeError, setStoreError] = useState<string | null>(null);
  const [verificationStatus, setVerificationStatus] = useState<string | null>(
    null,
  );

  const {
    generatedNFT,
    nftGenerate,
    isLoading,
    generationError,
    resetGeneration,
  } = useNFTGeneration();

  const storeNFTData = async (imageHash: string, walletAddress: string) => {
    try {
      const nftCollection = collection(db, "nfts");
      const docRef = await addDoc(nftCollection, {
        imageHash,
        walletAddress,
        prompt: generatedNFT?.prompt,
        ipfsCid: generatedNFT?.ipfs.cid,
        ipfsUrl: generatedNFT?.ipfs.url,
        createdAt: serverTimestamp(),
      });

      console.log("NFT data stored successfully with ID:", docRef.id);
      setStoreError(null);
    } catch (error) {
      console.error("Error storing NFT data:", error);
      setStoreError("Failed to store NFT data");
    }
  };

  // Effect to handle NFT generation response
  useEffect(() => {
    if (generatedNFT && publicKey) {
      // Store data when NFT is generated and wallet is connected
      storeNFTData(generatedNFT["Image hash"], publicKey.toString());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [generatedNFT, publicKey]);

  const verifyNFT = async (imageHash: string, walletAddress: string) => {
    try {
      const nftsRef = collection(db, "nfts");
      const q = query(
        nftsRef,
        where("imageHash", "==", imageHash),
        where("walletAddress", "==", walletAddress),
      );

      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        setVerificationStatus("verified");
        console.log("NFT verified successfully!");
        return true;
      } else {
        setVerificationStatus("not-found");
        console.log("NFT not found or not owned by this wallet");
        return false;
      }
    } catch (error) {
      console.error("Error verifying NFT:", error);
      setVerificationStatus("error");
      return false;
    }
  };

  const downloadNFT = async (url: string, prompt: string) => {
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
      console.error("Error downloading NFT:", error);
      setStoreError("Failed to download NFT");
    }
  };

  const validatePrompt = (value: string): string => {
    if (!value.trim()) return "Prompt cannot be empty";
    const textOnlyPattern = /^[a-zA-Z0-9\s.,!?'"()-]+$/;
    const isValid = textOnlyPattern.test(value);
    if (!isValid)
      return "Prompt can only contain letters, numbers, and basic punctuation";
    if (value.length < 3) return "Prompt must be at least 3 characters";
    if (value.length > 500) return "Prompt must be less than 500 characters";
    return "";
  };

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const newPrompt = e.target.value;
    setPrompt(newPrompt);
    if (touched) {
      setInputError(validatePrompt(newPrompt));
    }
    if (generationError) {
      resetGeneration();
    }
  };

  const handleBlur = () => {
    setTouched(true);
    setInputError(validatePrompt(prompt));
  };

  const handleSubmit = (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!connected) return;

    const error = validatePrompt(prompt);
    if (error) {
      setInputError(error);
      setTouched(true);
      return;
    }

    setHasAttempted(true);
    nftGenerate(prompt);
  };

  const getButtonContent = () => {
    if (!connected) {
      return (
        <>
          <Wallet className={styles.buttonIcon} size={20} />
          Connect Wallet to Generate
        </>
      );
    }

    if (isLoading) {
      return (
        <>
          <RefreshCw className={styles.spinIcon} size={20} />
          Generating...
        </>
      );
    }

    if (generationError) {
      return (
        <>
          <Sparkles className={styles.buttonIcon} size={20} />
          Generate Again
        </>
      );
    }

    if (generatedNFT) {
      return (
        <>
          <Sparkles className={styles.buttonIcon} size={20} />
          Generate New NFT
        </>
      );
    }

    return (
      <>
        <Sparkles className={styles.buttonIcon} size={20} />
        Generate NFT
      </>
    );
  };

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
            <p className={styles.hint}>Please try adjusting your prompt</p>
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
                publicKey &&
                verifyNFT(generatedNFT["Image hash"], publicKey.toString())
              }
              className={`${styles.verifyButton} ${verificationStatus === "verified" ? styles.verified : ""}`}
            >
              {verificationStatus === "verified" ? (
                <>
                  <CheckCircle size={20} />
                  Verified
                </>
              ) : (
                <>
                  <Fingerprint size={20} />
                  Verify NFT
                </>
              )}
            </button>
            <button
              onClick={() =>
                downloadNFT(generatedNFT.ipfs.url, generatedNFT.prompt)
              }
              className={styles.downloadButton}
            >
              <Download size={20} />
              Download
            </button>
          </div>
          {verificationStatus === "not-found" && (
            <p className={styles.verificationError}>
              NFT not found or not owned by this wallet
            </p>
          )}
        </div>
      );
    }

    return (
      <div className={styles.emptyPreview}>
        <Boxes size={64} />
        <p>Your NFT preview will appear here</p>
        {hasAttempted && (
          <p className={styles.hint}>Type your prompt and click Generate</p>
        )}
      </div>
    );
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.abstractLines}>
          <div className={styles.line}></div>
          <div className={styles.line}></div>
          <div className={styles.line}></div>
        </div>

        <div className={styles.glassCard}>
          <div className={styles.cardHeader}>
            <div className={styles.titleGroup}>
              <Sparkles className={styles.headerIcon} size={32} />
              <h2 className={styles.title}>Create Your NFT</h2>
              <Sparkles className={styles.headerIcon} size={32} />
            </div>
            <Link to="/nft-collection" className={styles.headerLink}>
              Check Your Collection
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className={styles.content}>
            <div className={styles.previewSection}>
              {renderPreviewContent()}
            </div>

            <div className={styles.inputSection}>
              <form onSubmit={handleSubmit}>
                <div className={styles.inputWrapper}>
                  <Code2 className={styles.inputIcon} size={20} />
                  <textarea
                    className={`${styles.promptInput} ${
                      inputError && touched ? styles.error : ""
                    }`}
                    value={prompt}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder={
                      connected
                        ? "Describe your NFT idea..."
                        : "Connect wallet to start creating..."
                    }
                    disabled={!connected || isLoading}
                  />
                </div>

                {inputError && touched && (
                  <div className={styles.errorMessage}>
                    <AlertCircle size={16} />
                    {inputError}
                  </div>
                )}

                {storeError && (
                  <div className={styles.errorMessage}>
                    <AlertCircle size={16} />
                    {storeError}
                  </div>
                )}

                <button
                  className={styles.generateButton}
                  type="submit"
                  disabled={
                    !connected ||
                    isLoading ||
                    (!prompt.trim() && !generationError)
                  }
                >
                  {getButtonContent()}
                </button>
              </form>

              {generationError && (
                <div
                  className={`${styles.errorMessage} ${styles.errorContainer}`}
                >
                  <AlertCircle size={16} />
                  <div className={styles.errorContent}>
                    <p>NFT generation failed. Please try again.</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {generatedNFT && (
            <div className={styles.nftDetails}>
              <div className={styles.detailsGrid}>
                <div className={styles.detailItem}>
                  <h3>
                    <Sparkles className={styles.infoIcon} size={16} />
                    Prompt
                  </h3>
                  <p>{generatedNFT.prompt}</p>
                </div>
                <div className={styles.detailItem}>
                  <h3>
                    <Fingerprint className={styles.infoIcon} size={16} />
                    IPFS Hash
                  </h3>
                  <p className={styles.hash}>{generatedNFT.ipfs.cid}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="styles.container">
        <div className={styles.glassCard}>
          <VerifyNFT />

          <div className={styles.legalNotes}>
            <p>
              No intellectual property rights are infringed in the generation of
              these NFTs. All AI-generated content is original and unique.
            </p>
            <p>
              Generated images and NFTs are subject to our terms of service and
              content guidelines.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default NFTGenerator;

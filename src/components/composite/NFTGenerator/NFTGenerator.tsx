import { useState, useEffect } from "react";
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
  Fingerprint,
  AlertCircle,
  RefreshCw,
  Wallet,
  Download,
  CheckCircle,
  ArrowRight,
} from "lucide-react";
import Modal from "@/components/ui/Modal";
import AIStatusContent from "../AIStatusContent";
import { SERVER_BASE_URL } from "@/config/constants";

const NFTGenerator = () => {
  const { connected, publicKey } = useWallet();
  const [name, setName] = useState<string>("");
  const [symbol, setSymbol] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [inputError, setInputError] = useState<string>("");
  const [touched, setTouched] = useState<boolean>(false);
  const [hasAttempted, setHasAttempted] = useState<boolean>(false);
  const [verificationStatus, setVerificationStatus] = useState<string | null>(
    null,
  );
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [symbolValid, setSymbolValid] = useState<boolean>(false);
  const [nameValid, setNameValid] = useState<boolean>(false);
  const [descriptionValid, setDescriptionValid] = useState<boolean>(false);
  const [nameError, setNameError] = useState<string>("");
  const [symbolError, setSymbolError] = useState<string>("");
  const [descriptionError, setDescriptionError] = useState<string>("");
  const [metadata, setMetadata] = useState<{ cid: string; url: string } | null>(
    null,
  );
  const [isGeneratingMetadata, setIsGeneratingMetadata] = useState(false);

  const { generatedNFT, nftGenerate, isLoading, generationError } =
    useNFTGeneration();

  useEffect(() => {
    if (generationError) {
      setIsModalOpen(true);
    }
  }, [generationError]);

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
    } catch (error) {
      console.error("Error storing NFT data:", error);
    }
  };

  useEffect(() => {
    if (generatedNFT && publicKey) {
      storeNFTData(generatedNFT["Image hash"], publicKey.toString());
      generateMetadata(); // Call here
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [generatedNFT, publicKey]);

  const validateSymbol = (value: string): boolean => {
    const symbolPattern = /^[a-z0-9]{1,10}$/;
    return symbolPattern.test(value);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setName(value);
    if (!value.trim()) {
      setNameError("Prediction cannot be empty");
      setNameValid(false);
    } else {
      setNameError("");
      setNameValid(true);
    }
    setTouched(true);
  };

  const handleSymbolChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSymbol(value);
    const symbolPattern = /^[a-zA-Z0-9]{1,10}$/;
    if (!value.trim()) {
      setSymbolError("Ticker cannot be empty");
      setSymbolValid(false);
    } else if (!symbolPattern.test(value)) {
      setSymbolError("Must be 1-10 letters/numbers, no spaces");
      setSymbolValid(false);
    } else {
      setSymbolError("");
      setSymbolValid(true);
    }
    setTouched(true);
  };

  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    const value = e.target.value;
    setDescription(value);
    if (!value.trim()) {
      setDescriptionError("Description cannot be empty");
      setDescriptionValid(false);
    } else if (value.length > 200) {
      setDescriptionError("Must be less than 200 characters");
      setDescriptionValid(false);
    } else {
      setDescriptionError("");
      setDescriptionValid(true);
    }
    setTouched(true);
  };

  const validateInputs = (): string => {
    if (!name.trim()) return "Prediction cannot be empty";
    if (!symbol.trim()) return "Ticker cannot be empty";
    if (!validateSymbol(symbol))
      return "Ticker must be 1-10 lowercase letters/numbers, no spaces";
    if (!description.trim()) return "Description cannot be empty";
    if (description.length > 200)
      return "Description must be less than 200 characters";
    return "";
  };
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!connected) return;

    const error = validateInputs();
    if (error) {
      setInputError(error);
      setTouched(true);
      return;
    }

    setHasAttempted(true);
    const prompt = `${name} | ${symbol.toUpperCase()} | ${description}`;
    nftGenerate(prompt);
  };

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
        return true;
      } else {
        setVerificationStatus("not-found");
        return false;
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
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
    }
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
            <p className={styles.hint}>Please try adjusting your inputs</p>
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
          <p className={styles.hint}>Fill in the details and click Generate</p>
        )}
      </div>
    );
  };

  const generateMetadata = async () => {
    try {
      setIsGeneratingMetadata(true);
      const metadataPayload = {
        name,
        symbol: symbol.toUpperCase(),
        description,
        wallet_address: publicKey?.toString(),
        ipfs_url: generatedNFT?.ipfs.url,
      };

      const response = await fetch(`${SERVER_BASE_URL}/generate-metadata`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(metadataPayload),
      });

      const data = await response.json();
      if (data.status === "success") {
        setMetadata(data.metadata_uri);
      }
    } catch (error) {
      console.error("Error generating metadata:", error);
    } finally {
      setIsGeneratingMetadata(false);
    }
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
                <div className={styles.formGroup}>
                  <label className={styles.inputLabel}>
                    Enter Your Prediction
                  </label>
                  <input
                    type="text"
                    className={`${styles.inputField} 
      ${nameError && touched ? styles.error : ""} 
      ${nameValid && touched ? styles.valid : ""}`}
                    placeholder="Example: Bitcoin will reach $100K by Dec 2024"
                    value={name}
                    onChange={handleNameChange}
                    disabled={!connected || isLoading}
                  />
                  {nameError && touched && (
                    <div className={styles.fieldError}>
                      <AlertCircle size={12} />
                      {nameError}
                    </div>
                  )}
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.inputLabel}>
                    Prediction Ticker / Token Symbol
                  </label>
                  <input
                    type="text"
                    className={`${styles.inputField} 
      ${symbolError && touched ? styles.error : ""} 
      ${symbolValid && touched ? styles.valid : ""}`}
                    placeholder="Example: btc100k"
                    value={symbol}
                    onChange={handleSymbolChange}
                    maxLength={10}
                    disabled={!connected || isLoading}
                  />
                  {symbolError && touched && (
                    <div className={styles.fieldError}>
                      <AlertCircle size={12} />
                      {symbolError}
                    </div>
                  )}
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.inputLabel}>Brief Description</label>
                  <textarea
                    className={`${styles.descriptionField} 
      ${descriptionError && touched ? styles.error : ""} 
      ${descriptionValid && touched ? styles.valid : ""}`}
                    placeholder="Brief details about your prediction"
                    value={description}
                    onChange={handleDescriptionChange}
                    disabled={!connected || isLoading}
                  />
                  {descriptionError && touched && (
                    <div className={styles.fieldError}>
                      <AlertCircle size={12} />
                      {descriptionError}
                    </div>
                  )}
                </div>

                {inputError && touched && (
                  <div className={styles.errorMessage}>
                    <AlertCircle size={16} />
                    {inputError}
                  </div>
                )}

                <button
                  className={styles.generateButton}
                  type="submit"
                  disabled={
                    !connected ||
                    isLoading ||
                    !nameValid ||
                    !symbolValid ||
                    !descriptionValid
                  }
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className={styles.spinIcon} size={20} />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className={styles.buttonIcon} size={20} />
                      Generate NFT
                    </>
                  )}
                </button>
              </form>

              {generationError && (
                <Modal
                  isOpen={isModalOpen}
                  onClose={() => setIsModalOpen(false)}
                  title="🛠️ AI Under Maintenance: Recharging Its Witty Circuits!"
                >
                  <AIStatusContent />
                </Modal>
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
                  <p
                    className={styles.hash}
                    onClick={() => window.open(generatedNFT.ipfs.url, "_blank")}
                  >
                    {generatedNFT.ipfs.cid}
                  </p>
                </div>
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
                ) : (
                  metadata && (
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
                  )
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      <div className={styles.container_verify}>
        <div className={styles.glassCard_verify}>
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

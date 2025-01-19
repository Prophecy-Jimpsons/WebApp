import { useState, ChangeEvent } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import styles from "./NFTGenerator.module.css";
import "@solana/wallet-adapter-react-ui/styles.css";
import { useNFTGeneration } from "@/hooks/useNFTGeneration";
import {
  Boxes,
  Sparkles,
  Code2,
  Fingerprint,
  AlertCircle,
  RefreshCw,
  Wallet,
} from "lucide-react";

const NFTGenerator = () => {
  const { connected } = useWallet();
  const [prompt, setPrompt] = useState("");
  const [inputError, setInputError] = useState("");
  const [touched, setTouched] = useState(false);
  const [hasAttempted, setHasAttempted] = useState(false);

  const {
    generatedNFT,
    nftGenerate,
    isLoading,
    generationError,
    resetGeneration,
  } = useNFTGeneration();
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

  const handleNewGeneration = () => {
    setPrompt("");
    setInputError("");
    setTouched(false);
    setHasAttempted(false);
    resetGeneration();
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
          <button
            onClick={handleNewGeneration}
            className={styles.newGenerationButton}
          >
            <Sparkles size={20} />
            Create Another
          </button>
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
    <div className={styles.container}>
      <div className={styles.abstractLines}>
        <div className={styles.line}></div>
        <div className={styles.line}></div>
        <div className={styles.line}></div>
      </div>

      <div className={styles.glassCard}>
        <div className={styles.cardHeader}>
          <Sparkles className={styles.headerIcon} size={32} />
          <h2 className={styles.title}>Create Your NFT</h2>
          <Sparkles className={styles.headerIcon} size={32} />
        </div>

        <div className={styles.content}>
          <div className={styles.previewSection}>{renderPreviewContent()}</div>

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
  );
};

export default NFTGenerator;

import { useWallet } from "@solana/wallet-adapter-react";
import { useEffect, useState } from "react";
import { Wand2, Search } from "lucide-react";
import FormSection from "./FormSection";
import PreviewSection from "./PreviewSection";
import NFTDetails from "./NFTDetails";
import VerifyNFT from "../VerifyNFT/VerifyNFT";
import styles from "./styles/NFTGenerator.module.css";
import useFormHandling from "./hooks/useFormHandling";
import useMetadataHandling from "./hooks/useMetadataHandling";
import type { Metadata } from "./types";

const NFTGenerator = () => {
  const { connected, publicKey } = useWallet();
  const [activeSection, setActiveSection] = useState<"generate" | "verify">(
    "generate",
  );

  // Form handling logic
  const {
    formState,
    validationState,
    handleNameChange,
    handleSubmit,
    validateInputs,
  } = useFormHandling();

  // Metadata and NFT handling logic
  const {
    generatedNFT,
    metadata,
    isGeneratingMetadata,
    isMinting,
    isMintSuccess,
    generationError,
    verificationStatus,
    verifyNFT,
    downloadNFT,
    nftGenerate,
  } = useMetadataHandling(publicKey);

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    const prompt = handleSubmit(e);
    if (prompt) {
      nftGenerate(prompt);
    }
  };

  // Error handling effect
  useEffect(() => {
    if (generationError) {
      // Handle error state if needed
    }
  }, [generationError]);

  const renderToggleButtons = () => (
    <div className={styles.toggleButtons}>
      <button
        onClick={() => setActiveSection("generate")}
        className={`${styles.toggleButton} ${activeSection === "generate" ? styles.active : ""}`}
      >
        <Wand2 size={20} />
        Generate NFT
      </button>
      <button
        onClick={() => setActiveSection("verify")}
        className={`${styles.toggleButton} ${activeSection === "verify" ? styles.active : ""}`}
      >
        <Search size={20} />
        Verify NFT
      </button>
    </div>
  );

  return (
    <div className={styles.container}>
      {renderToggleButtons()}
      <div className={styles.glassCard}>
        {activeSection === "generate" ? (
          <>
            <PreviewSection
              connected={connected}
              generatedNFT={generatedNFT ?? null}
              isLoading={isGeneratingMetadata}
              generationError={!!generationError}
              publicKey={publicKey}
              verifyNFT={verifyNFT}
              downloadNFT={downloadNFT}
              verificationStatus={verificationStatus}
            />

            <FormSection
              formState={formState}
              validationState={validationState}
              handleNameChange={handleNameChange}
              handleSubmit={handleFormSubmit}
              validateInputs={validateInputs}
              connected={connected}
              isLoading={isGeneratingMetadata}
              generationError={!!generationError}
            />

            {generatedNFT && (
              <NFTDetails
                generatedNFT={generatedNFT}
                metadata={
                  metadata as (Metadata & { cid: string; url: string }) | null
                }
                isGeneratingMetadata={isGeneratingMetadata}
                isMinting={isMinting}
                isMintSuccess={isMintSuccess}
              />
            )}
          </>
        ) : (
          <VerifyNFT />
        )}
      </div>
    </div>
  );
};

export default NFTGenerator;

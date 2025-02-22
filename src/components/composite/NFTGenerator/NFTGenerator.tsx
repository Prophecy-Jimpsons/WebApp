import { useWallet } from "@solana/wallet-adapter-react";
import { useEffect } from "react";
import FormSection from "./FormSection";
import PreviewSection from "./PreviewSection";
import NFTDetails from "./NFTDetails";
import styles from "./styles/NFTGenerator.module.css";
import useFormHandling from "./hooks/useFormHandling";
import useMetadataHandling from "./hooks/useMetadataHandling";
import type { Metadata } from "./types";

const NFTGenerator = () => {
  const { connected, publicKey } = useWallet();
  
  // Form handling logic
    const {
      formState,
      validationState,
      handleNameChange,
      handleSymbolChange,
      handleDescriptionChange,
      handleSubmit,
      validateInputs // Add this line
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
    nftGenerate
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

  return (
    <div className={styles.container}>
      <div className={styles.glassCard}>
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
          handleSymbolChange={handleSymbolChange}
          handleDescriptionChange={handleDescriptionChange}
          handleSubmit={handleFormSubmit}  // Changed from handleSubmit
          validateInputs={validateInputs}   // Add this missing prop
          connected={connected}
          isLoading={isGeneratingMetadata}
          generationError={!!generationError}
        />


        {generatedNFT && (
          <NFTDetails
            generatedNFT={generatedNFT}
            metadata={metadata as (Metadata & { cid: string; url: string }) | null}
            isGeneratingMetadata={isGeneratingMetadata}
            isMinting={isMinting}
            isMintSuccess={isMintSuccess}
          />
        )}
      </div>
    </div>
  );
};

export default NFTGenerator;

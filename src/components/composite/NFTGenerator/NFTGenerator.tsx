import { useState, ChangeEvent } from "react";
import styles from "./NFTGenerator.module.css";

import { useNFTGeneration } from "@/hooks/useNFTGeneration";

const NFTGenerator = () => {
  const [prompt, setPrompt] = useState<string>("");

  const { mutate, isLoading, data: generatedNFT, error } = useNFTGeneration();

  const handleSubmit = (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    mutate(prompt);
  };

  console.log("Generated NFT:", generatedNFT);

  return (
    <div className={styles.container}>
      <div className={styles.glassCard}>
        <h2 className={styles.title}>Create Your NFT</h2>

        <div className={styles.content}>
          <form onSubmit={handleSubmit}>
            <div className={styles.inputSection}>
              <textarea
                className={styles.promptInput}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe your NFT idea..."
                disabled={isLoading}
              />

              <button
                className={styles.generateButton}
                type="submit"
                disabled={isLoading || !prompt.trim()}
              >
                {isLoading ? "Generating..." : "Generate NFT"}
              </button>
            </div>
          </form>

          {error ? (
            <div role="alert" className={styles.error}>
              "Generation failed. Please try again."
            </div>
          ) : null}

          {isLoading && (
            <div className={styles.previewSection}>
              <div className={styles.nftCard}>
                <div className={styles.imageContainer}>
                  <div className={styles.skeleton}></div>
                </div>
                <div className={styles.nftInfo}>
                  <div className={styles.skeletonText}></div>
                  <div className={styles.skeletonText}></div>
                  <div className={styles.skeletonText}></div>
                </div>
              </div>
            </div>
          )}

          {generatedNFT && (
            <div className={styles.previewSection}>
              <div className={styles.nftCard}>
                <div className={styles.imageContainer}>
                  {isLoading && <div className={styles.shimmer}></div>}
                  <img
                    src={generatedNFT.data.imageUrl}
                    alt={generatedNFT.data.metadata.name}
                    loading="lazy"
                  />
                </div>
                <div className={styles.nftInfo}>
                  <h3>{generatedNFT.data.metadata.name}</h3>
                  <p>
                    <b>Prompt: </b>
                    {generatedNFT.data.prompt}
                  </p>
                  <small>IPFS Hash: {generatedNFT.data.ipfsHash}</small>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NFTGenerator;

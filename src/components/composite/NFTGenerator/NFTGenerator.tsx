import { useState, ChangeEvent } from "react";
import styles from "./NFTGenerator.module.css";

import { useNFTGeneration } from "@/hooks/useNFTGeneration";

const NFTGenerator = () => {
  const [prompt, setPrompt] = useState<string>("");
  const [inputError, setInputError] = useState<string>("");
  const [touched, setTouched] = useState(false);

  const { mutate, isLoading, data: generatedNFT, error } = useNFTGeneration();

  const validatePrompt = (value: string): string => {
    if (!value.trim()) return "Prompt cannot be empty";
    // Allow letters, numbers, basic punctuation, and spaces
    const textOnlyPattern = /^[a-zA-Z0-9\s.,!?'"()-]+$/;
    const isValid = textOnlyPattern.test(value);
    if (!isValid)
      return "Prompt can only contain letters, numbers, and basic punctuation";
    if (value.length < 3) return "Prompt must be at least 3 characters";
    if (value.length > 500) return "Prompt must be less than 500 characters";
    return "";
  };

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value);
    if (touched) {
      setInputError(validatePrompt(e.target.value));
    }
  };

  const handleBlur = () => {
    setTouched(true);
    setInputError(validatePrompt(prompt));
  };

  const handleSubmit = (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    mutate(prompt);
  };

  return (
    <div className={styles.container}>
      <div className={styles.glassCard}>
        <h2 className={styles.title}>Create Your NFT</h2>

        <div className={styles.content}>
          <form onSubmit={handleSubmit}>
            <div className={styles.inputSection}>
              <textarea
                className={`${styles.promptInput} ${error && touched ? styles.error : ""}`}
                value={prompt}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Describe your NFT idea..."
                disabled={isLoading}
              />
              {error && touched && (
                <div className={styles.errorMessage}>{inputError}</div>
              )}

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
                    src={generatedNFT.ipfs.url}
                    alt={generatedNFT.prompt}
                    loading="lazy"
                  />
                </div>
                <div className={styles.nftInfo}>
                  <h3>Generated NFT</h3>
                  <p>
                    <b>Prompt: </b>
                    {generatedNFT.prompt}
                  </p>
                  <small>IPFS Hash: {generatedNFT.ipfs.cid}</small>
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

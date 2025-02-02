import { useEffect, useState } from "react";
import styles from "./BuyingSteps.module.css";
import {
  AlertCircle,
  Check,
  CheckCircle2,
  Copy,
  ExternalLink,
} from "lucide-react";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";
import steps, { prerequisites, swapUrl, tokenAddress } from "./config";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";

const BuyingSteps = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [photoIndex, setPhotoIndex] = useState<number>(0);
  const [loadedImages, setLoadedImages] = useState<{ [key: string]: boolean }>(
    {},
  );
  const { copiedMap, copyToClipboard } = useCopyToClipboard();

  // Extract image URLs from the steps
  const images = steps.map((step) => step.image);

  // Preload all images when the component mounts
  useEffect(() => {
    const preloadImages = (imageUrls: string[]) => {
      const loadImage = (url: string) => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = () => {
            setLoadedImages((prev) => ({
              ...prev,
              [url]: true,
            }));
            resolve(url);
          };
          img.onerror = reject;
          img.src = url;
        });
      };

      // Load all images in parallel
      return Promise.all(imageUrls.map((url) => loadImage(url)));
    };

    const images = steps
      .map((step) => step?.image)
      .filter((image) => image !== undefined);

    preloadImages(images).catch((error) =>
      console.error("Error preloading images:", error),
    );
  }, [images]);

  const openLightbox = (index: number) => {
    // Only open lightbox if the image is loaded
    if (loadedImages[steps[index].image!]) {
      setPhotoIndex(index);
      setIsOpen(true);
    }
  };

  const closeLightbox = () => {
    setIsOpen(false);
  };

  return (
    <section className={styles.buyingSteps}>
      <h2 className={styles.title}>How to Buy JIMP Token</h2>

      {/* Prerequisites Section */}
      <div className={styles.prerequisites}>
        <h3 className={styles.prerequisitesTitle}>
          <AlertCircle className={styles.icon} />
          Before You Begin
        </h3>
        <div className={styles.prerequisitesList}>
          {prerequisites.map((prerequisite, index) => (
            <div key={index} className={styles.prerequisiteItem}>
              <prerequisite.icon className={styles.icon} />
              <span>{prerequisite.text}</span>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.tradingLink}>
        <h3>🚀 Our $JIMP Token is now LIVE on Raydium! 🚀</h3>
      </div>

      {/* Steps Section */}
      <div className={styles.stepsWrapper}>
        {steps.map((step, index) => (
          <div
            key={index}
            className={`${styles.step} ${index % 2 === 0 ? styles.left : ""}`}
          >
            <div className={styles.contentWrapper}>
              <span className={styles.stepNumber}>STEP: {step.number}</span>

              <h3 className={styles.stepTitle}>{step.title}</h3>
              <p className={styles.stepDescription}>
                {step.number === "01" ? (
                  <>
                    <a
                      href={swapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.raydiumLink}
                    >
                      Go to Raydium
                      <ExternalLink className={styles.linkIcon} />
                    </a>
                    {step.description}
                  </>
                ) : (
                  step.description
                )}
              </p>
              {step.number === "03" && (
                <div className={styles.tokenAddress}>
                  <span>Token Address:</span>
                  <code>{tokenAddress}</code>
                  <button
                    onClick={async () =>
                      await copyToClipboard(tokenAddress, "tokenAddress")
                    }
                    className={styles.copyButton}
                  >
                    <span>
                      {copiedMap["tokenAddress"] ? (
                        <Check size={16} />
                      ) : (
                        <Copy size={16} />
                      )}
                    </span>
                  </button>
                </div>
              )}
            </div>
            {step.image && (
              <div className={styles.imageWrapper}>
                <div className={styles.imageContainer}>
                  <img
                    src={step.image}
                    alt={`Step ${step.number}`}
                    className={`${styles.stepImage} ${
                      loadedImages[step.image] ? styles.loaded : styles.loading
                    }`}
                    onClick={() => openLightbox(index)}
                  />
                  {!loadedImages[step.image] && (
                    <div className={styles.loadingOverlay}>
                      <div className={styles.loadingSpinner} />
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* completion message */}
      <div className={styles.completionContent}>
        <CheckCircle2 className={styles.completionIcon} />
        <h3>Voilà!!! 🎉</h3>
        <p>You've successfully swaped JIMP tokens! 🚀 Now, Lets keep going!</p>
      </div>

      {isOpen && loadedImages[steps[photoIndex].image!] && (
        <Lightbox
          mainSrc={steps[photoIndex].image!}
          onCloseRequest={closeLightbox}
          enableZoom={false}
        />
      )}
    </section>
  );
};

export default BuyingSteps;

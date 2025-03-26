import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";
import {
  AlertCircle,
  Check,
  CheckCircle2,
  Copy,
  ExternalLink,
  Repeat,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";
import styles from "./BuyingSteps.module.css";
import Widget from "./components/AnyaltWidget"; // Import the WidgetRef type
import {
  anyaltPrerequisites,
  anyaltSteps,
  raydiumPrerequisites,
  raydiumSteps,
  swapUrl,
  tokenAddress,
} from "./config";

// Define types for steps
interface Step {
  number: string;
  title: string;
  description: string;
  image?: string;
}

const BuyingSteps: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [photoIndex, setPhotoIndex] = useState<number>(0);
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});
  const { copiedMap, copyToClipboard } = useCopyToClipboard();
  const [buyMethod, setBuyMethod] = useState<"raydium" | "anyalt">("raydium");

  // Reference to the Widget component to access its methods
  const widgetRef = useRef<WidgetRef>(null);

  // Function to open the AnyAlt widget
  const openAnyaltWidget = (): void => {
    if (widgetRef.current) {
      widgetRef.current.openWidget();
    }
  };

  // Get the appropriate steps based on selected method
  const currentSteps: Step[] =
    buyMethod === "raydium" ? raydiumSteps : anyaltSteps;
  // buyMethod === "raydium" ? raydiumSteps : [];

  // Extract image URLs from the current steps
  // const images: string[] = currentSteps
  //   .map((step) => step.image)
  //   .filter((image): image is string => Boolean(image));

  // Preload all images when the component mounts or when buy method changes
  useEffect(() => {
    const preloadImages = (imageUrls: string[]): Promise<string[]> => {
      const loadImage = (url: string): Promise<string> => {
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

    const imagesToLoad: string[] = currentSteps
      .map((step) => step?.image)
      .filter((image): image is string => image !== undefined);

    preloadImages(imagesToLoad).catch((error) =>
      console.error("Error preloading images:", error),
    );
  }, [buyMethod, currentSteps]);

  const openLightbox = (index: number): void => {
    // Only open lightbox if the image is loaded
    if (currentSteps[index].image && loadedImages[currentSteps[index].image]) {
      setPhotoIndex(index);
      setIsOpen(true);
    }
  };

  const closeLightbox = (): void => {
    setIsOpen(false);
  };

  return (
    <section className={styles.buyingSteps}>
      <div className={styles.header}>
        <h2 className={styles.title}>How to Buy $JIMP Token</h2>
        <p className={styles.subtitle}>
          Choose your preferred method to purchase JIMP tokens. You can either
          buy directly with SOL on Raydium or use other cryptocurrencies via
          AnyAlt.
        </p>
      </div>

      {/* Method Toggle */}
      <div className={styles.methodToggle}>
        <button
          className={`${styles.methodButton} ${buyMethod === "raydium" ? styles.active : ""}`}
          onClick={() => setBuyMethod("raydium")}
        >
          {/* <img
            src="/images/solana-logo.svg"
            alt="Solana"
            className={styles.methodIcon}
          /> */}
          Buy with SOL on Raydium
        </button>
        <button
          className={`${styles.methodButton} ${buyMethod === "anyalt" ? styles.active : ""}`}
          onClick={() => setBuyMethod("anyalt")}
        >
          <Repeat className={styles.methodIcon} />
          Buy with Other Cryptocurrencies
        </button>
      </div>

      {/* Prerequisites Section */}
      <div className={styles.prerequisites}>
        <h3 className={styles.prerequisitesTitle}>
          <AlertCircle className={styles.icon} />
          Before You Begin
        </h3>
        <div className={styles.prerequisitesList}>
          {buyMethod === "raydium"
            ? raydiumPrerequisites.map((prerequisite, index) => (
                <div key={index} className={styles.prerequisiteItem}>
                  <prerequisite.icon className={styles.icon} />
                  <span>{prerequisite.text}</span>
                </div>
              ))
            : anyaltPrerequisites.map((prerequisite, index) => (
                <div key={index} className={styles.prerequisiteItem}>
                  <prerequisite.icon className={styles.icon} />
                  <span>{prerequisite.text}</span>
                </div>
              ))}
        </div>
      </div>

      {/* AnyAlt Direct Button (only shown when anyalt method is selected) */}
      {buyMethod === "anyalt" && (
        <div className={styles.anyaltButtonContainer}>
          <button onClick={openAnyaltWidget} className={styles.anyaltButton}>
            <Repeat className={styles.buttonIcon} />
            Open AnyAlt Widget Now
          </button>
          <p className={styles.anyaltDescription}>
            Click the button above to directly open the swap widget, or follow
            the step-by-step guide below.
          </p>
        </div>
      )}

      {/* Steps Section */}
      <div className={styles.stepsWrapper}>
        {currentSteps.map((step, index) => (
          <div
            key={index}
            className={`${styles.step} ${index % 2 === 0 ? styles.left : ""}`}
          >
            <div className={styles.contentWrapper}>
              <span className={styles.stepNumber}>STEP: {step.number}</span>
              <h3 className={styles.stepTitle}>{step.title}</h3>
              <p className={styles.stepDescription}>
                {buyMethod === "raydium" && step.number === "01" ? (
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
              {buyMethod === "raydium" && step.number === "03" && (
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
        <p>
          You've successfully acquired JIMP tokens! 🚀 Now, Let's keep going!
        </p>
      </div>

      {isOpen &&
        currentSteps[photoIndex].image &&
        loadedImages[currentSteps[photoIndex].image] && (
          <Lightbox
            mainSrc={currentSteps[photoIndex].image}
            onCloseRequest={closeLightbox}
            enableZoom={false}
          />
        )}

      {/* AnyAlt Widget component with ref */}
      <Widget ref={widgetRef} />
    </section>
  );
};

export default BuyingSteps;

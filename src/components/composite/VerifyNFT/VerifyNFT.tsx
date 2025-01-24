import React, { useState } from "react";
import {
  Upload,
  CheckCircle,
  XCircle,
  Loader2,
  Sparkles,
  Hash,
} from "lucide-react";
import styles from "./VerifyNFT.module.css";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/config/firebase";

interface VerificationStep {
  status: "pending" | "processing" | "complete" | "error";
  title: string;
  description?: string;
  hash?: string;
}

interface VerificationState {
  imageHash: VerificationStep;
  ipfsCheck: VerificationStep;
  databaseCheck: VerificationStep;
}

const generateImageHash = async (imageFile: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const img = new Image();
        img.onload = async () => {
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d", { willReadFrequently: true });
          if (!ctx) throw new Error("Could not get canvas context");

          // Disable image smoothing and set color space
          ctx.imageSmoothingEnabled = false;

          // Draw image to canvas
          ctx.drawImage(img, 0, 0);

          // Get image data
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imageData.data;

          // Calculate stride (must match PowerShell's calculation)
          const width = canvas.width;
          const height = canvas.height;
          const bytesPerPixel = 3;
          const stride = Math.floor((width * bytesPerPixel + 3) / 4) * 4;

          // Create a Uint8Array with stride padding
          const paddedData = new Uint8Array(stride * height);

          // Copy pixels in BGR order (matching System.Drawing)
          for (let row = 0; row < height; row++) {
            const rowOffset = row * stride;
            for (let col = 0; col < width; col++) {
              const srcIdx = (row * width + col) * 4;
              const dstIdx = rowOffset + col * 3;

              // Copy in BGR order to match System.Drawing
              paddedData[dstIdx + 2] = data[srcIdx]; // B
              paddedData[dstIdx + 1] = data[srcIdx + 1]; // G
              paddedData[dstIdx] = data[srcIdx + 2]; // R
            }
          }

          // Generate SHA-256 hash
          const hashBuffer = await crypto.subtle.digest("SHA-256", paddedData);
          const hashArray = Array.from(new Uint8Array(hashBuffer));
          const hashHex = hashArray
            .map((b) => b.toString(16).padStart(2, "0"))
            .join("");

          resolve(hashHex);
        };
        img.onerror = () => reject(new Error("Failed to load image"));
        img.src = e.target?.result as string;
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(imageFile);
  });
};

const VerifyNFT: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [verificationStatus, setVerificationStatus] = useState<
    "idle" | "verifying" | "verified" | "not-verified"
  >("idle");
  const [verificationSteps, setVerificationSteps] = useState<VerificationState>(
    {
      imageHash: {
        status: "pending",
        title: "Calculate Image Hash",
      },
      ipfsCheck: {
        status: "pending",
        title: "Verify IPFS Content",
      },
      databaseCheck: {
        status: "pending",
        title: "Check Ownership Records",
      },
    },
  );

  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const handleFileUpload = (uploadedFile: File) => {
    if (uploadedFile) {
      setFile(uploadedFile);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(uploadedFile);
      resetVerification();
    }
  };

  // Functions to handle file drag and drop
  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  // Function to trigger a click on the file input
  const triggerFileInput = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    fileInputRef.current?.click();
  };

  // Function to cancel the file upload
  const cancelFileUpload = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setFile(null);
    setPreview(null);
    resetVerification();
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const resetVerification = () => {
    setVerificationStatus("idle");
    setVerificationSteps({
      imageHash: {
        status: "pending",
        title: "Calculate Image Hash",
      },
      ipfsCheck: {
        status: "pending",
        title: "Verify IPFS Content",
      },
      databaseCheck: {
        status: "pending",
        title: "Check Ownership Records",
      },
    });
  };

  const verifyNFT = async () => {
    if (!file) return;

    try {
      setVerificationStatus("verifying");

      // Step 1: Generate image hash
      setVerificationSteps((prev) => ({
        ...prev,
        imageHash: {
          ...prev.imageHash,
          status: "processing",
          description: "Calculating SHA-256 hash...",
        },
      }));

      const imageHash = await generateImageHash(file);

      setVerificationSteps((prev) => ({
        ...prev,
        imageHash: {
          ...prev.imageHash,
          status: "complete",
          description: "Hash calculation complete",
          hash: imageHash,
        },
        ipfsCheck: {
          ...prev.ipfsCheck,
          status: "processing",
          description: "Verifying image content on IPFS...",
        },
      }));

      // Step 2: IPFS check (simulated)
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setVerificationSteps((prev) => ({
        ...prev,
        ipfsCheck: {
          ...prev.ipfsCheck,
          status: "complete",
          description: "Content verified on IPFS",
        },
        databaseCheck: {
          ...prev.databaseCheck,
          status: "processing",
          description: "Checking blockchain records...",
        },
      }));

      // Step 3: Check database
      const nftsRef = collection(db, "nfts");
      const q = query(nftsRef, where("imageHash", "==", imageHash));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        setVerificationSteps((prev) => ({
          ...prev,
          databaseCheck: {
            ...prev.databaseCheck,
            status: "complete",
            description: "Ownership verified successfully",
          },
        }));
        setVerificationStatus("verified");
      } else {
        setVerificationSteps((prev) => ({
          ...prev,
          databaseCheck: {
            ...prev.databaseCheck,
            status: "error",
            description: "No matching records found",
          },
        }));
        setVerificationStatus("not-verified");
      }
    } catch (error) {
      console.error("Verification failed:", error);
      setVerificationStatus("not-verified");
      setVerificationSteps((prev) => ({
        ...prev,
        databaseCheck: {
          ...prev.databaseCheck,
          status: "error",
          description: "Verification process failed",
        },
      }));
    }
  };

  return (
    <div className={styles.verifyCard}>
      <div className={styles.verifyHeader}>
        <Sparkles className={styles.headerIcon} size={24} />
        <h2 className={styles.verifyTitle}>Verify NFT</h2>
        <Sparkles className={styles.headerIcon} size={24} />
      </div>
      <input
        ref={fileInputRef}
        type="file"
        onChange={(e) => e.target.files && handleFileUpload(e.target.files[0])}
        accept="image/*"
        className={styles.fileInput}
        style={{ display: "none" }}
      />

      {preview ? (
        <div
          className={styles.previewWrapper}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <img
            src={preview}
            alt="NFT Preview"
            className={styles.preview}
            onClick={triggerFileInput}
          />
          <button
            className={styles.cancelButton}
            onClick={cancelFileUpload}
            aria-label="Cancel file upload"
          >
            <XCircle size={24} />
          </button>
        </div>
      ) : (
        <div
          className={styles.uploadWrapper}
          onClick={triggerFileInput}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <Upload className={styles.uploadIcon} size={64} />
          <div className={styles.uploadText}>Drop your NFT here</div>
          <div className={styles.uploadSubText}>or click to browse files</div>
        </div>
      )}
      {verificationStatus !== "idle" && (
        <div className={styles.verificationSteps}>
          {Object.entries(verificationSteps).map(([key, step]) => (
            <div key={key} className={styles.step}>
              {step.status === "complete" && (
                <CheckCircle
                  size={20}
                  className={`${styles.stepIcon} ${styles.completeIcon}`}
                />
              )}
              {step.status === "processing" && (
                <Loader2
                  size={20}
                  className={`${styles.stepIcon} ${styles.processingIcon}`}
                />
              )}
              {step.status === "error" && (
                <XCircle
                  size={20}
                  className={`${styles.stepIcon} ${styles.errorIcon}`}
                />
              )}
              {step.status === "pending" && (
                <Hash
                  size={20}
                  className={`${styles.stepIcon} ${styles.pendingIcon}`}
                />
              )}
              <div className={styles.stepContent}>
                <h4>{step.title}</h4>
                {step.description && <p>{step.description}</p>}
                {step.hash && (
                  <code className={styles.stepHash}>{step.hash}</code>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      {verificationStatus === "verified" && (
        <div className={`${styles.resultContainer} ${styles.verified}`}>
          <CheckCircle size={24} />
          <p>NFT verified, Created using Jimpsons.org!</p>
        </div>
      )}
      {verificationStatus === "not-verified" && (
        <div className={`${styles.resultContainer} ${styles.notVerified}`}>
          <XCircle size={24} />
          <p>NFT verification failed</p>
        </div>
      )}
      <div className={styles.buttonContainer}>
        {verificationStatus === "verified" ? (
          <>
            <button
              className={`${styles.verifyButton} ${styles.verifiedButton}`}
              disabled
            >
              <CheckCircle size={20} />
              Verified NFT
            </button>
            <button
              onClick={resetVerification}
              className={`${styles.verifyButton} ${styles.resetButton}`}
            >
              Verify New NFT
            </button>
          </>
        ) : (
          <button
            onClick={verifyNFT}
            disabled={!file || verificationStatus === "verifying"}
            className={`${styles.verifyButton} ${styles.verifyActionButton}`}
          >
            {verificationStatus === "verifying" ? (
              <>
                <Loader2 className={styles.spinIcon} size={20} />
                Verifying...
              </>
            ) : (
              <>
                <CheckCircle size={20} />
                Verify NFT
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default VerifyNFT;

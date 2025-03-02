import { useState } from "react";
import { FileDown, Eye, ChevronDown } from "lucide-react";
import styles from "./PictchPage.module.css";
import MainLayout from "@/layouts/MainLayout/MainLayout";

const PitchPage = ({
  pdfPath = "/investment_pitch_deck.pdf",
  title = "Investment Pitch Deck",
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <MainLayout>
      <div className={styles.container}>
        <div className={styles.cardWrapper}>
          <div className={styles.header}>
            <h2 className={styles.title}>{title}</h2>
            <div className={styles.buttonGroup}>
              <a href={pdfPath} download className={styles.downloadButton}>
                <FileDown size={16} />
                Download
              </a>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className={styles.previewButton}
              >
                <Eye size={16} />
                {isExpanded ? "Hide Preview" : "Show Preview"}
                <ChevronDown
                  size={16}
                  className={`${styles.chevron} ${isExpanded ? styles.chevronExpanded : ""}`}
                />
              </button>
            </div>
          </div>

          {isExpanded && (
            <div className={styles.pdfContainer}>
              <iframe
                src={`${pdfPath}#view=FitH`}
                className={styles.pdfViewer}
                title={title}
              />
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default PitchPage;

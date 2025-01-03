import React from "react";
import styles from "./WorkInProgress.module.css";
import { workInProgress } from "@/assets/images/others";

const WorkInProgress: React.FC = () => {
  return (
    <main className={styles.main}>
      {/* Background decoration */}
      <div className={styles.backgroundDecoration}>
        <div className={styles.decorationTop} />
        <div className={styles.decorationBottom} />
      </div>

      <div className={styles.contentWrapper}>
        <div className={styles.imageContainer}>
          <img src={workInProgress} alt="Work in progress" />
          <div className={styles.shadow} />
        </div>

        <div className={styles.titleContainer}>
          <h1 className={styles.title}>
            <span className={styles.highlight}>LAUNCHING SOON</span>
          </h1>
        </div>
      </div>
    </main>
  );
};

export default WorkInProgress;

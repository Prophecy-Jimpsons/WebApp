import React from "react";
import styles from "./WorkInProgress.module.css";
import { workInProgress } from "@/assets/images/others";

const WorkInProgress: React.FC = () => {
  return (
    <main className={styles.main}>
      <div className={styles.imageContainer}>
        <img src={workInProgress} alt="Work in progress" />
      </div>
    </main>
  );
};

export default WorkInProgress;

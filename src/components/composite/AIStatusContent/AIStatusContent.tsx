import React from "react";
import styles from "./AIStatusContent.module.css";

import { sleepingJimp } from "@/assets/images/others";

const AIStatusContent: React.FC = () => {
  return (
    <div className={styles.aiStatusContent}>
      <div className={styles.imageContainer}>
        <img
          src={sleepingJimp}
          alt="Sleeping Jimp"
          className={styles.statusImage}
        />
      </div>
      <h3 className={styles.title}>
        Oops! Our AI is taking a quick digital nap! 😴💤
      </h3>
      <p className={styles.errorCode}>
        Error 404: Witty Responses Temporarily Unavailable
      </p>
      <p className={styles.description}>Our silicon buddy is:</p>
      <ul className={styles.activityList}>
        <li>🧠 Upgrading its humor circuits</li>
        <li>☕ Learning to brew virtual coffee</li>
        <li>🤖 Practicing its best human impression</li>
      </ul>
      <p className={styles.reassurance}>
        Don't worry, it'll be back faster than you can say "AI"! 🚀
      </p>
      <div className={styles.supportSection}>
        <h4>Need a quick fix?</h4>
        <p>
          👉 Click the Support button in the bottom right corner to talk to our
          support team!
        </p>
      </div>
      <p className={styles.reminder}>
        Remember: Even supercomputers need beauty sleep! 💖
      </p>
      <p className={styles.joke}>
        While you wait, why not tell a joke to your toaster? It's almost as
        responsive as our AI right now! 😉
      </p>
    </div>
  );
};

export default AIStatusContent;

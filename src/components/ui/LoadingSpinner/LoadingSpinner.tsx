import { FC } from "react";
import styles from "./LoadingSpinner.module.css";

interface LoadingSpinnerProps {
  text?: string;
}

const LoadingSpinner: FC<LoadingSpinnerProps> = ({
  text = "Loading ProphecyJimpsons...",
}) => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <img
          src="/assets/images/mainLogo.svg"
          alt="ProphecyJimpsons Loading"
          className={styles.logo}
        />
        <div className={styles.text}>{text}</div>
      </div>
    </div>
  );
};

export default LoadingSpinner;

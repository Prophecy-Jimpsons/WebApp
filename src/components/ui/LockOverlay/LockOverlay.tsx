import { FC } from "react";
import { Rocket } from "lucide-react";
import Button from "@/components/ui/Button";
import styles from "./LockOverlay.module.css";

interface LaunchOverlayProps {
  message?: string;
}

const LaunchOverlay: FC<LaunchOverlayProps> = ({
  message = "Get ready for an innovative NFT experience",
}) => {
  return (
    <div className={styles.overlay}>
      <div className={styles.content}>
        <div className={styles.iconWrapper}>
          <div className={styles.rocketContainer}>
            <Rocket className={styles.icon} />
          </div>
          <div className={styles.stars}>
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className={`${styles.star} ${styles[`star${i + 1}`]}`}
              />
            ))}
          </div>
        </div>
        <h3 className={styles.title}>NFT Marketplace Coming Soon</h3>
        <p className={styles.message}>{message}</p>
        <div className={styles.buttonWrapper}>
          <Button variant="primary" to="/">
            Go Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LaunchOverlay;

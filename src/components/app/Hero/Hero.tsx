import { FC } from "react";
import Button from "@/components/ui/Button";
import styles from "./Hero.module.css";

interface HeroProps {
  heroImage: string;
  verifiedImage: string;
}

const Hero: FC<HeroProps> = ({ heroImage, verifiedImage }) => {
  return (
    <div className={styles.heroWrapper}>
      <div className={styles.heroContent}>
        <div className={styles.leftSection}>
          <h1 className={styles.title}>Exchange Non-Fungible Token</h1>
          <h1 className={styles.subtitle}>Developed by Prophecy Jimpsons</h1>
          <div className={styles.buttonGroup}>
            <Button variant="primary" to="/explore">
              Explore NFTs
            </Button>
            <Button variant="secondary" to="/create">
              Create NFT
            </Button>
          </div>
        </div>

        <div className={styles.rightSection}>
          <div className={styles.imageContainer}>
            <img
              className={styles.heroImage}
              src={heroImage}
              alt="Hero Image"
            />
            <img
              src={verifiedImage}
              alt="Verified Icon"
              className={styles.verifiedBadge}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;

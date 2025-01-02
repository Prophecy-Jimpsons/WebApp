import { FC } from "react";
import Button from "@/components/ui/Button";
import styles from "./Hero.module.css";

import SOLANA from "@/assets/icons/chains/Solana_Network_Logo.png";
import BASE from "@/assets/icons/chains/Base_Network_Logo.svg";
import POLYGON from "@/assets/icons/chains/Polygon_Network_Logo.png";
import STARKNET from "@/assets/icons/chains/Starknet_Network_Logo.svg";

const Hero: FC = () => {
  return (
    <section className={styles.heroWrapper}>
      <div className={styles.hero}>
        {/* Floating Icons (Chain icon) */}
        <div className={styles.floatingIcons}>
          <div className={`${styles.icon} ${styles.icon1}`}>
            <img src={SOLANA} alt="Solona logo" />
          </div>
          <div className={`${styles.icon} ${styles.icon2}`}>
            <img src={BASE} alt="Base logo" />
          </div>
          <div className={`${styles.icon} ${styles.icon3}`}>
            <img src={POLYGON} alt="Polygon logo" />
          </div>
          <div className={`${styles.icon} ${styles.icon4}`}>
            <img src={STARKNET} alt="Starknet logo" />
          </div>
        </div>

        <div className={styles.content}>
          <h1 className={styles.title}>
            <span className={styles.highlight}>PROPHECY</span>
            <span className={styles.regularText}>JIMPSONS</span>
          </h1>

          <h2 className={styles.subtitle}>
            Next Generation of{" "}
            <span className={styles.highlight}>Predictive NFTs</span>
          </h2>

          <p className={styles.description}>
            Create and trade predictions as unique NFTs with{" "}
            <span className={styles.highlight}>zero initial cost</span>. Powered
            by AI with verification and multi-chain support for maximum value.
          </p>

          <div className={styles.buttonGroup}>
            {/* // "/app" need to change this */}
            <Button variant="primary" to="/work-in-progress">
              Enter Application
            </Button>
            <Button
              variant="secondary"
              to="https://jimpsons.gitbook.io/jimpsons.org"
            >
              White paper
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

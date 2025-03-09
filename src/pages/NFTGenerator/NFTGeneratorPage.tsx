import { FC } from "react";

import { useWallet } from "@solana/wallet-adapter-react";
import MainLayout from "../../layouts/MainLayout/MainLayout";
import { NFTGenerator } from "@/components/composite/NFTGenerator";
import styles from "@/components/composite/AccountDetails/AccountUI.module.css";

const NFTGeneratorPage: FC = () => {
  const { publicKey } = useWallet();

  if (!publicKey) {
    return (
      <MainLayout>
        <div className={styles.container}>
          <div className={styles.content}>
            <div className={styles.titleSection}>
              <div className={styles.iconContainer}>
                <span className={styles.walletIcon}>👛</span>
              </div>
              <h1 className={styles.mainTitle}>
                [DEVNET] Wallet Connection Required
              </h1>
              <p className={styles.connectSubtext}>
                Please connect your devnet wallet using the "Select Wallet"
                button in the top-right corner to access account details and
                platform features.
              </p>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <NFTGenerator />
    </MainLayout>
  );
};

export default NFTGeneratorPage;

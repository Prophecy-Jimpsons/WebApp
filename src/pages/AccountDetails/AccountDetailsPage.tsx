import { AccountDetail } from "@/components/composite/AccountDetails";
import styles from "@/components/composite/AccountDetails/AccountUI.module.css";
import { useWallet } from "@solana/wallet-adapter-react";
import { FC } from "react";
import MainLayout from "../../layouts/MainLayout/MainLayout";

const AccountDetails: FC = () => {
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
              <h1 className={styles.mainTitle}>Wallet Connection Required</h1>
              <p className={styles.connectSubtext}>
                Please connect your wallet using the "Select Wallet" button in
                the top-right corner to access account details and platform
                features.
              </p>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className={styles.container}>
        <div className={styles.content}>
          <AccountDetail address={publicKey} />
        </div>
      </div>
    </MainLayout>
  );
};

export default AccountDetails;

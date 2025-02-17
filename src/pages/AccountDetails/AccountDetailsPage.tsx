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
            <h1 className={styles.title}>Please connect your wallet</h1>
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

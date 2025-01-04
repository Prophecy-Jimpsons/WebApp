import { FC } from "react";
import { ConnectWalletButton } from "@/components/wallet";
import styles from "./ConnectWallet.module.css";

const ConnectWallet: FC = () => {
  return (
    <div className={styles.wrapper}>
    <ConnectWalletButton />
  </div>
  );
};

export default ConnectWallet;

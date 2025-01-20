import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { Wallet } from "lucide-react";
import styles from "./NFTCollection.module.css";
import "@solana/wallet-adapter-react-ui/styles.css";

const NFTCollection = () => {
  const { connected, publicKey } = useWallet();

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>NFT Collection</h1>
          <div>
            {connected && publicKey ? (
              <div className={styles.walletInfo}>
                <Wallet className={styles.walletIcon} size={20} />
                <span className={styles.walletAddress}>
                  {`${publicKey.toString().slice(0, 4)}...${publicKey.toString().slice(-4)}`}
                </span>
              </div>
            ) : (
              <div className={styles.walletButtonWrapper}>
                <WalletMultiButton />
              </div>
            )}
          </div>
        </div>

        <div className={styles.content}>
          {!connected ? (
            <>
              <Wallet size={48} className={styles.walletIcon} />
              <p className={styles.placeholder}>
                Connect your wallet to view your NFT collection
              </p>
            </>
          ) : (
            <>
              <p className={styles.placeholder}>Connected with wallet:</p>
              <p className={styles.fullAddress}>{publicKey?.toString()}</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default NFTCollection;

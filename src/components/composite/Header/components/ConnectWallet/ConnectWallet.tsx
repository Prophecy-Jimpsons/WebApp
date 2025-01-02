import { FC } from "react";
import { Link } from "react-router-dom";
import PATHS from "@/app/routes/paths";
import styles from "./ConnectWallet.module.css";

const ConnectWallet: FC = () => {
  return (
    <Link to={PATHS.PUBLIC.APP} className={`${styles.button}`}>
      Connect Wallet
    </Link>
  );
};

export default ConnectWallet;

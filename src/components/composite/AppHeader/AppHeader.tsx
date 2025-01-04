import { FC, useState } from "react";
import { Menu, X } from "lucide-react";
import Logo from "@/components/composite/Header/components/Logo";
import ConnectWallet from "@/components/composite/Header/components/ConnectWallet";
import AppNavbar from "./components/AppNavbar";
import styles from "../Header/Header.module.css";

const AppHeader: FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className={styles.headerWrapper}>
      <div className={styles.header}>
        <Logo />

        <div className={styles.desktopNav}>
          <AppNavbar />
        </div>

        <div className={styles.rightSection}>
          <div className={styles.desktopEnterApp}>
            <ConnectWallet />
          </div>

          <button
            className={styles.menuButton}
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className={styles.menuIcon} />
            ) : (
              <Menu className={styles.menuIcon} />
            )}
          </button>
        </div>

        <div
          className={`${styles.mobileMenu} ${isMenuOpen ? styles.active : ""}`}
        >
          <AppNavbar />
          <div className={styles.mobileEnterApp}>
            <ConnectWallet />
          </div>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;

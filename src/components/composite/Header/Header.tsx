import { FC, useState } from "react";
import { Menu, X } from "lucide-react";
import Logo from "./components/Logo";
import Navbar from "./components/Navbar";
import EnterAppButton from "./components/ConnectWallet";
import styles from "./Header.module.css";

export const Header: FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <header className={styles.headerWrapper}>
        <div className={styles.header}>
          <Logo />

          <div className={styles.desktopNav}>
            <Navbar />
          </div>

          <div className={styles.rightSection}>
            <div className={styles.desktopEnterApp}>
              <EnterAppButton />
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

          {/* Mobile menu with animation classes */}
          <div
            className={`${styles.mobileMenu} ${isMenuOpen ? styles.active : ""}`}
          >
            <Navbar />
            <div className={styles.mobileEnterApp}>
              <EnterAppButton />
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;

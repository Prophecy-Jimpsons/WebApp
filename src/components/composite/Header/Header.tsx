import { FC } from "react";

import Logo from "./components/Logo";
import Navbar from "./components/Navbar";
import EnterAppButton from "./components/EnterAppButton/";
import styles from "./Header.module.css";

export const Header: FC = () => {
  return (
    <header className={styles.headerWrapper}>
      <div className={styles.header}>
        <Logo />
        <Navbar />
        <EnterAppButton />
      </div>
    </header>
  );
};

export default Header;

import { FC } from "react";
import { Link, useLocation } from "react-router-dom";
import { navLinks } from "./config";
import styles from "./navbar.module.css";

const Navbar: FC = () => {
  const location = useLocation();
  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === path;
    }

    return location.pathname.startsWith(path);
  };
  return (
    <nav className={styles.navbar}>
      <div className={styles.navLinks}>
        {navLinks.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`${styles.navLink} ${isActive(link.path) ? styles.activeLink : ""}`}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;

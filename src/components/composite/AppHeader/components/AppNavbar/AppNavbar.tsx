import { FC } from "react";
import { Link, useLocation } from "react-router-dom";
import { appNavLinks } from "./config";
// import styles from "../../../Header/components/Navbar/navbar.module.css";
import styles from "./AppNavbar.module.css";

const AppNavbar: FC = () => {
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
        {appNavLinks.map((link) => (
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

export default AppNavbar;

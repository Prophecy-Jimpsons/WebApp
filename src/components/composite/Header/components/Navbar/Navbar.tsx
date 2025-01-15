import { FC } from "react";
import { Link, useLocation } from "react-router-dom";
import { Star } from "lucide-react";
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

  const getLinkClassName = (path: string, label: string) => {
    const baseClass = styles.navLink;
    const activeClass = isActive(path) ? styles.activeLink : "";
    const betaClass = label === "AI Preview" ? styles.betaLink : "";

    return `${baseClass} ${activeClass} ${betaClass}`.trim();
  };

  const renderLink = (link: (typeof navLinks)[number]) => {
    if (link.label === "AI Preview") {
      return (
        <div className={styles.betaWrapper} key={link.path}>
          <Link
            to={link.path}
            className={getLinkClassName(link.path, link.label)}
          >
            <Star size={16} className={styles.star} strokeWidth={2.5} />
            {link.label}
          </Link>
          <span className={styles.betaBadge}>BETA</span>
        </div>
      );
    }

    return (
      <Link
        key={link.path}
        to={link.path}
        className={getLinkClassName(link.path, link.label)}
      >
        {link.label}
      </Link>
    );
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.navLinks}>{navLinks.map(renderLink)}</div>
    </nav>
  );
};

export default Navbar;

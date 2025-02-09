import { FC } from "react";
import { Link, useLocation } from "react-router-dom";
import { Star, BotMessageSquare, Gamepad2Icon } from "lucide-react";
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
    const specialClass =
      label === "AI Preview" || label === "AVAI Chat" || label === "Game"
        ? styles.betaLink
        : "";

    return `${baseClass} ${activeClass} ${specialClass}`.trim();
  };

  const renderLink = (link: (typeof navLinks)[number]) => {
    const isSpecialLink =
      link.label === "AI Preview" ||
      link.label === "AVAI Chat" ||
      link.label === "Game";

    if (isSpecialLink) {
      return (
        <div className={styles.betaWrapper} key={link.path}>
          <Link
            to={link.path}
            className={getLinkClassName(link.path, link.label)}
          >
            {link.label === "Game" && (
              <Gamepad2Icon
                size={16}
                className={styles.game}
                strokeWidth={2.5}
              />
            )}
            {link.label === "AVAI Chat" && (
              <BotMessageSquare
                size={16}
                className={styles.chat}
                strokeWidth={2.5}
              />
            )}
            {link.label === "AI Preview" && (
              <Star size={16} className={styles.star} strokeWidth={2.5} />
            )}
            {link.label}
          </Link>
          {link.label === "AI Preview" && (
            <span className={styles.betaBadge}>BETA</span>
          )}
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

import React from "react";
import styles from "./Footer.module.css";
import logo from "@/assets/images/Logo/jimpsons.svg";
import { footerLinks, socialLinks } from "./config";
import { Link } from "react-router-dom";

export const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.topFooter}>
        {/* Logo Column */}
        <div className={styles.footerColumnLogo}>
          <img src={logo} alt="Jimpsons Logo" />
        </div>

        {/* Footer Content Column */}
        <div>
          <ul className={styles.footerLinks}>
            {footerLinks.map((link) => (
              <li key={link.label}>
                <Link to={link.path} target="_blank">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Social Content Column */}
        <div>
          <ul className={styles.socialLinks}>
            {socialLinks.map((link) => (
              <li key={link.label}>
                <Link to={link.path} target="_blank">
                  <img src={link.icon} alt={link.label} width="24" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Divider Line */}
      <hr className={styles.footerDivider} />

      {/* Copyright Column */}
      <div className={styles.bottomFooter}>
        <p>&copy; 2025 Prophecy Jimpsons. All rights reserved.</p>
      </div>
    </footer>
  );
};

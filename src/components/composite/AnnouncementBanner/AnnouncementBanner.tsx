import { X } from "lucide-react";
import { FC, useEffect, useState } from "react";
import styles from "./AnnouncementBanner.module.css";

// const TELEGRAM_LINK = "https://t.me/Jimpsons";
const SCROLL_THRESHOLD = 100; // Amount of scroll before hiding

interface AnnouncementBannerProps {
  onVisibilityChange?: (isVisible: boolean) => void;
}

const AnnouncementBanner: FC<AnnouncementBannerProps> = ({
  onVisibilityChange,
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isClosing, setIsClosing] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Check if banner was previously closed
  useEffect(() => {
    const bannerClosed = localStorage.getItem("announcementBannerClosed");
    if (bannerClosed) {
      setIsVisible(false);
      onVisibilityChange?.(false);
    } else {
      onVisibilityChange?.(true);
    }

    // Add scroll event listener
    // let lastScrollY = window.scrollY;
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > SCROLL_THRESHOLD);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [onVisibilityChange]);

  const handleClose = () => {
    setIsClosing(true);
    localStorage.setItem("announcementBannerClosed", "true");
    setTimeout(() => {
      setIsVisible(false);
      onVisibilityChange?.(false);
    }, 300);
  };

  if (!isVisible) return null;

  return (
    <div
      className={`${styles.banner} ${isClosing ? styles.closing : ""} ${isScrolled ? styles.scrolled : ""}`}
    >
      <div className={styles.content}>
        {/* <a
          href={TELEGRAM_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.link}
        >
          <Send className={styles.icon} size={20} />
          <span>
            🎮 <span className={styles.highlight}>Telegram Game</span> unleased
            beta version of JIMP tic-tac-toe
          </span> 
        
        </a>
        */}
        <span>
          <span className={styles.highlight}>Mainnet</span> deployement comming
          soon!!!
        </span>
        <button
          onClick={handleClose}
          className={styles.closeButton}
          aria-label="Close announcement"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
};

export default AnnouncementBanner;

// src/components/app/AppContent/AppContent.tsx
import { FC } from "react";
import Hero from "@/components/app/Hero/Hero";
import MarketplacePreview from "@/components/app/MarketplacePreview";
import LockOverlay from "@/components/ui/LockOverlay";
import styles from "./AppContent.module.css";

interface AppContentProps {
  heroImage: string;
  verifiedImage: string;
}

const AppContent: FC<AppContentProps> = ({ heroImage, verifiedImage }) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.content}>
        <Hero heroImage={heroImage} verifiedImage={verifiedImage} />
        <MarketplacePreview />
      </div>
      <LockOverlay />
    </div>
  );
};

export default AppContent;

import { FC, useState } from "react";
import { Header } from "@/components/composite/Header";
import { Footer } from "@/components/composite/Footer";
import SupportWidget from "@/components/composite/Chat";
import AnnouncementBanner from "@/components/composite/AnnouncementBanner";
import styles from "./MainLayout.module.css";

type Props = {
  children: React.ReactNode;
};

const MainLayout: FC<Props> = ({ children }: Props) => {
  const [hasAnnouncement, setHasAnnouncement] = useState(true);

  return (
    <>
      <AnnouncementBanner onVisibilityChange={setHasAnnouncement} />
      <div
        className={`${styles.wrapper} ${hasAnnouncement ? styles.withAnnouncement : styles.withoutAnnouncement}`}
      >
        <Header />
        <main className={styles.main}>{children}</main>
        <Footer />
      </div>
      <SupportWidget />
    </>
  );
};

export default MainLayout;

import { FC, ReactNode } from "react";
import AppHeader from "@/components/composite/AppHeader";
import { Footer } from "@/components/composite/Footer";
import styles from "./AppLayout.module.css";

interface AppLayoutProps {
  children: ReactNode;
}

const AppLayout: FC<AppLayoutProps> = ({ children }) => {
  return (
    <div className={styles.layoutWrapper}>
      <AppHeader />
      <main className={styles.mainContent}>
        <div className={styles.container}>{children}</div>
      </main>
      <Footer />
    </div>
  );
};

export default AppLayout;

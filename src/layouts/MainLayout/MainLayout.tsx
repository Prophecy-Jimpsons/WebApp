import { FC } from "react";
import { Header } from "@/components/composite/Header";
import { Footer } from "@/components/composite/Footer";
import SupportWidget from "@/components/composite/Chat";
import styles from "./MainLayout.module.css";

type Props = {
  children: React.ReactNode;
};

const MainLayout: FC<Props> = ({ children }: Props) => {
  return (
    <>
      <div className={styles.wrapper}>
        <Header />
        <main className={styles.main}>{children}</main>
        <Footer />
      </div>
      <SupportWidget />
    </>
  );
};
export default MainLayout;

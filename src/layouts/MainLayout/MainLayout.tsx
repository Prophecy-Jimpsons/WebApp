import { FC } from "react";
import { Header } from "@/components/composite/Header";
import { Footer } from "@/components/composite/Footer";

type Props = {
  children: React.ReactNode;
};

const MainLayout: FC<Props> = ({ children }: Props) => {
  return (
    <div>
      <Header />
      <main>
        {/* <Hero /> */}
        {children}
      </main>
      <Footer />
    </div>
  );
};
export default MainLayout;

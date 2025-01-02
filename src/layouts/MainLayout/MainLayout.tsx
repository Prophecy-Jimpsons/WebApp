import { FC } from "react";
import { Header } from "@/components/composite/Header";
import Hero from "@/components/composite/Hero";
import { Footer } from "@/components/composite/Footer";

const MainLayout: FC = () => {
  return (
    <div>
      <Header />
      <main>
        <Hero />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;

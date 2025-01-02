import { FC } from "react";
import { Header } from "@/components/composite/Header";
import Roadmap from "@/components/composite/Roadmap";
import { Footer } from "@/components/composite/Footer";

const Roadmaps: FC = () => {
  return (
    <div>
      <Header />
      <Roadmap />
      <Footer />
    </div>
  );
};

export default Roadmaps;

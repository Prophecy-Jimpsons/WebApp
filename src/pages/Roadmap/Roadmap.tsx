import { FC } from "react";
import MainLayout from "@/layouts/MainLayout/MainLayout";
import Roadmap from "@/components/composite/Roadmap";

const Roadmaps: FC = () => {
  return (
    <MainLayout>
      <Roadmap />
    </MainLayout>
  );
};

export default Roadmaps;

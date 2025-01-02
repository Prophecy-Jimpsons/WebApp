import { FC } from "react";

import MainLayout from "../../layouts/MainLayout/MainLayout";
import Hero from "@/components/composite/Hero";

const Landing: FC = () => {
  return (
    <MainLayout>
      <Hero />
    </MainLayout>
  );
};

export default Landing;

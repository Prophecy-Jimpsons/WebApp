import { FC } from "react";

import MainLayout from "../../layouts/MainLayout/MainLayout";
import Hero from "@/components/composite/Hero";
import Features from "@/components/composite/Features";

const Landing: FC = () => {
  return (
    <MainLayout>
      <Hero />
      <Features />
    </MainLayout>
  );
};

export default Landing;

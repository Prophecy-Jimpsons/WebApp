import { FC } from "react";

import MainLayout from "../../layouts/MainLayout/MainLayout";
import Hero from "@/components/composite/Hero";
import Features from "@/components/composite/Features";
import MintSteps from "@/components/composite/MintSteps";
// import ImportantNoticeModal from "@/components/composite/ImportantNoticeModal";

const Landing: FC = () => {
  return (
    <>
      <MainLayout>
        <Hero />
        <Features />
        <MintSteps />
      </MainLayout>
      {/* <ImportantNoticeModal /> */}
    </>
  );
};

export default Landing;

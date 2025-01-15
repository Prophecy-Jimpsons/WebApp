import { FC } from "react";

import MainLayout from "../../layouts/MainLayout/MainLayout";
import { NFTGenerator } from "@/components/composite/NFTGenerator";

const NFTGeneratorPage: FC = () => {
  return (
    <MainLayout>
      <NFTGenerator />
    </MainLayout>
  );
};

export default NFTGeneratorPage;

import { FC } from "react";

import MainLayout from "../../layouts/MainLayout/MainLayout";
import { NFTCollection } from "@/components/composite/NFTCollection";

const NFTGeneratorPage: FC = () => {
  return (
    <MainLayout>
      <NFTCollection />
    </MainLayout>
  );
};

export default NFTGeneratorPage;

import { FC } from "react";

import MainLayout from "@/layouts/MainLayout/MainLayout";
import BuyStep from "@/components/composite/BuySteps";

const HowToBuyPage: FC = () => {
  return (
    <MainLayout>
      <BuyStep />
    </MainLayout>
  );
};

export default HowToBuyPage;

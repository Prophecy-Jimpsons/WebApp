import { FC } from "react";

import MainLayout from "@/layouts/MainLayout/MainLayout";
import BuyStep from "@/components/composite/BuySteps";
import BuyingSteps from "@/components/composite/BuySteps/BuyingSteps";

const HowToBuyPage: FC = () => {
  return (
    <MainLayout>
      {/* <BuyStep /> */}
      <BuyingSteps />
    </MainLayout>
  );
};

export default HowToBuyPage;

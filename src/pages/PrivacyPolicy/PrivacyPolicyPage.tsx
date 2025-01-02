import { FC } from "react";

import MainLayout from "../../layouts/MainLayout/MainLayout";
import PrivacyPolicy from "@/components/composite/PrivacyPolicy";

const PrivacyPolicyPage: FC = () => {
  return (
    <MainLayout>
      <PrivacyPolicy />
    </MainLayout>
  );
};

export default PrivacyPolicyPage;

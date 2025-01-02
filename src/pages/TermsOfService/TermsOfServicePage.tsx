import { FC } from "react";

import MainLayout from "../../layouts/MainLayout/MainLayout";
import TermsOfService from "@/components/composite/TermsOfService/TermsOfService";

const TermsOfServicePage: FC = () => {
  return (
    <MainLayout>
      <TermsOfService />
    </MainLayout>
  );
};

export default TermsOfServicePage;

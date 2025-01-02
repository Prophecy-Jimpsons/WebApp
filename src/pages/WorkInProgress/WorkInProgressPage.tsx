import { FC } from "react";

import MainLayout from "../../layouts/MainLayout/MainLayout";
import WorkInProgress from "@/components/composite/WorkInProgress";

const WorkInProgressPage: FC = () => {
  return (
    <MainLayout>
      <WorkInProgress />
    </MainLayout>
  );
};

export default WorkInProgressPage;

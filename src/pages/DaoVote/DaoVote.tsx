import { FC } from "react";
import MainLayout from "@/layouts/MainLayout/MainLayout";
import DaoVote from "@/components/composite/DaoVote";

const DaoVotePage: FC = () => {
  return (
    <MainLayout>
      <DaoVote />
    </MainLayout>
  );
};

export default DaoVotePage;

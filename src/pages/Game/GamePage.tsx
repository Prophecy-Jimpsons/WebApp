import { FC } from "react";

import MainLayout from "@/layouts/MainLayout/MainLayout";
import TicTacToe from "@/components/composite/TicTacToe";

const Game: FC = () => {
  return (
    <MainLayout>
      <TicTacToe />
    </MainLayout>
  );
};

export default Game;

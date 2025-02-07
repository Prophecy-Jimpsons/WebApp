import { FC } from "react";

import MainLayout from "@/layouts/MainLayout/MainLayout";
import AiChat from "@/components/composite/AiChat";

const AiChatPage: FC = () => {
  return (
    <MainLayout>
      <AiChat />
    </MainLayout>
  );
};

export default AiChatPage;

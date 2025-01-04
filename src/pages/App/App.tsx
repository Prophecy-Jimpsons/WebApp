import { FC } from "react";
import AppLayout from "@/layouts/AppLayout/AppLayout";
import AppContent from "@/components/app/AppContent/AppContent";

import heroImage from "@/assets/images/App/hero1.png";
import verifiedImage from "@/assets/images/App/verified.png";

const App: FC = () => {
  return (
    <AppLayout>
      <AppContent heroImage={heroImage} verifiedImage={verifiedImage} />
    </AppLayout>
  );
};

export default App;

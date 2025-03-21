import RouterProvider from "@/app/routes/RouterProvider";
import { WalletProvider } from "@/components/wallet";
import { defaultTheme, WidgetProvider } from "@anyalt/widget";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import "./styles/index.css";
import { WalletProviderContext } from "./context/WalletContext";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WidgetProvider theme={defaultTheme}>
        <WalletProvider>
          <WalletProviderContext>
            <RouterProvider />
          </WalletProviderContext>
        </WalletProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </WidgetProvider>
    </QueryClientProvider>
  );
}

export default App;

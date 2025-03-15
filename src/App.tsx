import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { WalletProvider } from "@/components/wallet";
import RouterProvider from "@/app/routes/RouterProvider";
import "./styles/index.css";
import { WalletProviderContext } from "./context/WalletContext";

const queryClient = new QueryClient();
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WalletProvider>
        <WalletProviderContext>
          <RouterProvider />
        </WalletProviderContext>
      </WalletProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;

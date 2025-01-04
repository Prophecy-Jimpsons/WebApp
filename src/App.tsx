import RouterProvider from "@/app/routes/RouterProvider";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WalletProvider } from '@/components/wallet'


import "./styles/index.css";
const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
    <WalletProvider>
      <RouterProvider />
    </WalletProvider>
    </QueryClientProvider>
  );
}

export default App;

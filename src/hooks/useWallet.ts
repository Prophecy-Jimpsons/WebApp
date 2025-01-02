import { useState } from "react";

const useWallet = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return {
    isConnected,
    isConnecting,
    error,
    connect: async () => {
      // Connection logic should be implement here...
      setIsConnecting(true);
      setIsConnected(true);
    },
    disconnect: () => {
      // Disconnect logic should be implement here...
      setIsConnected(false);
      setError("You have disconnected from the wallet.");
    },
  };
};

export default useWallet;

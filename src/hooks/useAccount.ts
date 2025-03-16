import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { Connection, PublicKey } from "@solana/web3.js";
import { useQuery } from "@tanstack/react-query";

// const syndicaApi = import.meta.env.VITE_SYNDICA_API!;

// const syndicaHostUrl = import.meta.env.VITE_MAINNET_SYNDICA_HOST_URL!;
// const syndicaHostUrl = `https://solana-mainnet.api.syndica.io/api-key/${syndicaApi}`;

// console.log("is this host urlundefined" + syndicaHostUrl);
// const syndicaKey = import.meta.env.VITE_SYNDICA_API!;
// const syndicaKey = import.meta.env.SYNDICA_API;
// const syndicaHostUrl = `https://solana-mainnet.api.syndica.io/api-key/3RUqQ1hDkbrXkK9Ptnid8uE9tYXSgZzrwcnozwefj2qUqXmEgZg68zt6HQ8Y8v4gvYDDf2e4ZaAnox5YrdLFAwb2qsdtpzq266b`;
const syndicaHostUrl = import.meta.env.VITE_MAINNET_SYNDICA_HOST_URL;


// console.log("Syndica API Key:", import.meta.env);
// console.log("Syndica Host URL:", syndicaHostUrl);

// console.log("is this host url" + syndicaHostUrl);

const connection = new Connection(syndicaHostUrl, "confirmed");

// Fetch the balance of a given solana address
export function useGetBalance({ address }: { address: PublicKey }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["get-balance", address.toString()],
    queryFn: async () => {
      try {
        return await connection.getBalance(address);
      } catch (error) {
        console.error("Error fetching balance:", error);
        throw error;
      }
    },
    enabled: !!address,
    refetchInterval: 1000 * 30, // Refetch every 30 seconds
    staleTime: 1000 * 60, // Data is fresh for 1 minute
    retry: 2, // Retry failed requests 2 times
  });
  return { data, isLoading, error };
}

//Fetch token information (e.g., token accounts) for a Solana account.
export function useGetTokenInfo({ address }: { address: PublicKey }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["get-token-info", address.toString()],
    queryFn: async () => {
      try {
        const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
          address,
          {
            programId: TOKEN_PROGRAM_ID,
          },
        );
        return tokenAccounts;
      } catch (error) {
        console.error("Error fetching token info:", error);
        throw error;
      }
    },
    enabled: !!address,
    retry: 2, // Retry failed requests 3 times
    staleTime: 1000 * 60 * 5, // Data is fresh for 5 minutes
    refetchInterval: 1000 * 60 * 10, // Refetch every 10 minutes
  });
  return {
    data,
    isLoading,
    error,
    hasTokens: data?.value && data.value.length > 0,
  };
}

// Fetch the Associated Token Account (ATA) for a given mint and owner.
export function useGetATA(mint?: string, address?: PublicKey) {
  return useQuery({
    queryKey: ["ata", mint, address?.toString()],
    queryFn: async () => {
      if (!mint || !address) {
        return "N/A";
        // throw new Error("Missing required parameters");
      }
      const tokenAccount = await getAssociatedTokenAddress(
        new PublicKey(mint),
        address,
        true,
        TOKEN_PROGRAM_ID,
        ASSOCIATED_TOKEN_PROGRAM_ID,
      );
      return tokenAccount.toString();
    },
    staleTime: 1000 * 60 * 60, // Data is fresh for 1 hour
    refetchOnWindowFocus: false, // No need to refetch
    refetchOnMount: false, // No need to refetch
  });
}

// Fetch transaction history for a given Associated Token Account (ATA).
export function useGetTxs({ ata }: { ata: string }) {
  return useQuery({
    queryKey: ["get-txs", ata],
    queryFn: async () => {
      if (ata === "N/A") {
        return [];
      }
      try {
        const signatures = await connection.getSignaturesForAddress(
          new PublicKey(ata),
          {
            limit: 1000,
          },
        );

        const txs = await connection.getTransactions(
          signatures.map((sig) => sig.signature),
          { maxSupportedTransactionVersion: 0 },
        );

        return txs ?? [];
      } catch (error) {
        console.error("Error fetching data:", error);
        throw error;
      }
    },
    refetchOnMount: true, // Get fresh data on component mount
    refetchOnWindowFocus: false, // Don't refetch when window regains focus
    refetchOnReconnect: false, // Don't refetch when reconnecting
    staleTime: 1000 * 60 * 2, // Data becomes stale after 2 minutes
    cacheTime: 1000 * 60 * 30, // Cache for 30 minutes
    retry: 2, // Retry failed requests 2 times
  });
}

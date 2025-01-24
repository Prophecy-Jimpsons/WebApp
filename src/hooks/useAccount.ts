import {
  getAccount,
  getMint,
  TOKEN_2022_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import {
  Connection,
  ParsedTransactionWithMeta,
  PublicKey,
} from "@solana/web3.js";
import { useQuery } from "@tanstack/react-query";

// Use Alchemy endpoint for better reliability
// const connection = new Connection(
//   "https://solana-mainnet.g.alchemy.com/v2/Q9hG9amWf8wxM9S8od2WfcsqF9TvhIn1",
//   "confirmed",
// );

const connection = new Connection(
  "https://hidden-sparkling-layer.solana-devnet.quiknode.pro/1be62921eb289ad9ca82d198727bfce355d225c4/",
  "confirmed",
);

const connection2 = new Connection(
  "https://go.getblock.io/5042a92f574145edb15f4c567848d2e4",
  "confirmed",
);

const connection3 = new Connection(
  "https://solana-mainnet.api.syndica.io/api-key/3RUqQ1hDkbrXkK9Ptnid8uE9tYXSgZzrwcnozwefj2qUqXmEgZg68zt6HQ8Y8v4gvYDDf2e4ZaAnox5YrdLFAwb2qsdtpzq266b",
  "confirmed",
);
console.log("connection", connection);
console.log("connection2", connection2);
console.log("connection3", connection3);

export function useGetBalance({ address }: { address: PublicKey }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["get-balance", address.toString()],
    queryFn: async () => {
      try {
        return await connection3.getBalance(address);
      } catch (error) {
        console.error("Error fetching balance:", error);
        throw error;
      }
    },
    enabled: !!address,
    refetchInterval: 10000,
  });
  return { data, isLoading, error };
}

// async function getTokenBalanceSpl(connection, tokenAccount) {
//   const info = await getAccount(connection, tokenAccount);
//   const amount = Number(info.amount);
//   const mint = await getMint(connection, info.mint);
//   const balance = amount / 10 ** mint.decimals;
//   console.log("Balance (using Solana-Web3.js): ", balance);
//   return balance;
// }

// getTokenBalanceSpl(SOLANA_CONNECTION, TOKEN_ADDRESS).catch((err) =>
//   console.log(err),
// );
export function useGetTokenAccounts({ address }: { address: PublicKey }) {
  return useQuery({
    queryKey: ["get-token-accounts", address.toString()],
    queryFn: async () => {
      try {
        const [tokenAccounts, token2022Accounts] = await Promise.all([
          connection3.getParsedTokenAccountsByOwner(address, {
            programId: TOKEN_PROGRAM_ID,
          }),
          connection3.getParsedTokenAccountsByOwner(address, {
            programId: TOKEN_2022_PROGRAM_ID,
          }),
        ]);
        return [...tokenAccounts.value, ...token2022Accounts.value];
      } catch (error) {
        console.error("Error fetching token accounts:", error);
        throw error;
      }
    },
    enabled: !!address,
    refetchInterval: 10000,
  });
}

export function useGetSignatures({ address }: { address: PublicKey }) {
  return useQuery({
    queryKey: ["get-signatures", address.toString()],
    queryFn: async () => {
      try {
        const signatures = await connection.getSignaturesForAddress(address, {
          limit: 1000,
        });
        console.log("signatures call to blockchain", signatures);

        const transactions = await connection.getTransactions(
          signatures.map((sig) => sig.signature),
          { maxSupportedTransactionVersion: 0 },
        );
        console.log("transactions", transactions);
        return signatures;
      } catch (error) {
        console.error("Error fetching signatures:", error);
        throw error;
      }
    },
    enabled: !!address,
  });
}

export function useGetTxs({ ataAddPubkey }: { ataAddPubkey: PublicKey }) {
  return useQuery({
    queryKey: ["get-txs", ataAddPubkey.toString()],
    queryFn: async () => {
      const maxRetries = 3;
      let retries = 0;

      while (retries < maxRetries) {
        try {
          const signatures = await connection3.getSignaturesForAddress(
            ataAddPubkey,
            { limit: 1000 },
          );
          console.log("Signatures fetched:", signatures.length);

          if (signatures.length === 0) {
            console.log("No signatures found, retrying...");
            retries++;
            await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait 1 second before retrying
            continue;
          }

          const txs = await connection3.getTransactions(
            signatures.map((sig) => sig.signature),
            { maxSupportedTransactionVersion: 0 },
          );
          console.log("Transactions fetched:", txs.length);

          if (txs.length === 0) {
            console.log("No transactions found, retrying...");
            retries++;
            await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait 1 second before retrying
            continue;
          }

          return txs;
        } catch (error) {
          console.error("Error fetching data:", error);
          retries++;
          if (retries >= maxRetries) {
            throw error;
          }
        }
      }

      return []; // Return empty array if all retries fail
    },
    enabled: !!ataAddPubkey,
    staleTime: 60000, // Data will be considered fresh for 1 minute
    retry: 3, // React Query will retry failed requests 3 times
  });
}

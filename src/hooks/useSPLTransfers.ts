import { useState, useEffect, useCallback } from "react";
import {
  Connection,
  ParsedTransactionWithMeta,
  PublicKey,
} from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { getAssociatedTokenAddress } from "@solana/spl-token";

interface SPLTransfer {
  signature: string;
  source: string;
  destination: string;
  amount: string;
  timestamp: number;
}

const connection = new Connection(
  "https://solana-mainnet.g.alchemy.com/v2/Q9hG9amWf8wxM9S8od2WfcsqF9TvhIn1",
  "confirmed",
);

export function useSPLTransfers(walletAddress: string, tokenMint: string) {
  const [transfers, setTransfers] = useState<SPLTransfer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSPLTransfers = useCallback(async () => {
    if (!walletAddress || !tokenMint) return;

    setLoading(true);
    setError(null);

    try {
      const walletPubkey = new PublicKey(walletAddress);
      const tokenMintPubkey = new PublicKey(tokenMint);
      const ata = await getAssociatedTokenAddress(
        tokenMintPubkey,
        walletPubkey,
      );
      console.log("ATA", ata.toString());
      const signatures = await connection.getSignaturesForAddress(
        walletPubkey,
        {
          limit: 1000,
        },
      );

      console.log("signatures", signatures);
      const transactions = await connection.getParsedTransactions(
        signatures.map((sig) => sig.signature),
        { maxSupportedTransactionVersion: 0 },
      );

      console.log("transactions", transactions);

      const splTransfers = transactions
        .filter((tx): tx is ParsedTransactionWithMeta => tx !== null)
        .flatMap((tx) => {
          return tx.transaction.message.instructions
            .filter(
              (instruction) =>
                "programId" in instruction &&
                instruction.programId.equals(TOKEN_PROGRAM_ID) &&
                "parsed" in instruction &&
                (instruction.parsed.type === "transfer" ||
                  instruction.parsed.type === "transferChecked"),
            )
            .map((instruction) => {
              const { info } = instruction.parsed as any;
              return {
                signature: tx.transaction.signatures[0],
                source: info.source,
                destination: info.destination,
                amount: info.amount,
                timestamp: tx.blockTime ? tx.blockTime * 1000 : Date.now(),
              };
            });
        });

      console.log("splTransfers", splTransfers);

      setTransfers(splTransfers);
    } catch (err) {
      console.error("Error fetching SPL transfers:", err);
      setError("Failed to fetch transfers. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [connection, walletAddress, tokenMint]);

  useEffect(() => {
    fetchSPLTransfers();
  }, [fetchSPLTransfers]);

  return { transfers, loading, error, refetch: fetchSPLTransfers };
}

import { getAssociatedTokenAddressSync } from "@solana/spl-token";

export async function getTxsByToken(mint, wallet) {
  const mintPubKey = new PublicKey(mint);
  const walletPubKey = new PublicKey(wallet);
  const ata = getAssociatedTokenAddressSync(mintPubKey, walletPubKey);
  console.log("ATA", ata.toString());
  const history = await connection.getSignaturesForAddress(ata);
  console.log("history", history);
  const transactions = await connection.getParsedTransactions(
    history.map((sig) => sig.signature),
    { maxSupportedTransactionVersion: 0 },
  );

  console.log("transactions", transactions);
  return history;
}

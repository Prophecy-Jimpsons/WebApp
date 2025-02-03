import { useState, useCallback } from "react";
import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import {
  PublicKey,
  Keypair,
  Connection,
  clusterApiUrl,
  ComputeBudgetProgram,
  Transaction,
} from "@solana/web3.js";
import type { NftProgram } from "@/types/mint";
// import { IDL } from "@/types/mint";

// Constants
// Constants with proper PublicKey initialization
const BUBBLEGUM_PROGRAM_ID = new PublicKey(
  "BGUMAp9Gq7iTEuizy4pqaxsTyUCBK68MDfK752saRPUY",
);
const SPL_NOOP_PROGRAM_ID = new PublicKey(
  "noopb9bkMVfRPU8AsbpTUg8AQkHtKwMYZiFUjNRtMmV",
);
const SPL_COMPRESSION_PROGRAM_ID = new PublicKey(
  "cmtDvXumGCrqC1Age74AVPhSRVXJMd8PJS91L8KbNCK",
);
const EXISTING_MERKLE_TREE = new PublicKey(
  "3VqhwP4KAgD29gEb4H4KjMspDrKaLDfe5QFeVGBW3Xm2",
);

export interface MintNFTParams {
  name: string;
  symbol: string;
  uri: string;
  allocation?: number;
}

export interface MintNFTResult {
  success: boolean;
  signature?: string;
  error?: string;
  leafOwner?: string;
  merkleTree?: string;
  treeAuthority?: string;
}

export const IDL: NftProgram = {
  version: "0.1.0",
  name: "nft_program",
  instructions: [
    {
      name: "mintCnft",
      accounts: [
        {
          name: "treeAuthority",
          isMut: true,
          isSigner: false,
        },
        {
          name: "leafOwner",
          isMut: true,
          isSigner: true,
        },
        {
          name: "leafDelegate",
          isMut: true,
          isSigner: true,
        },
        {
          name: "merkleTree",
          isMut: true,
          isSigner: false,
        },
        {
          name: "payer",
          isMut: true,
          isSigner: true,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "logWrapper",
          isMut: false,
          isSigner: false,
        },
        {
          name: "compressionProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "mintRecord",
          isMut: true,
          isSigner: false,
        },
        {
          name: "bubblegumProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "name",
          type: "string",
        },
        {
          name: "symbol",
          type: "string",
        },
        {
          name: "uri",
          type: "string",
        },
        {
          name: "jimpAllocation",
          type: "u64",
        },
      ],
    },
  ],
  types: [
    {
      name: "MetadataArgs",
      type: {
        kind: "struct",
        fields: [
          {
            name: "name",
            type: "string",
          },
          {
            name: "symbol",
            type: "string",
          },
          {
            name: "uri",
            type: "string",
          },
          {
            name: "collectionKey",
            type: {
              option: "publicKey",
            },
          },
          {
            name: "creators",
            type: {
              vec: {
                defined: "Creator",
              },
            },
          },
          {
            name: "editionNonce",
            type: {
              option: "u8",
            },
          },
          {
            name: "uses",
            type: {
              option: {
                defined: "Uses",
              },
            },
          },
          {
            name: "primarySaleHappened",
            type: "bool",
          },
          {
            name: "isMutable",
            type: "bool",
          },
          {
            name: "sellerFeeBasisPoints",
            type: "u16",
          },
        ],
      },
    },
    {
      name: "Creator",
      type: {
        kind: "struct",
        fields: [
          {
            name: "address",
            type: "publicKey",
          },
          {
            name: "verified",
            type: "bool",
          },
          {
            name: "share",
            type: "u8",
          },
        ],
      },
    },
    {
      name: "Uses",
      type: {
        kind: "struct",
        fields: [
          {
            name: "useMethod",
            type: {
              defined: "UseMethod",
            },
          },
          {
            name: "remaining",
            type: "u64",
          },
          {
            name: "total",
            type: "u64",
          },
        ],
      },
    },
    {
      name: "UseMethod",
      type: {
        kind: "enum",
        variants: [
          {
            name: "Burn",
          },
          {
            name: "Multiple",
          },
          {
            name: "Single",
          },
        ],
      },
    },
    {
      name: "MintError",
      type: {
        kind: "enum",
        variants: [
          {
            name: "InvalidMetadata",
          },
          {
            name: "InvalidAllocation",
          },
          {
            name: "MintFailed",
          },
        ],
      },
    },
  ],
  errors: [
    {
      code: 6000,
      name: "InvalidMetadata",
      msg: "Invalid metadata provided",
    },
    {
      code: 6001,
      name: "InvalidAllocation",
      msg: "Invalid allocation amount",
    },
    {
      code: 6002,
      name: "InvalidMerkleTree",
      msg: "Invalid merkle tree",
    },
    {
      code: 6003,
      name: "MintFailed",
      msg: "Mint failed",
    },
  ],
};

/**
 * Hook for minting compressed NFTs on Solana
 */
export const useMintNFT = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<MintNFTResult | null>(null);

  const mintNFT = useCallback(
    async ({
      name,
      symbol,
      uri,
      allocation = 100,
    }: MintNFTParams): Promise<MintNFTResult> => {
      setIsLoading(true);
      setError(null);

      let treeAuthority: PublicKey | undefined;

      try {
        // Check wallet connection
        if (!window.solana?.publicKey) {
          throw new Error("Wallet not connected");
        }

        // Setup connection with specific commitment
        const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

        // Check wallet balance
        const balance = await connection.getBalance(window.solana.publicKey);
        console.log("Wallet balance:", balance / anchor.web3.LAMPORTS_PER_SOL);

        // Setup provider
        const provider = new anchor.AnchorProvider(connection, window.solana, {
          commitment: "confirmed",
        });
        anchor.setProvider(provider);

        // Initialize program
        const NFT_PROGRAM_ID = new PublicKey(
          "B67duxe4Db484Z9kaVc65ydsQm3rWrpbS7xfgQHE9ZY",
        );
        const program = new Program(IDL, NFT_PROGRAM_ID, provider);

        // Verify merkle tree
        const treeAccount =
          await connection.getAccountInfo(EXISTING_MERKLE_TREE);
        if (!treeAccount) {
          throw new Error("Merkle tree not found");
        }

        // Derive tree authority
        const [treeAuthority] = PublicKey.findProgramAddressSync(
          [EXISTING_MERKLE_TREE.toBuffer()],
          BUBBLEGUM_PROGRAM_ID,
        );

        // Create mint instruction
        const mintIx = await program.methods
          .mintCnft(name, symbol.toUpperCase(), uri, new anchor.BN(allocation))
          .accounts({
            treeAuthority,
            leafOwner: provider.wallet.publicKey,
            leafDelegate: provider.wallet.publicKey,
            merkleTree: EXISTING_MERKLE_TREE,
            payer: provider.wallet.publicKey,
            systemProgram: anchor.web3.SystemProgram.programId,
            logWrapper: SPL_NOOP_PROGRAM_ID,
            compressionProgram: SPL_COMPRESSION_PROGRAM_ID,
            mintRecord: Keypair.generate().publicKey,
            bubblegumProgram: BUBBLEGUM_PROGRAM_ID,
          })
          .instruction();

        // Setup compute budget
        const modifyComputeUnits = ComputeBudgetProgram.setComputeUnitLimit({
          units: 400000,
        });

        const addPriorityFee = ComputeBudgetProgram.setComputeUnitPrice({
          microLamports: 50000,
        });

        // Build transaction
        const transaction = new Transaction();
        transaction.add(modifyComputeUnits);
        transaction.add(addPriorityFee);
        transaction.add(mintIx);

        // Get recent blockhash
        const { blockhash, lastValidBlockHeight } =
          await connection.getLatestBlockhash("finalized");

        transaction.recentBlockhash = blockhash;
        transaction.lastValidBlockHeight = lastValidBlockHeight;
        transaction.feePayer = provider.wallet.publicKey;

        // Sign and send transaction
        const signature = await provider.sendAndConfirm(transaction, [], {
          commitment: "finalized",
          skipPreflight: true,
          maxRetries: 3,
          minContextSlot: await connection.getSlot(),
        });

        console.log("Transaction successful:", signature);

        const mintResult: MintNFTResult = {
          success: true,
          signature,
          leafOwner: provider.wallet.publicKey.toString(),
          merkleTree: EXISTING_MERKLE_TREE.toString(),
          treeAuthority: treeAuthority.toString(),
        };

        setResult(mintResult);
        return mintResult;
      } catch (err) {
        console.error("Detailed mint error:", {
          error: err,
          message: err instanceof Error ? err.message : "Unknown error",
          accounts: {
            wallet: window.solana?.publicKey?.toString(),
            merkleTree: EXISTING_MERKLE_TREE.toString(),
            treeAuthority: treeAuthority?.toString(),
          },
        });

        const errorMessage =
          err instanceof Error ? err.message : "Unknown error occurred";
        setError(errorMessage);

        const errorResult: MintNFTResult = {
          success: false,
          error: errorMessage,
        };
        setResult(errorResult);
        return errorResult;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  return { mintNFT, isLoading, error, result };
};

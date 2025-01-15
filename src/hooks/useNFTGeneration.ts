import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { generateNFT } from "@/services/ai/nft";

export interface IPFSResponse {
  cid: string;
  url: string;
}

export interface AIGenerationResponse {
  status: string;
  ipfs: IPFSResponse;
  prompt: string;
}

export const useNFTGeneration = (): UseMutationResult<
  AIGenerationResponse,
  Error,
  string,
  unknown
> => {
  return useMutation({
    mutationFn: generateNFT,
    onError: (error: Error) => {
      console.error("NFT generation failed:", error);
    },
    retry: (failureCount, error) => {
      if (error.message.includes("rate limit") && failureCount < 2) {
        return true;
      }
      return false;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
  });
};

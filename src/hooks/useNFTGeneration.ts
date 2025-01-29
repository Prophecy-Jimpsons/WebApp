import { useMutation } from "@tanstack/react-query";
import { generateNFT } from "@/services/ai/nft";

export interface IPFSResponse {
  cid: string;
  url: string;
}

export interface AIGenerationResponse {
  status: string;
  ipfs: IPFSResponse;
  prompt: string;
  "Image hash": string;
}

export const useNFTGeneration = () => {
  const {
    data: generatedNFT,
    mutate: nftGenerate,
    isLoading,
    error: generationError,
    reset: resetGeneration,
  } = useMutation({
    mutationKey: ["nft-generation"],
    mutationFn: generateNFT,
    onError: (error: Error) => {
      console.error("NFT generation failed:", error);
    },
    retry: 1,
  });
  return {
    nftGenerate,
    isLoading,
    generationError,
    resetGeneration,
    generatedNFT,
  };
};

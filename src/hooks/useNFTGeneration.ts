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
    // onSuccess: () => {
    //   console.log("successfully generated NFT");
    // },
    retry: 3,
    retryDelay: 1500,
  });
  return {
    nftGenerate,
    isLoading,
    generationError,
    resetGeneration,
    generatedNFT,
  };
};

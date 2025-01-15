import { useMutation } from "@tanstack/react-query";
import { generateNFT } from "@/services/ai/nft";

export const useNFTGeneration = () => {
  return useMutation({
    mutationFn: generateNFT,
    onError: (error) => {
      console.error("NFT generation failed:", error);
    },
    retry: 2,
    retryDelay: 1000,
  });
};

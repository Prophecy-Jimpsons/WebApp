interface NFTResponse {
  success: boolean;
  data: {
    imageUrl: string;
    ipfsHash: string;
    prompt: string;
    metadata: {
      name: string;
      description: string;
      timestamp: number;
    };
  };
}

export const generateNFT = async (prompt: string): Promise<NFTResponse> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 2000));

  return {
    success: true,
    data: {
      imageUrl:
        "https://then-purple-vole.myfilebase.com/ipfs/QmTkHaifRQ3JH2sgehkEjfPpocqwjewqGMX2CZUoozogB1",
      ipfsHash: "QmTkHaifRQ3JH2sgehkEjfPpocqwjewqGMX2CZUoozogB1",
      prompt,
      metadata: {
        name: `NFT #${Math.abs(prompt.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) % 10000)}`,
        description: prompt,
        timestamp: Date.now(),
      },
    },
  };
};

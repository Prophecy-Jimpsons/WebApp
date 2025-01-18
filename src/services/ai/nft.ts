import { SERVER_BASE_URL } from "@/config/constants";

export interface GenerateNFTRequest {
  prompt: string;
  steps: number;
  guidance_scale: number;
  height: number;
  width: number;
}

export interface IPFSResponse {
  cid: string;
  url: string;
}

export interface AIGenerationResponse {
  status: string;
  ipfs: IPFSResponse;
  prompt: string;
}

export const generateNFT = async (
  prompt: string,
): Promise<AIGenerationResponse> => {
  try {
    const requestBody: GenerateNFTRequest = {
      prompt,
      steps: 30,
      guidance_scale: 10.0,
      height: 512,
      width: 512,
    };

    const response = await fetch(`${SERVER_BASE_URL}/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });
    console.log(response.body);

    if (!response.ok) {
      throw new Error("Failed to generate image");
    }

    const aiResponse = await response.json();
    return aiResponse;
  } catch (error) {
    throw new Error(
      `Failed to generate NFT: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
};

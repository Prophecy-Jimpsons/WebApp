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
  "Image hash": string;
}

export const generateNFT = async (
  prompt: string,
): Promise<AIGenerationResponse> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 6000); // 6 seconds timeout
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
      signal: controller.signal, // Attach the AbortController signal
    });

    clearTimeout(timeoutId); // Clear the timeout if the request completes

    if (!response.ok) {
      throw new Error("Failed to generate image");
    }

    const aiResponse = await response.json();
    return aiResponse;
  } catch (error) {
    clearTimeout(timeoutId); // Clear the timeout if the request fails
    throw new Error(
      `Failed to generate NFT: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
};

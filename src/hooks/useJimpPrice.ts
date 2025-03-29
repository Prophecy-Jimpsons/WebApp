import { useQuery } from "@tanstack/react-query";

// Define the API endpoint
const JIMP_API_URL =
  "https://api.geckoterminal.com/api/v2/networks/solana/tokens/D86WEcSeM4YkQKqP6LLLt8bRypbJnaQcPUxHAVsopump";

export function useGetJimpPriceUSD() {
  const {
    data: jimpPriceUSD,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["jimp-price-usd"],
    queryFn: async () => {
      try {
        const response = await fetch(JIMP_API_URL);

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const jimpJson = await response.json();
        const jimpPriceUSD = jimpJson?.data?.attributes?.price_usd;
        return jimpPriceUSD;
      } catch (error) {
        console.error("Error fetching balance:", error);
        throw error;
      }
    },
  });
  return { jimpPriceUSD, isLoading, error };
}

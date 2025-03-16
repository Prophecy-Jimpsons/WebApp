/* eslint-disable @typescript-eslint/ban-ts-comment */
/**
 * Gets environment variables safely from multiple sources
 * @param key The environment variable key to get
 * @returns The environment variable value or empty string
 */
export function getEnv(key: string): string {
    // Try window.ENV_CONFIG first (for production)
    if (window.ENV_CONFIG) {
      // Use type assertion to tell TypeScript this is a valid index
      const value = window.ENV_CONFIG[key as keyof typeof window.ENV_CONFIG];
      if (value) return value;
    }
    
    // Try Vite env vars (for development)
    const viteKey = `VITE_${key}`;
    
    // We need to access import.meta.env properties safely
    // @ts-ignore
    const viteValue = import.meta.env[viteKey];
    if (viteValue) {
      return viteValue;
    }
    
    // Nothing found
    console.warn(`Environment variable ${key} not found`);
    return "";
  }
  
  /**
   * Gets the Syndica API URL with the API key
   */
  export function getSyndicaUrl(): string {
    const apiKey = getEnv('SYNDICA_API_KEY');
    console.log(`API key from env.ts: ${apiKey}`)
    return `https://solana-mainnet.api.syndica.io/api-key/${apiKey}`;
  }
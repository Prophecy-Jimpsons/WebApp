// src/types.ts
export interface GeneratedNFT {
    ipfs: {
      url: string;
      cid: string;
    };
    prompt: string;
    "Image hash": string;
  }
  
  export interface Metadata {
    cid: string;
    url: string;
    name?: string;
    symbol?: string;
    description?: string;
  }
  
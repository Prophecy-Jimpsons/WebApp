// src/types.ts
export interface GeneratedNFT {
  ipfs: {
    url: string;
    cid: string;
  };
  prompt: string;
  "Image hash": string;
}

export interface MetadataResponse {
  status: string;
  metadata_uri: {
    cid: string;
    url: string;
  };
}

export interface Metadata {
  cid: string;
  url: string;
  name?: string;
  symbol?: string;
  description?: string;
  metadata_uri: {
    cid: string;
    url: string;
  };
}

export interface NFTDocument {
  name: string;
  imageHash: string;
  walletAddress: string;
  prompt?: string;
  metadata_uri: {
    cid: string;
    url: string;
  };
  createdAt: string;
  mintSignature?: string;
}

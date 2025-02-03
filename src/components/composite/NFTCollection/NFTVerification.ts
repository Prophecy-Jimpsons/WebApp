// NFTVerification.ts
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/config/firebase";

export interface NFTMetadata {
  NFTAddress: string;
  OwnerAddress: string;
  name?: string;
  image?: string;
  network: "mainnet" | "devnet";
  verified?: boolean;
  prompt?: string;
  ipfsHash?: string;
  mintSignature?: string;
}

export interface VerificationResult {
  isVerified: boolean;
  message: string;
  details?: {
    firestoreVerified: boolean;
    ipfsVerified?: boolean;
    mintSignature?: string;
  };
}

export class NFTVerificationService {
  static async verifyInFirestore(
    ipfsCid: string,
  ): Promise<{ verified: boolean; mintSignature?: string }> {
    try {
      const nftsRef = collection(db, "nfts");

      // First try with ipfsCid
      let q = query(nftsRef, where("ipfsCid", "==", ipfsCid));
      let querySnapshot = await getDocs(q);

      // If not found, try with imageHash
      if (querySnapshot.empty) {
        q = query(nftsRef, where("imageHash", "==", ipfsCid));
        querySnapshot = await getDocs(q);
      }

      if (querySnapshot.empty) {
        return { verified: false };
      }

      const nftDoc = querySnapshot.docs[0];
      const data = nftDoc.data();

      return {
        verified: true,
        mintSignature: data.mintSignature,
      };
    } catch (error) {
      console.error("Firestore verification failed:", error);
      return { verified: false };
    }
  }

  static async verifyNFT(nft: NFTMetadata): Promise<VerificationResult> {
    try {
      // Try multiple methods to get the identifier
      const ipfsHash = nft.image?.split("/ipfs/")?.[1]?.split("?")?.[0]; // Clean IPFS hash
      const nftAddress = nft.NFTAddress;

      if (!ipfsHash && !nftAddress) {
        return {
          isVerified: false,
          message: "No valid identifier found",
          details: {
            firestoreVerified: false,
          },
        };
      }

      // Try verification with IPFS hash first, then NFT address
      const { verified: firestoreVerified, mintSignature } =
        await this.verifyInFirestore(ipfsHash || nftAddress);

      return {
        isVerified: firestoreVerified,
        message: firestoreVerified
          ? "NFT verification successful"
          : "NFT not found in records",
        details: {
          firestoreVerified,
          mintSignature,
        },
      };
    } catch (error) {
      console.error("Verification process failed:", error);
      return {
        isVerified: false,
        message: "Verification process failed",
        details: {
          firestoreVerified: false,
        },
      };
    }
  }
}

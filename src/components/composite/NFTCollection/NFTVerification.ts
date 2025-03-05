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
      console.log("Verifying in Firestore with ipfsCid:", ipfsCid);
      if (!ipfsCid) {
        return { verified: false };
      }
      
      const nftsRef = collection(db, "nfts");

      // First try with ipfsCid
      let q = query(nftsRef, where("ipfsCid", "==", ipfsCid));
      let querySnapshot = await getDocs(q);
      
      console.log(`Firestore ipfsCid query found ${querySnapshot.size} documents`);

      // If not found, try with imageHash
      if (querySnapshot.empty) {
        q = query(nftsRef, where("imageHash", "==", ipfsCid));
        querySnapshot = await getDocs(q);
        console.log(`Firestore imageHash query found ${querySnapshot.size} documents`);
      }

      if (querySnapshot.empty) {
        return { verified: false };
      }

      const nftDoc = querySnapshot.docs[0];
      const data = nftDoc.data();
      console.log("Found document in Firestore:", nftDoc.id);

      return {
        verified: true,
        mintSignature: data.mintSignature,
      };
    } catch (error) {
      console.error("Firestore verification failed:", error);
      return { verified: false };
    }
  }

  static async verifyByMintAddress(
    mintAddress: string
  ): Promise<{ verified: boolean; mintSignature?: string }> {
    try {
      console.log("Verifying by mint address:", mintAddress);
      if (!mintAddress) {
        return { verified: false };
      }

      const nftsRef = collection(db, "nfts");
      const q = query(nftsRef, where("mintAddress", "==", mintAddress));
      const querySnapshot = await getDocs(q);
      
      console.log(`Firestore mintAddress query found ${querySnapshot.size} documents`);
      
      if (querySnapshot.empty) {
        // Try again with wallet address as fallback (for NFTs minted by this wallet)
        const q2 = query(nftsRef, where("walletAddress", "==", mintAddress));
        const qs2 = await getDocs(q2);
        console.log(`Firestore walletAddress query found ${qs2.size} documents`);
        
        if (qs2.empty) {
          return { verified: false };
        }
        
        const nftDoc = qs2.docs[0];
        const data = nftDoc.data();
        return {
          verified: true,
          mintSignature: data.mintSignature,
        };
      }

      const nftDoc = querySnapshot.docs[0];
      const data = nftDoc.data();
      console.log("Found document by mint address:", nftDoc.id);

      return {
        verified: true,
        mintSignature: data.mintSignature,
      };
    } catch (error) {
      console.error("Mint address verification failed:", error);
      return { verified: false };
    }
  }

  static async verifyNFT(nft: NFTMetadata): Promise<VerificationResult> {
    try {
      console.log("Starting verification for NFT:", nft);
      
      // Try multiple methods to get identifiers
      const ipfsHash = nft.image?.split("/ipfs/")?.[1]?.split("?")?.[0]; // Clean IPFS hash
      const nftAddress = nft.NFTAddress;
      
      console.log("Extracted identifiers:", { ipfsHash, nftAddress });
      
      if (!ipfsHash && !nftAddress) {
        return {
          isVerified: false,
          message: "No valid identifier found",
          details: {
            firestoreVerified: false,
          },
        };
      }
      
      // Try verification with IPFS hash first
      let firestoreResult = ipfsHash ? await this.verifyInFirestore(ipfsHash) : { verified: false };
      
      // If not found, try with NFT address as mint address
      if (!firestoreResult.verified && nftAddress) {
        console.log("IPFS verification failed, trying mint address...");
        firestoreResult = await this.verifyByMintAddress(nftAddress);
      }
      
      // If still not found and we have owner address, try that as a last resort
      if (!firestoreResult.verified && nft.OwnerAddress) {
        console.log("Mint address verification failed, trying owner address...");
        const nftsRef = collection(db, "nfts");
        const q = query(nftsRef, where("walletAddress", "==", nft.OwnerAddress));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          // Only verify if we have exactly one NFT or it matches by some other criteria
          const matchingNft = querySnapshot.docs.find(doc => {
            const data = doc.data();
            // Additional matching logic could go here
            return data.prompt === nft.name; // Match by prompt/name as fallback
          });
          
          if (matchingNft) {
            const data = matchingNft.data();
            firestoreResult = {
              verified: true,
              mintSignature: data.mintSignature,
            };
          }
        }
      }
      
      const result = {
        isVerified: firestoreResult.verified,
        message: firestoreResult.verified
          ? "NFT verification successful"
          : "NFT not found in records",
        details: {
          firestoreVerified: firestoreResult.verified,
          mintSignature: firestoreResult.mintSignature,
        },
      };
      
      console.log("Verification result:", result);
      return result;
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
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/config/firebase";
import type { NFTDocument } from "../NFTGenerator/types";

export interface IPFSMetadata {
  ipfsCid: string;
  ipfsUrl: string;
  prompt: string;
  walletAddress: string;
  createdAt: string;
}

export const verifyIPFSContent = async (
  imageHash: string,
): Promise<IPFSMetadata | null> => {
  try {
    const nftsRef = collection(db, "nfts");
    const q = query(nftsRef, where("imageHash", "==", imageHash));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0].data() as NFTDocument;

      if (!doc.metadata_uri?.cid) {
        console.error(
          "❌ Firestore Error: IPFS CID is missing in Firestore document!",
          doc,
        );
        return null;
      }

      return {
        ipfsCid: doc.metadata_uri.cid,
        ipfsUrl: doc.metadata_uri.url,
        prompt: doc.name || "Untitled",
        walletAddress: doc.walletAddress,
        createdAt: doc.createdAt,
      };
    }

    console.error("❌ No matching NFT found in Firestore for hash:", imageHash);
    return null;
  } catch (error) {
    console.error("❌ Verification failed:", error);
    return null;
  }
};

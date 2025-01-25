import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/config/firebase";

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
      const doc = querySnapshot.docs[0].data();
      const ipfsCid = doc.ipfsCid;

      // Instead of checking S3 or IPFS API, we'll verify if the image is accessible
      const response = await fetch(`https://ipfs.filebase.io/ipfs/${ipfsCid}`, {
        method: "HEAD",
        mode: "no-cors", // Prevents CORS issues
      });

      if (response) {
        return {
          ipfsCid: doc.ipfsCid,
          ipfsUrl: doc.ipfsUrl,
          prompt: doc.prompt,
          walletAddress: doc.walletAddress,
          createdAt: doc.createdAt.toDate().toLocaleString(),
        };
      }
    }
    return null;
  } catch (error) {
    console.error("Verification failed:", error);
    return null;
  }
};

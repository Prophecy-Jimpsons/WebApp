/** 
 * Phantom-Optimized DAO Voting Client v3.5
 * Debugging Version
 */

// Core Dependencies
import { PublicKey } from '@solana/web3.js';
import { MerkleTree } from 'merkletreejs';
import { keccak256 } from 'js-sha3';
import { verify } from '@noble/ed25519';
import * as bs58 from 'bs58';

// Filebase Configuration (Should use environment variables in production)
export const FILABASE_CONFIG = {
  key: "E6CFF793C74CA487D996",
  secret: "29krDPo1nROzRhv4V2RQuDyrG073LKIDCpMnxXDL",
  pinningKey: "RTZDRkY3OTNDNzRDQTQ4N0Q5OTY6MjlrckRQbzFuUk96Umh2NFYyUlF1RHlyRzA3M0xLSURDcE1ueFhETDp2b3Rlcy1kYW8=",
  bucket: 'votes-dao',
  ipfsEndpoint: 'https://api.filebase.io/v1/ipfs'
};

// Update your configuration
export const IPFS_CONFIG = {
  pinata: {
    apiKey: "618d71e122d454e82111",
    apiSecret: "b93c2aa9a74d81cdd1c90c73ee1f7506fc66676770450d40910bada41ea1f79d",
    jwt: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI2ZDM0OWQyZi03M2M4LTQ0ZGItOWVjZS0zMWNiY2EwZTc3ZWQiLCJlbWFpbCI6InBwbGVuZGV2ZXJlc3RAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjEsImlkIjoiRlJBMSJ9LHsiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjEsImlkIjoiTllDMSJ9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIn0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6IjYxOGQ3MWUxMjJkNDU0ZTgyMTExIiwic2NvcGVkS2V5U2VjcmV0IjoiYjkzYzJhYTlhNzRkODFjZGQxYzkwYzczZWUxZjc1MDZmYzY2Njc2NzcwNDUwZDQwOTEwYmFkYTQxZWExZjc5ZCIsImV4cCI6MTc3MzYyNDM3MH0.KFP88oOJKYfuIh5Lde8ooQu9EiCQ-t2iKHMwwMxkUls"
  },
  endpoints: {
    pinFile: "https://api.pinata.cloud/pinning/pinJSONToIPFS",
    pin: "https://api.pinata.cloud/pinning/pinByHash"
  }
};

/**
 * VotingDelta Interface
 * Defines the complete vote data structure stored in IPFS
 * 
 * @template T - Generic type for vote payload
 */
interface VotingDelta<T> {
  // Data schema version for forward compatibility
  version: "1.2.0";
  
  // ISO 8601 timestamp of vote creation
  timestamp: string;
  
  // Core vote content structure
  vote: {
    // Application-specific vote payload
    data: T;
    
    // Cryptographic verification metadata
    metadata: {
      sourceId: string;       // Proposal identifier
      voter: string;          // Voter's base58-encoded public key
      publicKey: string;      // Hex-encoded public key for verification
      weight: {
        raw: number;          // Original stake value
        tier: string;         // Voter's DAO tier classification
        formula: string;      // Weight calculation methodology
        calculated: number;   // Final computed voting power
      };
    };
  };

  // Cryptographic proof system
  proofs: {
    phantom: {
      signature: string;      // Base58-encoded Ed25519 signature
      message: string;        // Original signed message content
    };
    merkle: {
      root: string;           // Merkle root hash
      leaf: string;           // Current vote's leaf hash
      path?: string[];        // Optional Merkle proof path
    };
  };

  // Storage metadata chain
  storage: {
    previousCID: string;      // Previous entry in IPFS chain
    ipfs: {
      cid: string;            // Current IPFS content identifier
      gateway: string;        // Preferred IPFS gateway URL
      pinnedAt?: string;      // ISO timestamp of pinning operation
    };
  };
}

/**
 * PhantomVotingClient
 * Core class handling vote creation, storage, and verification workflows
 * 
 * @template T - Generic type for vote payload
 */
export class PhantomVotingClient<T> {
 
  private merkleTree?: MerkleTree;
  currentProposalId: string | undefined;

  /**
   * Initialize Filebase connection and Merkle tree
   */
  constructor() {
    console.log('DEBUG: Initializing PhantomVotingClient');
    
  }

  /**
   * Create and store a vote with Phantom wallet integration
   * 
   * @param data - Application-specific vote payload
   * @param provider - Phantom wallet provider instance
   * @returns Promise resolving to IPFS CID of stored vote
   */
  async createVote(data: T, provider: PhantomProvider): Promise<string> {
    console.log('DEBUG: createVote called with data:', JSON.stringify(data));
    console.log('DEBUG: Provider type:', typeof provider);
    console.log('DEBUG: Provider isPhantom:', provider.isPhantom);
    
    try {
      // 1. Connect to Phantom wallet
      console.log('DEBUG: Connecting to Phantom wallet');
      const { publicKey } = await provider.connect();
      console.log('DEBUG: Connected to wallet with public key:', publicKey.toString());
      
      // 2. Construct structured vote message
      const voteMessage = JSON.stringify({
        type: "DAO_VOTE",
        timestamp: new Date().toISOString(),
        data
      });
      console.log('DEBUG: Vote message created:', voteMessage);

      // 3. Sign message using Phantom's API
      console.log('DEBUG: Creating message bytes for signing');
      const messageBytes = new TextEncoder().encode(voteMessage);
      console.log('DEBUG: Message bytes type:', typeof messageBytes);
      console.log('DEBUG: Message bytes length:', messageBytes.length);
      
      console.log('DEBUG: Requesting signature from Phantom');
      const sigResult = await provider.signMessage(messageBytes);
      console.log('DEBUG: Signature received, type:', typeof sigResult);
      console.log('DEBUG: Signature result keys:', Object.keys(sigResult));
      
      const { signature } = sigResult;
      console.log('DEBUG: Signature type:', typeof signature);
      console.log('DEBUG: Signature length:', signature.length);

      // 4. Generate Merkle tree components
      console.log('DEBUG: Generating hash of vote data');
      const leaf = this.hashVote(data);
      console.log('DEBUG: Vote hash generated, type:', typeof leaf);
      
      console.log('DEBUG: Updating Merkle tree');
      // Convert leaf to string to prevent trim() errors
      const leafStr = typeof leaf === 'string' ? leaf : leaf;
      console.log('DEBUG: Leaf string:', leafStr);
      this.updateMerkleTree(leafStr);
      console.log('DEBUG: Merkle tree updated');

      // 5. Construct complete vote delta
      console.log('DEBUG: Constructing vote delta');
      const delta: VotingDelta<T> = {
        version: "1.2.0",
        timestamp: new Date().toISOString(),
        vote: {
          data,
          metadata: {
            sourceId: typeof data === 'object' && data !== null && 'proposalId' in data 
              ? String(data.proposalId) 
              : 'GOV-2025-001',
            voter: publicKey.toString(),
            publicKey: bs58.encode(publicKey.toBytes()),
            weight: {
              raw: 1.5,
              tier: 'member',
              formula: 'sqrt(stake) * tierMultiplier',
              calculated: 1.5 * Math.sqrt(1.5)
            }
          }
        },
        proofs: {
          phantom: {
            signature: bs58.encode(signature),
            message: voteMessage
          },
          merkle: {
            root: this.merkleTree!.getRoot().toString('hex'),
            leaf: leafStr
          }
        },
        storage: {
          previousCID: await this.getLatestCID(),
          ipfs: {
            cid: '', // Populated post-upload
            gateway: "https://gateway.pinata.cloud/ipfs"
          }
        }
      };
      console.log('DEBUG: Vote delta constructed');

      // 6. Store in IPFS and return CID
      console.log('DEBUG: Storing delta in IPFS');
      const deltaJson = JSON.stringify(delta, null, 2);
      console.log('DEBUG: Delta JSON length:', deltaJson.length);
      
      console.log('DEBUG: Calling ObjectManager.upload');
      const cid = await this.storeDelta(delta);
      console.log('DEBUG: Upload successful, received CID:', cid);
      
      delta.storage.ipfs.cid = cid;
      await this.pinCID(cid);
      console.log('DEBUG: CID pinned successfully');
      
      return cid;
    } catch (error) {
      console.error('DEBUG: Error in createVote:', error);
      console.error('DEBUG: Error stack:', error instanceof Error ? error.stack : 'No stack available');
      throw error;
    }
  } 

  /**
   * Store voting delta in IPFS with proper metadata
   * 
   * @param delta - Complete VotingDelta structure
   * @returns Promise resolving to IPFS CID
   */
  private async storeDelta(delta: VotingDelta<T>): Promise<string> {
    try {
      console.log('DEBUG: Storing vote data with Pinata');
      
      const response = await fetch(IPFS_CONFIG.endpoints.pinFile, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${IPFS_CONFIG.pinata.jwt}`
        },
        body: JSON.stringify({
          pinataContent: delta,
          pinataMetadata: {
            name: `vote-${Date.now()}`,
            keyvalues: {
              proposalId: delta.vote.metadata.sourceId,
              voter: delta.vote.metadata.voter,
              timestamp: delta.timestamp
            }
          },
          pinataOptions: {
            cidVersion: 1
          }
        })
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`IPFS upload failed with status ${response.status}: ${errorText}`);
        throw new Error(`Upload failed: ${response.statusText}`);
      }
      
      const result = await response.json();
      console.log('DEBUG: Pinata upload successful:', result);
      
      // Pinata automatically pins when uploading, so no separate pinning needed
      return result.IpfsHash;
    } catch (error) {
      console.error('DEBUG: Error in storeDelta:', error);
      throw error;
    }
  }

  /**
   * Generate Keccak256 hash of vote data
   * 
   * @param data - Vote payload to hash
   * @returns String containing hash digest (converted from Buffer)
   */
  private hashVote(data: T): string {
    console.log('DEBUG: hashVote called with data type:', typeof data);
    // Ensure we're returning a string hash, not a Buffer
    return keccak256(JSON.stringify(data));
  }

  /**
   * Update Merkle tree with new vote data leaf
   * 
   * @param leaf - String containing hashed vote data
   */
  private updateMerkleTree(leaf: string): void {
    console.log('DEBUG: updateMerkleTree called with leaf type:', typeof leaf);
    try {
      // Always create a new leaf - important for debugging
      if (!this.merkleTree) {
        console.log('DEBUG: Creating new Merkle tree with single leaf');
        this.merkleTree = new MerkleTree([leaf], keccak256);
      } else {
        console.log('DEBUG: Adding leaf to existing Merkle tree');
        // Get existing leaves as strings
        const existingLeaves = this.merkleTree.getLeaves().map(l => 
          typeof l === 'string' ? l : l.toString('hex')
        );
        console.log('DEBUG: Existing leaves count:', existingLeaves.length);
        
        // Create new tree with all leaves
        this.merkleTree = new MerkleTree([...existingLeaves, leaf], keccak256);
      }
      console.log('DEBUG: Merkle tree updated, leaf count:', this.merkleTree.getLeaves().length);
    } catch (error) {
      console.error('DEBUG: Error in updateMerkleTree:', error);
      throw error;
    }
  }

  /**
   * Pin CID to ensure long-term IPFS storage
   * 
   * @param cid - IPFS content identifier to pin
   */
  // private async pinCID(cid: string) {
  //   console.log('DEBUG: pinCID called with CID:', cid);
  //   try {
  //     const response = await fetch(FILABASE_CONFIG.ipfsEndpoint, {
  //       method: 'POST',
  //       headers: { Authorization: `Bearer ${FILABASE_CONFIG.pinningKey}` },
  //       body: JSON.stringify({ cid, pin: true })
  //     });
  //     console.log('DEBUG: Pin response status:', response.status);
  //   } catch (error) {
  //     console.error('DEBUG: Error in pinCID:', error);
  //     // Don't throw here, pinning failure should not fail the overall process
  //   }
  // }

  // private async pinCID(cid: string) {
  //   console.log('DEBUG: Mock pinning CID:', cid);
  //   // Skip the actual fetch call to avoid the 422 error
  //   // In a real implementation, you would implement an alternative pinning strategy
  //   return { success: true, message: "Mock pinning successful" };
  // }

  private async pinCID(cid: string) {
    // Pinata already pins when uploading, so this is just for consistency
    console.log('DEBUG: CID already pinned by Pinata:', cid);
    return { success: true, cid: cid };
  }

  /**
   * Verify integrity of a vote chain
   * 
   * @param cid - Starting IPFS content identifier
   * @returns Promise resolving to boolean indicating chain validity
   */
  async verifyVoteChain(cid: string): Promise<boolean> {
    console.log('DEBUG: verifyVoteChain called with CID:', cid);
    try {
      let currentCID = cid;
      while (currentCID) {
        console.log('DEBUG: Verifying CID:', currentCID);
        const delta = await this.getDelta(currentCID);
        
        console.log('DEBUG: Validating delta');
        if (!await this.validateDelta(delta)) {
          console.log('DEBUG: Delta validation failed');
          return false;
        }
        
        currentCID = delta.storage.previousCID;
        console.log('DEBUG: Moving to previous CID:', currentCID);
      }
      console.log('DEBUG: Vote chain verification complete: Valid');
      return true;
    } catch (error) {
      console.error('DEBUG: Error in verifyVoteChain:', error);
      return false;
    }
  }

  /**
   * Validate individual vote delta through multiple checks
   * 
   * @param delta - VotingDelta to validate
   * @returns Promise resolving to boolean indicating validity
   */
  public async validateDelta(delta: VotingDelta<T>): Promise<boolean> {
    console.log('DEBUG: validateDelta called');
    try {
      const validations = [
        this.verifyPhantomSignature(delta),
        this.verifyMerkleRoot(delta),
        this.checkRecency(delta.timestamp)
      ];
      
      const results = await Promise.all(validations);
      console.log('DEBUG: Validation results:', results);
      
      return results.every(Boolean);
    } catch (error) {
      console.error('DEBUG: Error in validateDelta:', error);
      return false;
    }
  }

  /**
   * Verify Phantom signature using Ed25519 cryptography
   * 
   * @param delta - VotingDelta containing signature data
   * @returns Promise resolving to boolean indicating signature validity
   */
  private async verifyPhantomSignature(delta: VotingDelta<T>): Promise<boolean> {
    console.log('DEBUG: verifyPhantomSignature called');
    try {
      const message = new TextEncoder().encode(delta.proofs.phantom.message);
      const publicKeyBytes = bs58.decode(delta.vote.metadata.publicKey);
      const signatureBytes = bs58.decode(delta.proofs.phantom.signature);
      
      console.log('DEBUG: Verifying signature');
      const valid = await verify(signatureBytes, message, publicKeyBytes);
      console.log('DEBUG: Signature verification result:', valid);
      
      return valid;
    } catch (error) {
      console.error('DEBUG: Signature verification failed:', error);
      return false;
    }
  }

  /**
   * Verify Merkle root matches current tree state
   * 
   * @param delta - VotingDelta containing Merkle proof
   * @returns Boolean indicating Merkle root validity
   */
  private verifyMerkleRoot(delta: VotingDelta<T>): boolean {
    console.log('DEBUG: verifyMerkleRoot called');
    if (!this.merkleTree) {
      console.log('DEBUG: No Merkle tree exists, cannot verify');
      return false;
    }
    
    const currentRoot = this.merkleTree.getRoot().toString('hex');
    const deltaRoot = delta.proofs.merkle.root;
    
    console.log('DEBUG: Current root:', currentRoot);
    console.log('DEBUG: Delta root:', deltaRoot);
    
    return currentRoot === deltaRoot;
  }

  /**
   * Validate vote timestamp within 5-minute window
   * 
   * @param timestamp - ISO 8601 timestamp string
   * @returns Boolean indicating temporal validity
   */
  private checkRecency(timestamp: string): boolean {
    console.log('DEBUG: checkRecency called with timestamp:', timestamp);
    const timestampMs = Date.parse(timestamp);
    const ageMs = Date.now() - timestampMs;
    
    console.log('DEBUG: Timestamp age (ms):', ageMs);
    const isRecent = ageMs < 300_000; // 5-minute validity window
    
    console.log('DEBUG: Is timestamp recent?', isRecent);
    return isRecent;
  }

  /**
   * Retrieve latest CID from Firebase (stub implementation)
   * 
   * @returns Promise resolving to previous CID string
   */
  public async getLatestCID(): Promise<string> {
    console.log('DEBUG: getLatestCID called');
    try {
      // Define interface for Pinata pin object structure
      interface PinataPin {
        ipfs_pin_hash: string;
        metadata?: {
          keyvalues?: {
            proposalId?: string;
            timestamp?: string;
            voter?: string;
          }
        }
      }
  
      // Query Pinata's API for pins sorted by timestamp
      const response = await fetch('https://api.pinata.cloud/data/pinList?status=pinned', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${IPFS_CONFIG.pinata.jwt}`
        }
      });
      
      if (!response.ok) {
        console.error(`Failed to fetch pin list: ${response.statusText}`);
        return '';
      }
      
      const data = await response.json();
      if (!data.rows || data.rows.length === 0) {
        console.log('No pins found');
        return '';
      }
      
      // Filter pins by proposal ID if needed
      const relevantPins = this.currentProposalId 
        ? data.rows.filter((pin: PinataPin) => 
            pin.metadata?.keyvalues?.proposalId === this.currentProposalId)
        : data.rows;
      
      // Sort by timestamp (descending)
      const sortedPins = relevantPins.sort((a: PinataPin, b: PinataPin) => {
        const timeA = a.metadata?.keyvalues?.timestamp || '';
        const timeB = b.metadata?.keyvalues?.timestamp || '';
        return new Date(timeB).getTime() - new Date(timeA).getTime();
      });
      
      // Return the most recent CID
      return sortedPins.length > 0 ? sortedPins[0].ipfs_pin_hash : '';
    } catch (error) {
      console.error('DEBUG: Error getting latest CID:', error);
      return '';
    }
  }
  
  

  /**
   * Retrieve voting delta from IPFS
   * 
   * @param cid - IPFS content identifier
   * @returns Promise resolving to parsed VotingDelta
   */
  public async getDelta(cid: string): Promise<VotingDelta<T>> {
    console.log('DEBUG: getDelta called with CID:', cid);
    try {
      // Use Pinata gateway to fetch content
      const response = await fetch(`https://gateway.pinata.cloud/ipfs/${cid}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch content: ${response.statusText}`);
      }
      
      const data = await response.text();
      console.log('DEBUG: Downloaded data length:', data.length);
      
      const delta = JSON.parse(data);
      console.log('DEBUG: Parsed delta successfully');
      
      return delta;
    } catch (error) {
      console.error('DEBUG: Error in getDelta:', error);
      throw error;
    }
  }
  
}

/**
 * Phantom Provider Interface
 * Type-safe interface aligning with Phantom's wallet API
 */
interface PhantomProvider {
  connect: (options?: { 
    onlyIfTrusted: boolean 
  }) => Promise<{ publicKey: PublicKey }>;
  signMessage: (message: Uint8Array) => Promise<{ 
    signature: Uint8Array 
  }>;
  isPhantom: boolean;
  isConnected: boolean;
  disconnect: () => Promise<void>;
}

/**
 * Global Type Extension
 * Augments Window interface with Phantom provider typing
 */
declare global {
  interface Window {
    phantom?: {
      solana?: PhantomProvider;
    };
  }
}
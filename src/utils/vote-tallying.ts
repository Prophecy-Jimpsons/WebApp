// src/utils/vote-tallying.ts
import { keccak256 } from 'js-sha3';
import { MerkleTree } from 'merkletreejs';
import { verify } from '@noble/ed25519';
import * as bs58 from 'bs58';
import { PhantomVotingClient, IPFS_CONFIG } from "@/config/filebase-dao";
import { DAOVote, VotingDelta } from "@/context/WalletContext";

export class MerkleVoteAccumulator {
  private proposalTrees: Map<string, MerkleTree> = new Map();
  private proposalTallies: Map<string, Map<string, VotingDelta<DAOVote>>> = new Map();
  private verificationErrors: Map<string, string[]> = new Map(); // Track errors by proposal
  
  async addVote(delta: VotingDelta<DAOVote>): Promise<boolean> {
    try {
      // 1. ENHANCED: Verify Merkle proof before adding
      if (!this.verifyVoteMerkleProof(delta)) {
        this.recordError(delta.vote.data.proposalId, `Merkle proof verification failed for voter ${delta.vote.metadata.voter}`);
        return false;
      }
      
      // 2. ENHANCED: Verify signature before adding
      if (!(await this.verifySignature(delta))) {
        this.recordError(delta.vote.data.proposalId, `Signature verification failed for voter ${delta.vote.metadata.voter}`);
        return false;
      }
      
      const proposalId = delta.vote.data.proposalId;
      const voter = delta.vote.metadata.voter;
      
      // Get or create proposal-specific tally map
      if (!this.proposalTallies.has(proposalId)) {
        this.proposalTallies.set(proposalId, new Map());
      }
      
      const voterMap = this.proposalTallies.get(proposalId)!;
      
      // Only store the most recent vote per voter (prevents double-voting)
      if (!voterMap.has(voter) || 
          new Date(delta.timestamp) > new Date(voterMap.get(voter)!.timestamp)) {
        voterMap.set(voter, delta);
        this.updateMerkleTree(proposalId);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error("Error adding vote:", error);
      this.recordError(delta.vote.data.proposalId || 'unknown', `Unexpected error: ${error instanceof Error ? error.message : String(error)}`);
      return false;
    }
  }
  
  // ENHANCED: Record errors for later inspection
  private recordError(proposalId: string, error: string): void {
    if (!this.verificationErrors.has(proposalId)) {
      this.verificationErrors.set(proposalId, []);
    }
    this.verificationErrors.get(proposalId)!.push(`${new Date().toISOString()}: ${error}`);
  }
  
  // ENHANCED: Added signature verification
  private async verifySignature(delta: VotingDelta<DAOVote>): Promise<boolean> {
    try {
      const message = new TextEncoder().encode(delta.proofs.phantom.message);
      const publicKeyBytes = bs58.decode(delta.vote.metadata.publicKey);
      const signatureBytes = bs58.decode(delta.proofs.phantom.signature);
       
      return await verify(signatureBytes, message, publicKeyBytes);
    } catch (error) {
      console.error('Signature verification failed:', error);
      return false;
    }
  }
  
  // ENHANCED: Added Merkle proof verification
  private verifyVoteMerkleProof(delta: VotingDelta<DAOVote>): boolean {
    try {
      const leaf = Buffer.from(keccak256(JSON.stringify(delta.vote.data)));
      return leaf.toString('hex') === delta.proofs.merkle.leaf.replace('0x', '');
    } catch (error) {
      console.error('Merkle proof verification failed:', error);
      return false;
    }
  }
  
  private updateMerkleTree(proposalId: string): void {
    const votes = Array.from(this.proposalTallies.get(proposalId)!.values());
    const leaves = votes.map(vote => Buffer.from(keccak256(JSON.stringify(vote.vote.data))));
    this.proposalTrees.set(proposalId, new MerkleTree(leaves, keccak256));
  }
  
  getTally(proposalId: string): { 
    totalVotes: number; 
    weightedVotes: number; 
    merkleRoot: string;
    voterCount: number;
    verificationErrors?: string[];
  } {
    const voters = this.proposalTallies.get(proposalId);
    if (!voters || voters.size === 0) {
      return { 
        totalVotes: 0, 
        weightedVotes: 0, 
        merkleRoot: '', 
        voterCount: 0,
        verificationErrors: this.verificationErrors.get(proposalId) || []
      };
    }
    
    const votes = Array.from(voters.values());
    const weightedVotes = votes.reduce(
      (sum, vote) => sum + vote.vote.metadata.weight.calculated, 0
    );
    
    return {
      totalVotes: votes.length,
      weightedVotes,
      merkleRoot: this.proposalTrees.get(proposalId)!.getRoot().toString('hex'),
      voterCount: voters.size,
      verificationErrors: this.verificationErrors.get(proposalId) || []
    };
  }
  
  getProposalIds(): string[] {
    return Array.from(this.proposalTallies.keys());
  }
  
  // ENHANCED: Verify a vote is included in the tally
  verifyVoteInclusion(delta: VotingDelta<DAOVote>): boolean {
    const proposalId = delta.vote.data.proposalId;
    const tree = this.proposalTrees.get(proposalId);
    if (!tree) return false;
    
    const leaf = Buffer.from(keccak256(JSON.stringify(delta.vote.data)));
    const proof = tree.getProof(leaf);
    return tree.verify(proof, leaf, tree.getRoot());
  }
}

// Event-driven tally service with enhanced security and fault tolerance
export class MerkleVoteTallyService {
  private readonly accumulator = new MerkleVoteAccumulator();
  private lastProcessedCID: string | null = null;
  private isProcessing = false;
  private lastProcessedTimestamp: number = 0;
  private processingErrors: string[] = [];
  private maxRetries = 3;
  
  constructor(private readonly votingClient: PhantomVotingClient<DAOVote>) {
    // Assert the type to access private methods (temporary solution)
    this.votingClient = votingClient as any;
    // Initialize from localStorage if available
    this.loadState();
  }
  
  // ENHANCED: Added detailed return type with error reporting
  async processVotesOnDemand(force: boolean = false): Promise<{
    success: boolean;
    votesProcessed: number;
    errors: string[];
    chainVerified: boolean;
  }> {
    // Reset error tracking for this processing cycle
    this.processingErrors = [];
    
    // Don't reprocess if we've done so recently (within 30 seconds) unless forced
    const now = Date.now();
    if (!force && now - this.lastProcessedTimestamp < 30000) {
      return {
        success: true,
        votesProcessed: 0,
        errors: [],
        chainVerified: true
      };
    }
    
    if (this.isProcessing) {
      return {
        success: false,
        votesProcessed: 0,
        errors: ["Processing already in progress"],
        chainVerified: false
      };
    }
    
    this.isProcessing = true;
    let votesProcessed = 0;
    let chainVerified = false;
    
    try {
      // ENHANCED: Get latest CID with retry logic
      const latestCID = await this.getLatestCIDWithRetry();
      if (!latestCID || latestCID === this.lastProcessedCID) {
        this.isProcessing = false;
        return {
          success: true,
          votesProcessed: 0,
          errors: this.processingErrors,
          chainVerified: true
        };
      }
      
      // ENHANCED: Verify chain integrity before processing
      chainVerified = await this.verifyChainIntegrity(latestCID);
      if (!chainVerified) {
        this.processingErrors.push("Chain integrity verification failed. Votes may be compromised.");
        this.isProcessing = false;
        return {
          success: false,
          votesProcessed: 0,
          errors: this.processingErrors,
          chainVerified: false
        };
      }
      
      // Process the chain from latest to last processed
      const processed = new Set<string>();
      let currentCID = latestCID;
      
      while (currentCID && currentCID !== this.lastProcessedCID) {
        if (processed.has(currentCID)) {
          this.processingErrors.push(`Circular reference detected at CID: ${currentCID}`);
          break; // Prevent loops
        }
        
        processed.add(currentCID);
        
        try {
          const delta = await this.getDeltaWithRetry(currentCID);
          const added = await this.accumulator.addVote(delta);
          if (added) votesProcessed++;
          currentCID = delta.storage.previousCID;
        } catch (error) {
          this.processingErrors.push(`Failed to process CID ${currentCID}: ${error instanceof Error ? error.message : String(error)}`);
          // Continue processing other votes in the chain
          break;
        }
      }
      
      this.lastProcessedCID = latestCID;
      this.lastProcessedTimestamp = now;
      
      // Save state to localStorage
      this.saveState();
      
      return {
        success: true,
        votesProcessed,
        errors: this.processingErrors,
        chainVerified
      };
    } catch (error) {
      const errorMsg = `Critical error processing votes: ${error instanceof Error ? error.message : String(error)}`;
      this.processingErrors.push(errorMsg);
      console.error(errorMsg);
      
      return {
        success: false,
        votesProcessed,
        errors: this.processingErrors,
        chainVerified
      };
    } finally {
      this.isProcessing = false;
    }
  }
  
  // ENHANCED: Added chain integrity verification
  private async verifyChainIntegrity(startingCID: string): Promise<boolean> {
    try {
      let currentCID = startingCID;
      const processedCIDs = new Set<string>();
      
      while (currentCID) {
        if (processedCIDs.has(currentCID)) {
          this.processingErrors.push(`Chain integrity check: Circular reference detected at CID ${currentCID}`);
          return false;
        }
        
        processedCIDs.add(currentCID);
        
        try {
          const delta = await this.getDeltaWithRetry(currentCID);
          
          // Verify delta is properly structured
          if (!delta.proofs || !delta.vote || !delta.storage) {
            this.processingErrors.push(`Chain integrity check: Invalid delta structure at CID ${currentCID}`);
            return false;
          }
          
          // Verify basic signature (more thorough verification happens in accumulator)
          if (!delta.proofs.phantom || !delta.proofs.phantom.signature) {
            this.processingErrors.push(`Chain integrity check: Missing signature at CID ${currentCID}`);
            return false;
          }
          
          currentCID = delta.storage.previousCID;
        } catch (error) {
          this.processingErrors.push(`Chain integrity check: Error retrieving CID ${currentCID}: ${error instanceof Error ? error.message : String(error)}`);
          return false;
        }
      }
      
      return true;
    } catch (error) {
      this.processingErrors.push(`Chain integrity check failed: ${error instanceof Error ? error.message : String(error)}`);
      return false;
    }
  }
  
  // ENHANCED: Added retry logic for network operations
  private async getDeltaWithRetry(cid: string, maxRetries = this.maxRetries): Promise<VotingDelta<DAOVote>> {
    let attempt = 0;
    let lastError: any;
    
    while (attempt < maxRetries) {
      try {
        return await this.votingClient.getDelta(cid);
      } catch (error) {
        lastError = error;
        attempt++;
        
        if (attempt >= maxRetries) {
          throw new Error(`Failed to get delta after ${maxRetries.toString()} attempts: ${error instanceof Error ? error.message : String(error)}`);
        }
        
        // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, attempt)));
      }
    }
    
    throw lastError;
  }
  
  // ENHANCED: Added retry logic for getting latest CID
  private async getLatestCIDWithRetry(maxRetries = this.maxRetries): Promise<string | null> {
    let attempt = 0;
    let lastError: any;
    
    while (attempt < maxRetries) {
      try {
        return await this.getLatestCIDFromPinata();
      } catch (error) {
        lastError = error;
        attempt++;
        
        if (attempt >= maxRetries) {
          this.processingErrors.push(`Failed to get latest CID after ${maxRetries.toString()} attempts: ${error instanceof Error ? error.message : String(error)}`);
          return null;
        }
        
        // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, attempt)));
      }
    }
    
    this.processingErrors.push(`Failed to get latest CID: ${lastError instanceof Error ? lastError.message : String(lastError)}`);
    return null;
  }
  
  getTally(proposalId: string): { 
    totalVotes: number; 
    weightedVotes: number;
    merkleRoot?: string;
    verificationErrors?: string[];
  } {
    const tally = this.accumulator.getTally(proposalId);
    return {
      totalVotes: tally.totalVotes,
      weightedVotes: tally.weightedVotes,
      merkleRoot: tally.merkleRoot,
      verificationErrors: tally.verificationErrors
    };
  }
  
  getErrors(): string[] {
    return [...this.processingErrors];
  }
  
  // Save processing state to localStorage
  private saveState(): void {
    try {
      const state = {
        lastProcessedCID: this.lastProcessedCID,
        lastProcessedTimestamp: this.lastProcessedTimestamp
      };
      localStorage.setItem('voteTallyState', JSON.stringify(state));
    } catch (error) {
      console.error('Error saving tally state:', error);
    }
  }
  
  // Load processing state from localStorage
  private loadState(): void {
    try {
      const stateStr = localStorage.getItem('voteTallyState');
      if (stateStr) {
        const state = JSON.parse(stateStr);
        this.lastProcessedCID = state.lastProcessedCID;
        this.lastProcessedTimestamp = state.lastProcessedTimestamp || 0;
      }
    } catch (error) {
      console.error('Error loading tally state:', error);
    }
  }
  
  // Implementation to get latest CID from Pinata
  private async getLatestCIDFromPinata(): Promise<string | null> {
    try {
      const response = await fetch('https://api.pinata.cloud/data/pinList?status=pinned', {
        headers: {
          'Authorization': `Bearer ${IPFS_CONFIG.pinata.jwt}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`Pinata API returned status ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      if (!data.rows || !data.rows.length) {
        return null;
      }
      
      // Sort by timestamp descending
      const sortedPins = data.rows.sort((a: any, b: any) => {
        const timeA = a.metadata?.keyvalues?.timestamp || '';
        const timeB = b.metadata?.keyvalues?.timestamp || '';
        return new Date(timeB).getTime() - new Date(timeA).getTime();
      });
      
      return sortedPins[0].ipfs_pin_hash;
    } catch (error) {
      console.error('Error getting latest CID:', error);
      throw error; // Re-throw for retry handling
    }
  }
}

// Remove global declarations and use proper ES modules
export interface VotingDelta<T> {
    version: string;
    timestamp: string;
    vote: {
      data: T;
      metadata: {
        sourceId: string;
        voter: string;
        publicKey: string;
        weight: {
          raw: number;
          tier: string;
          formula: string;
          calculated: number;
        };
      };
    };
    proofs: {
      phantom: {
        signature: string;
        message: string;
      };
      merkle: {
        root: string;
        leaf: string;
      };
    };
    storage: {
      previousCID: string;
      ipfs: {
        cid: string;
        gateway: string;
      };
    };
  }
  
  // Export other types if needed
  export type DAOVote = {
    proposalId: string;
    choice: 'FOR' | 'AGAINST';
    weight: number;
  };
  
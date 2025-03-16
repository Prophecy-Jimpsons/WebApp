export interface Endpoint {
  category: string;
  url: string;
}

export interface OracleSource {
  id: string;
  title: string;
  validationMethod: string;
  endpoints: Endpoint[];
  totalVotes: number;
  weightedVotes: number;
  // targetVotes: number;
  merkleRoot?: string; // New field for verification
  endDate: string;
  daysLeft?: number;
  progress?: number;
  status?: string;
  voters: { [key: string]: { tier: string } };
  verificationErrors?: string[]; // New field for tracking errors
}

export interface VoteData {
  voter: string;
  source_id: string;
  stake: number;
  tier: string;
}

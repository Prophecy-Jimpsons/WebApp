import { PhantomVotingClient } from "@/config/filebase-dao";
import { DAOVote, VotingDelta } from "@/context/WalletContext";
import { OracleSource } from "@/types/dao";

const VOTE_EXPIRY_DAYS = 10;
const LP_WALLETS = ["5Q544fKrFoe6tsEbD7S8EmxGTJYAKtTVhAW5Q5pge4j1"];
const TIER_MULTIPLIERS = {
  'Diamond': 2.0,
  'Gold': 1.5,
  'Silver': 1.2,
  'Tier 0': 0
};

// Helper functions
const getCurrentExpiry = (): string => {
  const expiry = new Date();
  expiry.setDate(expiry.getDate() + VOTE_EXPIRY_DAYS);
  return expiry.toISOString().split('T')[0];
};

const calculateDaysLeft = (endDate: string): number => {
  const now = new Date();
  const end = new Date(endDate);
  return Math.max(0, Math.ceil((end.getTime() - now.getTime()) / 86400000));
};

const determineStatus = (endDate: string): "active" | "closed" => {
  return new Date(endDate) > new Date() ? "active" : "closed";
};
// Initial data setup with proper function invocation
const initialOracleSources: OracleSource[] = [
  {
    id: "group-1",
    title: "Group 1 Feeds",
    validationMethod: "Multi-Source Verification",
    totalVotes: 0,
    weightedVotes: 0,
    endDate: getCurrentExpiry(),
    endpoints: [
      { category: "News", url: "gdeltproject.org/api/v2/doc/doc" },
      { category: "Crypto", url: "api.nomics.com/v1/currencies/ticker" },
      { category: "Finance", url: "financialmodelingprep.com/api/v3/quote/AAPL" },
      { category: "Sports", url: "thesportsdb.com/api/searchplayers.php" },
      { category: "Politics", url: "api.turbovote.org/elections/upcoming" }
    ],
    voters: {}
  },
  {
    id: "group-2",
    title: "Group 2 Feeds",
    validationMethod: "Multi-Source Verification",
    totalVotes: 0,
    weightedVotes: 0,
    endDate: getCurrentExpiry(),
    endpoints: [
      { category: "News", url: "api.mediastack.com/v1/news" },
      { category: "Crypto", url: "cryptocompare.com/data/pricemulti" },
      { category: "Finance", url: "api.marketstack.com/v1/eod" },
      {
        category: "Sports",
        url: "api.sportradar.com/oddscomparison/{version}/schedules",
      },
      { category: "Politics", url: "api.api-ninjas.com/v1/historicalevents" },
    ],
    voters: {}
  },
  {
    id: "group-3",
    title: "Group 3 Feeds",
    validationMethod: "Multi-Source Verification",
    totalVotes: 0,
    weightedVotes: 0,
    endDate: getCurrentExpiry(),
    endpoints: [
      { category: "News", url: "api.currentsapi.services/v1/latest-news" },
      { category: "Crypto", url: "api.coincap.io/v2/assets" },
      { category: "Finance", url: "cloud.iexapis.com/stable/stock/AAPL/quote" },
      {
        category: "Sports",
        url: "api.football-data.org/v4/competitions/PL/matches",
      },
      {
        category: "Politics",
        url: "opensecrets.org/api/?method=getLegislators",
      },
    ],
    voters: {}
  },
  {
    id: "group-4",
    title: "Group 4 Feeds",
    validationMethod: "Multi-Source Verification",
    totalVotes: 0,
    weightedVotes: 0,
    endDate: getCurrentExpiry(),
    endpoints: [
      { category: "News", url: "newsdata.io/api/1/latest" },
      { category: "Crypto", url: "api.coingecko.com/api/v3/coins/markets" },
      {
        category: "Finance",
        url: "alphavantage.co/query?function=TIME_SERIES_DAILY",
      },
      { category: "Sports", url: "v3.football.api-sports.io/fixtures" },
      {
        category: "Politics",
        url: "googleapis.com/civicinfo/v2/representatives",
      },
    ],
    voters: {}
  }
].map(group => ({
  ...group,
  daysLeft: calculateDaysLeft(group.endDate),
  status: determineStatus(group.endDate)
}));

export const getOracleSources = async (votingHistory: VotingDelta<DAOVote>[]): Promise<OracleSource[]> => {
  // Calculate vote metrics from voting history
  const processedSources = initialOracleSources.map(source => {
    const sourceVotes = votingHistory.filter(
      v => v.vote.data.proposalId === source.id
    );

    return {
      ...source,
      totalVotes: sourceVotes.length,
      weightedVotes: sourceVotes.reduce((sum, vote) => 
        sum + vote.vote.metadata.weight.calculated, 0
      ),
      daysLeft: calculateDaysLeft(source.endDate),
      status: determineStatus(source.endDate)
    };
  });

  return processedSources;
};

export const submitVote = async (
  proposalId: string,
  voter: string,
  stake: number,
  tier: string
): Promise<{ success: boolean; message: string }> => {
  try {
    if (LP_WALLETS.includes(voter)) {
      throw new Error("Liquidity providers cannot vote");
    }

    const votingClient = new PhantomVotingClient<DAOVote>();
    const provider = (window as any).phantom;
    
    if (!provider) {
      throw new Error("Phantom wallet required");
    }

    const voteData: DAOVote = {
      proposalId,
      choice: 'FOR',
      timestamp: new Date().toISOString(),
      stake,
      tier
    };

    await votingClient.createVote(voteData, provider);
    
    return { 
      success: true, 
      message: "Vote successfully stored on IPFS via Filebase" 
    };
  } catch (error) {
    console.error("Voting error:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "IPFS storage failed"
    };
  }
};

// Type validation utilities
export const isVotingDelta = (data: any): data is VotingDelta<DAOVote> => {
  return data?.version?.startsWith('1.') && 
         typeof data?.vote?.metadata?.voter === 'string' &&
         typeof data?.proofs?.phantom?.signature === 'string';
};

export const validateVoteChain = async (cid: string): Promise<boolean> => {
  const votingClient = new PhantomVotingClient<DAOVote>();
  return votingClient.verifyVoteChain(cid);
};
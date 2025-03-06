import { get, push, ref, runTransaction, set, update } from "firebase/database";
import { database } from "../config/firebase-dao";
import { OracleSource } from "../types/dao";

const currentDate = new Date();

const endDate = new Date(currentDate.getTime() + 10 * 24 * 60 * 60 * 1000); // Expiration date is 10 days
const endDateString = endDate.toISOString().split("T")[0];

const initialOracleSources: OracleSource[] = [
  {
    id: "group-1",
    title: "Group 1 Feeds",
    validationMethod: "Multi-Source Verification",
    totalVotes: 0,
    // targetVotes: 20000,
    endDate: endDateString,
    endpoints: [
      { category: "News", url: "gdeltproject.org/api/v2/doc/doc" },
      { category: "Crypto", url: "api.nomics.com/v1/currencies/ticker" },
      {
        category: "Finance",
        url: "financialmodelingprep.com/api/v3/quote/AAPL",
      },
      { category: "Sports", url: "thesportsdb.com/api/searchplayers.php" },
      { category: "Politics", url: "api.turbovote.org/elections/upcoming" },
    ],
    voters: {},
  },
  {
    id: "group-2",
    title: "Group 2 Feeds",
    validationMethod: "Multi-Source Verification",
    totalVotes: 0,
    // targetVotes: 15000,
    endDate: endDateString,
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
    voters: {},
  },
  {
    id: "group-3",
    title: "Group 3 Feeds",
    validationMethod: "Multi-Source Verification",
    totalVotes: 0,
    // targetVotes: 18000,
    endDate: endDateString,
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
    voters: {},
  },
  {
    id: "group-4",
    title: "Group 4 Feeds",
    validationMethod: "Multi-Source Verification",
    totalVotes: 0,
    // targetVotes: 22000,
    endDate: endDateString,
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
    voters: {},
  },
];

// Only initialize the database if it doesn't already exist
export const initializeDatabase = async () => {
  const oracleSourcesRef = ref(database, "oracleSources");
  const snapshot = await get(oracleSourcesRef);

  if (!snapshot.exists()) {
    // console.log("Initializing database with initial data...");
    await set(oracleSourcesRef, initialOracleSources);
    // console.log("Database initialized successfully");
  }
};

export const getOracleSources = async (): Promise<OracleSource[]> => {
  const oracleSourcesRef = ref(database, "oracleSources");
  const snapshot = await get(oracleSourcesRef);

  if (!snapshot.exists()) {
    await initializeDatabase();
    return initialOracleSources;
  }

  const data = snapshot.val();

  // Clean up numeric nodes if they exist
  const numericKeys = Object.keys(data).filter((key) => !isNaN(Number(key)));
  if (numericKeys.length > 0) {
    for (const key of numericKeys) {
      await set(ref(database, `oracleSources/${key}`), null);
    }
  }

  // Filter out numeric keys and only use group-* keys
  const validSources = Object.keys(data)
    .filter((key) => key.startsWith("group-"))
    .map((key) => ({
      ...data[key],
      id: key, // Ensure id is set correctly
      daysLeft: calculateDaysLeft(data[key].endDate),
      status: determineStatus(data[key].endDate),
    }));

  // If we don't have all expected groups, initialize missing ones
  if (validSources.length < 4) {
    const existingIds = validSources.map((source) => source.id);
    const missingGroups = initialOracleSources.filter(
      (source) => !existingIds.includes(source.id),
    );

    // Add missing groups to database
    for (const group of missingGroups) {
      await set(ref(database, `oracleSources/${group.id}`), group);
    }

    // Return all sources including newly added ones
    return [...validSources, ...missingGroups];
  }

  return validSources;
};

export const submitVote = async (voteData: any) => {
  const { source_id, voter, tier } = voteData;
  const oracleSourcesRef = ref(database, "oracleSources");
  const votesRef = ref(database, "votes");

  try {
    // Check if the wallet has already voted in any group
    const snapshot = await get(oracleSourcesRef);
    const data = snapshot.val();

    // Check all groups to see if this wallet has already voted
    for (const groupId in data) {
      if (data[groupId].voters && data[groupId].voters[voter]) {
        // Wallet has already voted
        const previousVoteGroup = data[groupId].title;
        return {
          success: false,
          message: `You have already voted for ${previousVoteGroup}. Each wallet can only vote once.`,
        };
      }
    }

    // If we get here, the wallet hasn't voted yet
    // Store individual vote data
    await push(votesRef, voteData);

    // Update source totals using runTransaction to ensure atomicity
    const groupRef = ref(database, `oracleSources/${source_id}`);
    await runTransaction(groupRef, (currentData) => {
      if (currentData === null) {
        return {
          ...initialOracleSources.find((s) => s.id === source_id),
          totalVotes: 1,
          voters: { [voter]: { tier } },
        };
      }

      const updatedVoters = currentData.voters ? { ...currentData.voters } : {};
      updatedVoters[voter] = { tier };

      return {
        ...currentData,
        totalVotes: (currentData.totalVotes || 0) + 1,
        voters: updatedVoters,
      };
    });

    console.log("Vote submitted successfully");
    return {
      success: true,
      message: "Vote submitted successfully",
    };
  } catch (error) {
    console.error("Error submitting vote:", error);
    return {
      success: false,
      message: "Error submitting vote. Please try again.",
    };
  }
};

export const updateVotes = (groupId: string, newVotes: number) => {
  const groupRef = ref(database, `oracleSources/${groupId}`);
  update(groupRef, { votes: newVotes });
};

const calculateDaysLeft = (endDate: string) => {
  const now = new Date();
  const end = new Date(endDate);
  const diff = end.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
};

// const calculateProgress = (votes: number, targetVotes: number) => {
//   return Math.min(100, Math.round((votes / targetVotes) * 100));
// };

const determineStatus = (
  endDate: string,
  //   votes: number,
  //   targetVotes: number,
): "active" | "ongoing" | "closed" => {
  const now = new Date();
  const end = new Date(endDate);
  if (now > end) return "closed";
  //   if (votes >= targetVotes) return "active";
  //   return "ongoing";
  return "active";
};

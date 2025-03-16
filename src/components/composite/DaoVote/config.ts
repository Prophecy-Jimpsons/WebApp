export const oracleSources = [
  {
    id: "group-1",
    title: "Group 1 Feeds",
    votes: 18000,
    daysLeft: 0,
    progress: 100,
    status: "active",
    validationMethod: "Multi-Source Verification",
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
  },
  {
    id: "group-2",
    title: "Group 2 Feeds",
    votes: 12500,
    daysLeft: 0,
    progress: 100,
    status: "active",
    validationMethod: "Multi-Source Verification",
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
  },
  {
    id: "group-3",
    title: "Group 3 Feeds",
    votes: 9800,
    daysLeft: 5,
    progress: 54,
    status: "ongoing",
    validationMethod: "Multi-Source Verification",
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
  },
  {
    id: "group-4",
    title: "Group 4 Feeds",
    votes: 12500,
    daysLeft: 0,
    progress: 30,
    status: "active",
    validationMethod: "Multi-Source Verification",
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
  },
];

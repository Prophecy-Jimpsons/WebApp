export const oracleSources = [
  {
    id: "source-1",
    title: "Chainlink Price Feeds",
    description:
      "Highly secure price data feeds validated through a 21 Node Consensus mechanism with decentralized validation. Provides reliable financial data across multiple blockchains.",
    author: "chainlink.eth",
    authorImage: "/placeholder.svg?height=40&width=40",
    votes: 18000,
    daysLeft: 0,
    progress: 100,
    status: "active",
    validationMethod: "21 Node Consensus",
  },
  {
    id: "source-2",
    title: "Band Cross-Chain Data",
    description:
      "Cross-chain oracle solution validated by Tendermint Validators with a 48-hour debate period and validator stake slashing for malicious behavior.",
    author: "band.protocol",
    authorImage: "/placeholder.svg?height=40&width=40",
    votes: 12500,
    daysLeft: 0,
    progress: 100,
    status: "active",
    validationMethod: "Tendermint Validators",
  },
  {
    id: "source-3",
    title: "DIA Crowdsourced Feeds",
    description:
      "Community-driven data feeds with source transparency audits and a crowdsourced challenge period. Uses stake-based voting to ensure data quality.",
    author: "dia.data",
    authorImage: "/placeholder.svg?height=40&width=40",
    votes: 9800,
    daysLeft: 5,
    progress: 54,
    status: "closed",
    validationMethod: "Stake-Based Voting",
    additionalInfo: {
      title: "Verification Requirements",
      items: [
        "Source transparency audits",
        "Crowdsourced challenge period",
        "Minimum √100 JIMP staked",
      ],
    },
  },
  {
    id: "source-4",
    title: "Custom API Endpoints",
    description:
      "Custom API integration for specialized data needs, requiring Guardian Audits for validation. Proposed for integration with existing oracle networks.",
    author: "custom.api",
    authorImage: "/placeholder.svg?height=40&width=40",
    votes: 12500,
    daysLeft: 0,
    progress: 30,
    status: "active",
    validationMethod: "Guardian Audits",
  },
];

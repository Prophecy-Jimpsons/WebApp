export interface RoadmapItem {
  title: string;
  items: string[];
}

export interface RoadmapSection {
  subtitle: string;
  items: string[];
  completedItems: number[];
}

export interface RoadmapPhase {
  phase: string;
  title: string;
  timing: string;
  status: "completed" | "current" | "upcoming";
  icon: string;
  items?: string[];
  completedItems?: number[];
  mainItems?: RoadmapSection[];
}

export interface Benefit {
  icon: string;
  text: string;
}

export const benefits: Benefit[] = [
  {
    icon: "gift-solid",
    text: "Special NFT airdrops for Pump.fun participants",
  },
  {
    icon: "crown-solid",
    text: "Enhanced governance rights",
  },
  {
    icon: "star-solid",
    text: "Exclusive access to premium features",
  },
  {
    icon: "bolt-solid",
    text: "Priority trading privileges",
  },
];

export const roadmapData: RoadmapPhase[] = [
  {
    phase: "Phase 1",
    title: "Platform Foundation Phase",
    timing: "Q1 2025",
    status: "completed",
    icon: "rocket-solid",
    mainItems: [
      {
        subtitle: "Platform Launch",
        items: [
          "Token Deployment on Pump.fun",
          "Migrated to Radium",
          "Beta Version of AVAI-Image Generator Released",
          "Beta version of Game Jimp-Tac-Toe Released",
          "Beta version of AVAI-Abhishek's intelligence (14B parameters) Unleased",
          "cNFTs Minted on Testnet",

        ],
        completedItems: [0, 1, 2, 3, 4, 5, 6],
      },
      {
        subtitle: "Game Features",
        items: [
          "Launched Jimp-Tac-Toe ",
          "Implement UI/UX optimization",
          "Play online",
          "Integrate AI opponents",
        ],
        completedItems: [0, 1, 2, 3],
      },
    ],
  },
  {
    phase: "Phase 2",
    title: "Verification & Security Infrastructure Phase",
    timing: "Q2 2025",
    status: "upcoming",
    icon: "chart-line-solid",
    mainItems: [
      {
        subtitle: "AVAI Oracle Development",
        items: [
          "Fine tune AVAI-Oracle model",
          "AVAI's oracle system achieves 99.99% parameter sparsity",
          "Get community approved sources",
          "Implement real-world data integration of approved sources",
          "Create prediction verification system",
          "Achieve 99% accuracy in predictions",
        ],
        completedItems: [],
      },
      {
        subtitle: "Game Features",
        items: [
          "Jimp-Tac-Toe games prediction feature",
          "Implement leaderboard on IPFS and mint its cNFTs",
          "Introduce seasonal events and challenge",
          "Tournament integration",
        ],
        completedItems: [],
      },
      {
        subtitle: "Smart Contracts",
        items: [
          "Vault contract creation",
          "cNFTs mint on mainnet",
        ],
        completedItems: [],
      },
      {
        subtitle: "Security Enhancements",
        items: [
          "Smart contract audits",
          "Tech stack modernization",
        ],
        completedItems: [],
      },
    ],
  },
  {
    phase: "Phase 3",
    title: "Marketplace Expansion & Optimization Phase",
    timing: "Q3 2025",
    status: "upcoming",
    icon: "gear-solid",
    mainItems: [
      {
        subtitle: "Marketplace Development",
        items: [
          "NFT listing/bidding mechanisms",
          "Royalty distribution system",
        ],
        completedItems: [],
      },
      {
        subtitle: "User Experience",
        items: [
          "Advanced filtering and search options",
          "Real-time listing updates",
          "Price history charts",
          "Initial listing of 500-1,000 cNFTs",
        ],
        completedItems: [],
      },
    ],
  },
  {
    phase: "Phase 4",
    title: "Decentralized Governance & Community Growth Phase",
    timing: "Q4 2025",
    status: "upcoming",
    icon: "globe-solid",
    mainItems: [
      {
        subtitle: "DAO Implementation",
        items: [
          "On-chain voting mechanisms",
          "Governance token deployment",
          
        ],
        completedItems: [],
      },
      {
        subtitle: "Community Programs",
        items: [
          "Educational initiatives",
          "Documentation portal launch",
          "Early investor participation program",
          "Future airdrop campaigns for token holders",
        ],
        completedItems: [],
      },
    ],
  },
];

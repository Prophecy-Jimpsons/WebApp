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
    title: "Initial Launch on Pump.fun",
    timing: "Q1 2025",
    status: "upcoming",
    icon: "rocket-solid",
    mainItems: [
      {
        subtitle: "Platform Launch",
        items: [
          "Initial token deployment on Pump.fun platform",
          "Establishment of initial liquidity pools",
          "Launching beta version of AI",
          "Beta version of platform released",
          "Initial community building initiatives",
          "Development of Aira AI model (256.3B parameters)",
          "Implementation of stable diffusion for NFT generation",
          "Compression NFT system for long-term minting",
          "Vault contract development",
        ],
        completedItems: [0, 1, 2, 3, 4, 5, 6, 7],
      },
    ],
  },
  {
    phase: "Phase 2",
    title: "Platform Evolution",
    timing: "Q2 2025",
    status: "upcoming",
    icon: "chart-line-solid",
    mainItems: [
      {
        subtitle: "Oracle Development",
        items: [
          "Fine tune AI model for oracle",
          "Create prediction verification system",
          "Implement real-world data integration",
          "Deploy verification mechanism",
          "Achieve 99% accuracy in predictions",
        ],
        completedItems: [],
      },
      {
        subtitle: "Game Features",
        items: [
          "Launch Jimp Tic-Tac-Toe on Solana",
          "Implement UI/UX optimization",
          "Create leaderboard on IPFS",
          "Integrate AI opponents",
          "Enable weekly free predictions",
        ],
        completedItems: [],
      },
    ],
  },
  {
    phase: "Phase 3",
    title: "Technical Innovation",
    timing: "Q3 2025",
    status: "upcoming",
    icon: "gear-solid",
    mainItems: [
      {
        subtitle: "Core Features",
        items: [
          "Implement listing and bidding mechanisms",
          "Create secure storefront interface",
          "Deploy royalty distribution system",
          "Implement price history tracking",
          "Target 500-1,000 monthly active users",
        ],
        completedItems: [],
      },
      {
        subtitle: "User Experience",
        items: [
          "Advanced filtering and search options",
          "Category-based organization",
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
    title: "Market Expansion",
    timing: "Q4 2025",
    status: "upcoming",
    icon: "globe-solid",
    mainItems: [
      {
        subtitle: "DAO Development",
        items: [
          "Design and develop DAO on Solana",
          "Create governance interface",
          "Establish tokenomics structure",
          "Deploy smart contracts",
          "Complete security audits",
        ],
        completedItems: [],
      },
      {
        subtitle: "Community Building",
        items: [
          "Launch community initiatives",
          "Create educational resources",
          "Deploy governance token",
          "Implement voting mechanisms",
          "Release documentation",
        ],
        completedItems: [],
      },
    ],
  },
];

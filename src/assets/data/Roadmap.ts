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
    items: [
      "Initial token deployment on Pump.fun platform",
      "Establishment of initial liquidity pools",
      "Community building and early adopter rewards",
      "Launch of core prediction features",
    ],
    completedItems: [0, 1],
  },
  {
    phase: "Phase 2",
    title: "Platform Evolution",
    timing: "Q2 2025",
    status: "upcoming",
    icon: "chart-line-solid",
    mainItems: [
      {
        subtitle: "Multi-Chain Expansion",
        items: [
          "Migration to Solana mainnet",
          "Integration with Polygon network",
          "StarkNet integration",
          "Base chain deployment",
          "Development of cross-chain bridges",
          "Launch of proprietary trading platform",
        ],
        completedItems: [1, 3],
      },
      {
        subtitle: "Community Growth",
        items: [
          "Incentive programs for early adopters",
          "Migration support for Pump.fun early investors",
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
        subtitle: "Feature Deployment",
        items: [
          "AI art generation system launch",
          "Prediction verification oracle",
          "Cross-chain trading capabilities",
          "Advanced minting mechanisms",
        ],
        completedItems: [],
      },
      {
        subtitle: "Platform Enhancement",
        items: [
          "Custom DEX integration",
          "Advanced trading features",
          "Enhanced security protocols",
          "Improved user interface",
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
        subtitle: "Ecosystem Development",
        items: [
          "Partnership announcements",
          "Market maker relationships",
          "DAO structure implementation",
          "Community governance activation",
        ],
        completedItems: [],
      },
      {
        subtitle: "Community Initiatives",
        items: [
          "Prophet rewards program",
          "Trading competitions",
          "Community events",
          "Influencer collaborations",
        ],
        completedItems: [],
      },
    ],
  },
];

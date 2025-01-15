const PATHS = {
  // Public routes (accessible without wallet connection)
  PUBLIC: {
    LANDING: "/",
    NOTFOUND: "/not-found",
    APP: "/app",
    MARKETPLACE: "/work-in-progress", //"/marketplace" need to change this
    ROADMAP: "/roadmap",
    BLOG: "/blog",
    CONNECT_WALLET: "/connect-wallet",

    PRIVACY_POLICY: "/privacy-policy",
    TERMS_OF_SERVICE: "/terms-of-service",
    WHITEPAPER: "https://jimpsons.gitbook.io/jimpsons.org",

    WORK_IN_PROGRESS: "/work-in-progress",

    ACCOUNT_DETAILS: "/account-details",
    HOW_TO_BUY: "/how-to-buy",
    AI_NEUTRALITY:
      "https://jimpsons.gitbook.io/jimpsons.org/getting-started/prophecyjimpsons-ai-the-neutral-oracle",
    PREDICTION_GUIDE:
      "https://jimpsons.gitbook.io/jimpsons.org/getting-started/prediction-guide",
    PJ_UNVEILED:
      "https://jimpsons.gitbook.io/jimpsons.org/getting-started/how-prophecyjimpsons-works",

    AI_PREVIEW: "/ai-preview",
  },

  // Protected routes (require wallet connection)
  PROTECTED: {
    DASHBOARD: "/dashboard",
    PREDICTIONS: "/predictions",
    CREATE_PREDICTION: "/predictions/create",
    NFT: "/nft",
    CREATE_NFT: "/nft/create",
    PROFILE: "/profile",
  },
};

export default PATHS;

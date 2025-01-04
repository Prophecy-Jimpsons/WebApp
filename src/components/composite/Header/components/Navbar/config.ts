import PATHS from "@/app/routes/paths";

export const navLinks = [
  { path: PATHS.PUBLIC.LANDING, label: "Home" },
  { path: PATHS.PUBLIC.HOW_TO_BUY, label: "How To Buy" },
  { path: PATHS.PUBLIC.ROADMAP, label: "Roadmap" },
  { path: PATHS.PUBLIC.APP, label: "Application" },
  // { path: PATHS.PROTECTED.PREDICTIONS, label: "Predictions" },
  // { path: PATHS.PROTECTED.NFT, label: "NFTs" },
  // { path: PATHS.PUBLIC.BLOG, label: "Blog" },
] as const;

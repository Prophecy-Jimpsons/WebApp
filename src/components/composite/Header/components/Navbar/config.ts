import PATHS from "@/app/routes/paths";

export const navLinks = [
  { path: PATHS.PUBLIC.LANDING, label: "Home" },
  { path: PATHS.PUBLIC.HOW_TO_BUY, label: "Buy" },
  { path: PATHS.PUBLIC.APP, label: "Application" },
  { path: PATHS.PUBLIC.GAME, label: "Game" },
  { path: PATHS.PUBLIC.AI_CHAT, label: "AVAI Chat" },
  { path: PATHS.PUBLIC.AI_PREVIEW, label: "AI Preview" },
  // { path: PATHS.PROTECTED.PREDICTIONS, label: "Predictions" },
  // { path: PATHS.PROTECTED.NFT, label: "NFTs" },
  // { path: PATHS.PUBLIC.BLOG, label: "Blog" },
] as const;

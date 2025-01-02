import PATHS from "@/app/routes/paths";

export const navLinks = [
  { path: PATHS.PUBLIC.LANDING, label: "Home" },
  { path: PATHS.PUBLIC.MARKETPLACE, label: "Marketplace" },
  // { path: PATHS.PROTECTED.PREDICTIONS, label: "Predictions" },
  // { path: PATHS.PROTECTED.NFT, label: "NFTs" },
  // { path: PATHS.PUBLIC.BLOG, label: "Blog" },
  { path: PATHS.PUBLIC.ROADMAP, label: "Roadmap" },
] as const;

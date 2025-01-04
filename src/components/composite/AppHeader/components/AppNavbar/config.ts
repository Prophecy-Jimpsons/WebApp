import PATHS from "@/app/routes/paths";

export const appNavLinks = [
  { path: PATHS.PUBLIC.APP, label: "Overview" },
  { path: PATHS.PROTECTED.PREDICTIONS, label: "Predictions" },
  { path: PATHS.PROTECTED.CREATE_PREDICTION, label: "Create" },
  { path: PATHS.PROTECTED.NFT, label: "My NFTs" },
  { path: PATHS.PROTECTED.PROFILE, label: "Profile" },
] as const;

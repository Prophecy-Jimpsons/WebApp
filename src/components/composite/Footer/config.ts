import PATHS from "@/app/routes/paths";
import {
  xLogo,
  telegramLogo,
  githubLogo,
  redditLogo,
} from "@/assets/images/SocialLogo";

export const footerLinks = [
  {
    path: PATHS.PUBLIC.PRIVACY_POLICY,
    label: "Privacy Policy",
  },
  {
    path: PATHS.PUBLIC.TERMS_OF_SERVICE,
    label: "Terms of Service",
  },
  {
    path: PATHS.PUBLIC.PJ_UNVEILED,
    label: "PJ Unveiled",
  },
  {
    path: PATHS.PUBLIC.AI_NEUTRALITY,
    label: "AI Neutrality",
  },
  {
    path: PATHS.PUBLIC.PREDICTION_GUIDE,
    label: "Prediction Guide",
  },
];

export const socialLinks = [
  {
    path: "https://t.me/ProphecyJimpsons",
    label: "Telegram",
    icon: telegramLogo,
  },
  {
    path: "https://x.com/PJimpsons",
    label: "X",
    icon: xLogo,
  },
  {
    path: "https://www.reddit.com/r/prophecy_jimpsons/hot/",
    label: "Reddit",
    icon: redditLogo,
  },
  {
    path: "https://github.com/Prophecy-Jimpsons",
    label: "Github",
    icon: githubLogo,
  },
];

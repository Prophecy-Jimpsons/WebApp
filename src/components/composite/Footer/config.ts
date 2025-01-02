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
    path: PATHS.PUBLIC.WHITEPAPER,
    label: "Whitepaper",
  },
];

export const socialLinks = [
  {
    path: "https://t.me/+GpIAuMKh_6xkZjgx",
    label: "Telegram",
    icon: telegramLogo,
  },
  {
    path: "https://x.com/PJimpsons93203",
    label: "X",
    icon: xLogo,
  },
  {
    path: "https://www.reddit.com/r/prophecy_jimpsons/hot/",
    label: "Reddit",
    icon: redditLogo,
  },
  {
    path: "https://github.com/Prophecy-Jimpsons/WebApp",
    label: "Github",
    icon: githubLogo,
  },
];

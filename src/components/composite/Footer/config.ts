import PATHS from "@/app/routes/paths";
import {
  xLogo,
  telegramLogo,
  discordLogo,
  githubLogo,
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
    path: "/",
    label: "Connect Wallet",
    icon: xLogo,
  },
  {
    path: "/",
    label: "Telegram",
    icon: telegramLogo,
  },
  {
    path: "/",
    label: "Discord",
    icon: discordLogo,
  },
  {
    path: "/",
    label: "Github",
    icon: githubLogo,
  },
];

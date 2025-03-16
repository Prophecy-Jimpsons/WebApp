import {
  Wallet,
  Link,
  ArrowRight,
  CreditCard,
  CheckCircle,
  LucideIcon,
  DollarSign,
  Repeat,
  AlertCircle,
} from "lucide-react";
import { step_1, step_2, step_3, step_4 } from "@/assets/images/Howtobuy";

interface Step {
  number: string;
  title: string;
  description: string;
  icon?: LucideIcon;
  image?: string;
}

// Prerequisites - not shown as steps but displayed in prerequisites section
const raydiumPrerequisites = [
  {
    icon: Wallet,
    text: "Install Phantom Wallet",
  },
  {
    icon: DollarSign,
    text: "Have sufficient SOL balance for swap and transaction fees",
  },
];
const anyaltPrerequisites = [
  {
    icon: Wallet,
    text: "You need a Web3 wallet with ETH or other supported cryptocurrencies",
  },
  {
    icon: AlertCircle,
    text: "Ensure you have enough funds to cover the swap amount plus gas fees",
  },
];

const raydiumSteps: Step[] = [
  {
    number: "01",
    title: "Visit Raydium and Confirm Token",
    description: "official site and confirm the token.",
    icon: Link,
    image: step_1,
  },
  {
    number: "02",
    title: "Set Amount & Swap",
    description:
      "Connect with your Phantom wallet and enter the amount of JIMP tokens you want to swap or receive. Ensure you have enough SOL to cover both the swap amount and transaction fees. Click 'Swap' to proceed.",
    icon: CreditCard,
    image: step_2,
  },
  {
    number: "03",
    title: "Confirm Transaction",
    description:
      "Verify that you're swapping SOL for the correct JIMP token. The token contract address should be:",
    icon: CheckCircle,
    image: step_3,
  },
  {
    number: "04",
    title: "Swap Confirmation",
    description:
      "You should see a confirmation message on the bottom right corner of your screen. Shortly after the transaction is confirmed you should be able to see your new balance, although this can sometimes take a few seconds to refresh. ",
    icon: ArrowRight,
    image: step_4,
  },
];

const anyaltSteps: Step[] = [
  {
    number: "01",
    title: "Buy with AnyAlt",
    description:
      "Click the button to open the AnyAlt widget, which allows you to swap various cryptocurrencies for JIMP tokens.",
    icon: Repeat,
    image: step_1,
  },
  {
    number: "02",
    title: "Select Your Input Token",
    description:
      "Choose which cryptocurrency you want to swap from (ETH, USDT, etc.) and enter the amount you wish to convert.",
    icon: CreditCard,
    image: step_2,
  },
  {
    number: "03",
    title: "Review and Confirm",
    description:
      "Review the transaction details including fees and estimated JIMP tokens you'll receive, then confirm the swap.",
    icon: CheckCircle,
    image: step_3,
  },
  {
    number: "04",
    title: "Complete the Transaction",
    description:
      "Approve the transaction in your wallet and wait for confirmation. The JIMP tokens will be sent directly to your wallet.",
    icon: ArrowRight,
    image: step_4,
  },
];

const swapUrl =
  "https://raydium.io/swap/?inputMint=sol&outputMint=D86WEcSeM4YkQKqP6LLLt8bRypbJnaQcPUxHAVsopump";

const tokenAddress = "D86WEcSeM4YkQKqP6LLLt8bRypbJnaQcPUxHAVsopump";

export {
  raydiumPrerequisites,
  anyaltPrerequisites,
  raydiumSteps,
  anyaltSteps,
  swapUrl,
  tokenAddress,
};

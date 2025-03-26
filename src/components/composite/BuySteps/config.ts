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
import {
  anyalt_step_1,
  anyalt_step_2,
  anyalt_step_3,
  anyalt_step_4,
  anyalt_step_5,
  anyalt_step_6,
} from "@/assets/images/Howtobuy/anyalt";

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
    text: "You need a Web3 wallet like Metamask with ETH or other supported cryptocurrencies and Solana Wallet like Phantom that you want to receive JIMP tokens in",
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
    title: "Select a chain and cyrpto asset to swap from",
    description:
      "Choose the chain and asset you want to swap from (ETH, USDT, etc.). For example, we are swapping from ETH on Ethereum chain.",
    icon: Repeat,
    image: anyalt_step_1,
  },
  {
    number: "02",
    title: "Enter the amount to swap",
    description:
      "Enter the amount you wish to swap. Here you will see the calculation of estimated amount of JIMP tokens you will receive as well as the routes details. Then, click the 'Start Transaction' button.",
    icon: CreditCard,
    image: anyalt_step_2,
  },
  {
    number: "03",
    title: "Transaction Review ",
    description:
      "Review the transaction details including fees, estimated time and estimated JIMP tokens you'll receive, then click 'Execute Transaction'.",
    icon: CheckCircle,
    image: anyalt_step_3,
  },
  {
    number: "04",
    title: "Approve Transaction",
    description:
      "A pop-up will ask you to approve the transaction in your wallet and wait for confirmation. The JIMP tokens will be sent directly to your wallet.",
    icon: ArrowRight,
    image: anyalt_step_4,
  },
  {
    number: "05",
    title: "Transaction Complete",
    description:
      "You should see a transaction completion message. Now you can check the JIMP tokens in your solana wallet.",
    icon: ArrowRight,
    image: anyalt_step_5,
  },
  {
    number: "06",
    title: "Check your solana wallet",
    description: "You should see the JIMP tokens in your solana wallet.",
    icon: ArrowRight,
    image: anyalt_step_6,
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

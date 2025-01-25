import {
  Search,
  Wallet,
  Link,
  ArrowRight,
  CreditCard,
  CheckCircle,
  LucideIcon,
} from "lucide-react";

interface Step {
  number: string;
  title: string;
  description: string;
  icon: LucideIcon;
}

const steps: Step[] = [
  {
    number: "01",
    title: "Get the Official Address",
    description:
      "Visit jimpsons.org and copy the official Pump.fun contract address: D86WEcSeM4YkQKqP6LLLt8bRypbJnaQcPUxHAVsopump",
    icon: Search,
  },
  {
    number: "02",
    title: "Get Ready!",
    description:
      "Open your Phantom wallet application and unlock it with your password.",
    icon: Wallet,
  },
  {
    number: "03",
    title: "Connect to Pump.fun",
    description: "Click 'Connect Wallet.' Select Phantom Wallet and approve.",
    icon: Link,
  },
  {
    number: "04",
    title: "Add Token",
    description:
      "Paste the official contract address into Pump.fun search bar.",
    icon: ArrowRight,
  },
  {
    number: "05",
    title: "Buy Tokens",
    description: "Specify SOL amount, confirm and approve the transaction.",
    icon: CreditCard,
  },
  {
    number: "06",
    title: "Check Balance",
    description:
      "View your Pump.fun balance in Phantom wallet and verify on jimpsons.org.",
    icon: CheckCircle,
  },
];

export default steps;

import { Crown, Star, Trophy } from "lucide-react";

type TierInfo = {
  level: string;
  multiplier: number;
  daysRequired: number;
  icon: React.ElementType;
};

export const TIER_LEVELS: TierInfo[] = [
  {
    level: "Diamond",
    multiplier: 2.0,  // Updated from 5 to 2.0
    daysRequired: 90,
    icon: Trophy,
  },
  {
    level: "Gold",
    multiplier: 1.5,  // Updated from 3 to 1.5
    daysRequired: 60,
    icon: Crown,
  },
  {
    level: "Silver",
    multiplier: 1.2,  // Updated from 2 to 1.2
    daysRequired: 30,
    icon: Star,
  },
];


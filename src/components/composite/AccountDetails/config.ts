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
    multiplier: 5,
    daysRequired: 90,
    icon: Trophy,
  },
  {
    level: "Gold",
    multiplier: 3,
    daysRequired: 60,
    icon: Crown,
  },
  {
    level: "Silver",
    multiplier: 2,
    daysRequired: 30,
    icon: Star,
  },
];

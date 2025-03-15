// src/config/dao-config.ts
export const TIER_LEVELS = [
    {
      level: "Diamond",
      multiplier: 2.0,
      minStake: 100,
      daysRequired: 90,
      icon: "💎"
    },
    {
      level: "Gold",
      multiplier: 1.5,
      minStake: 50,
      daysRequired: 60,
      icon: "🥇"
    },
    {
      level: "Silver",
      multiplier: 1.2,
      minStake: 25,
      daysRequired: 30,
      icon: "🥈"
    }
  ] as const;
  
  export const TIER_MULTIPLIERS = {
    Diamond: 2.0,
    Gold: 1.5,
    Silver: 1.2,
    'Tier 0': 0
  } as const;
  
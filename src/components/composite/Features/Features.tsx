import {
  Bot,
  Sparkles,
  BrainCircuit,
  ArrowUpRight,
  Brain,
  Network,
  Gem,
  Target,
} from "lucide-react";
import SOLANA from "@/assets/icons/chains/Solana_Network_Logo.png";
import BASE from "@/assets/icons/chains/Base_Network_Logo.svg";
import POLYGON from "@/assets/icons/chains/Polygon_Network_Logo.png";
import ADD from "@/assets/icons/chains/add.png";

import STARKNET from "@/assets/icons/chains/Starknet_Network_Logo.svg";
import styles from "./Features.module.css";

const Features = () => {
  const steps = [
    {
      text: "Predict future events with details",
      icon: <Target className={styles.stepIcon} />,
      color: styles.stepIconRose,
    },
    {
      text: "AI oracle validates event outcome",
      icon: <Brain className={styles.stepIcon} />,
      color: styles.stepIconEmerald,
    },
    {
      text: "Get verified as FREE prophet NFT",
      icon: <Gem className={styles.stepIcon} />,
      color: styles.stepIconViolet,
    },
    {
      text: "Trade your successful prophecies",
      icon: <Bot className={styles.stepIcon} />,
      color: styles.stepIconAmber,
    },
  ];

  const chains = [
    {
      name: "Solana",
      description: "Speed Demon 🏃‍♂️",
      colorClass: styles.solana,
      logo: SOLANA,
      alt: "Solana Network Logo",
    },
    {
      name: "Polygon",
      description: "Ethereum's Cool Kid 😎",
      colorClass: styles.polygon,
      logo: POLYGON,
      alt: "Polygon Network Logo",
    },
    {
      name: "StarkNet",
      description: "Privacy Master 🕵️‍♂️",
      colorClass: styles.starknet,
      logo: STARKNET,
      alt: "StarkNet Network Logo",
    },
    {
      name: "Base",
      description: "Layer 2 Legend 🎭",
      colorClass: styles.base,
      logo: BASE,
      alt: "Base Network Logo",
    },
    {
      name: "More Chains Soon",
      description: "Stay tuned! ⭐",
      colorClass: styles.comingSoon,
      logo: ADD,
      alt: "More Chains Soon",
    },
  ];

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        {/* Main title */}
        <div className={styles.titleSection}>
          <h2 className={styles.mainTitle}>Predict & Create</h2>
          <h3 className={styles.subtitle}>
            Where <span>Prophecies</span> Become <span>Reality</span>
          </h3>
          <p className={styles.description}>
            Create FREE verified predictions on Solana with our AI oracle. Each
            48-hour prophecy transforms into unique digital art. Start your
            journey as a digital prophet!
          </p>
        </div>

        {/* Two main feature blocks */}
        <div className={styles.featureBlocks}>
          {/* Process Block */}
          <div className={`${styles.featureCard} ${styles.processCard}`}>
            <div className={styles.processContent}>
              <h4 className={styles.processTitle}>
                <Sparkles className={styles.sparkleIcon} />
                Seamless Process
                <Sparkles className={styles.sparkleIcon} />
              </h4>
              <div className={styles.stepsList}>
                {steps.map((step, index) => (
                  <div key={index} className={styles.step}>
                    <div className={`${styles.stepIconWrapper} ${step.color}`}>
                      {step.icon}
                    </div>
                    <span className={styles.stepText}>{step.text}</span>
                    <div className={styles.checkmark}>
                      <svg viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Chains Block */}
          <div className={`${styles.featureCard} ${styles.chainCard}`}>
            <h4 className={styles.chainTitle}>
              <Network className={styles.titleIcon} />
              Launching on Solana
              <ArrowUpRight className={styles.arrowIcon} />
            </h4>
            <p className={styles.chainDescription}>
              Starting our journey on Solana for lightning-fast predictions.
              Other chains locked and loaded for future expansion. ⚡
            </p>

            <div className={styles.chainGrid}>
              {chains.map((chain, index) => (
                <div
                  key={index}
                  className={`${styles.chainItem} ${chain.colorClass}`}
                >
                  <div className={styles.chainIconWrapper}>
                    <img
                      src={chain.logo}
                      alt={chain.alt}
                      className={styles.chainMainIcon}
                    />
                  </div>
                  <span className={styles.chainName}>{chain.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom features */}
        <div className={styles.bottomFeatures}>
          {/* Market Intelligence */}
          <div
            className={`${styles.featureCard} ${styles.bottomCard} ${styles.artificial}`}
          >
            <div className={styles.bottomFeatureContent}>
              <div className={styles.iconGroup}>
                <BrainCircuit className={styles.featureMainIcon} />
                <h4 className={styles.featureTitle}>AI Oracle Powered</h4>
                <Target className={styles.featureSecondaryIcon} />
              </div>
            </div>
            <p className={styles.featureDescription}>
              Our neutral AI validates outcomes with no human intervention,
              ensuring fair and unbiased verification.
            </p>
            {/* <div className={styles.abstractShape1} />
            <div className={styles.abstractShape2} /> */}
          </div>

          {/* Creative NFTs */}
          <div className={`${styles.featureCard} ${styles.bottomCard}`}>
            <div className={styles.bottomFeatureContent}>
              <div className={styles.iconGroup}>
                <Bot className={styles.featureMainIcon} />
                <h4 className={styles.featureTitle}>Creative NFTs</h4>
                <Sparkles className={styles.featureSecondaryIcon} />
              </div>
            </div>
            <p className={styles.featureDescription}>
              Successful predictions become verified NFTs with custom artwork.
              Build your prophet status!
            </p>
            <div className={styles.abstractShape3} />
            <div className={styles.abstractShape4} />
          </div>
        </div>

        {/* Abstract connecting lines */}
        <svg
          className={styles.connectingLines}
          viewBox="0 0 1000 1000"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient
              id="primaryGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop
                offset="0%"
                stopColor="var(--color-primary)"
                stopOpacity="0.3"
              />
              <stop
                offset="100%"
                stopColor="var(--color-secondary)"
                stopOpacity="0.3"
              />
            </linearGradient>
          </defs>
          <path
            d="M0,200 C150,150 300,450 450,300 C600,150 750,450 1000,300"
            stroke="url(#primaryGradient)"
            strokeWidth="2"
            fill="none"
          />
          <path
            d="M0,600 C200,550 400,750 600,600 C800,450 900,750 1000,600"
            stroke="url(#primaryGradient)"
            strokeWidth="2"
            fill="none"
          />
        </svg>
      </div>
    </div>
  );
};

export default Features;

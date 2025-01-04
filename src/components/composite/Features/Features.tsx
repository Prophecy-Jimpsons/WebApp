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
      text: "Multi-chain prediction minting",
      icon: <Target className={styles.stepIcon} />,
      color: styles.stepIconRose,
    },
    {
      text: "AI-enhanced prediction validation",
      icon: <Brain className={styles.stepIcon} />,
      color: styles.stepIconEmerald,
    },
    {
      text: "Convert predictions to premium NFTs",
      icon: <Gem className={styles.stepIcon} />,
      color: styles.stepIconViolet,
    },
    {
      text: "AI generates unique artwork",
      icon: <Bot className={styles.stepIcon} />,
      color: styles.stepIconAmber,
    },
  ];

  const chains = [
    {
      name: "Solana",
      colorClass: styles.solana,
      logo: SOLANA,
      alt: "Solana Network Logo",
    },
    {
      name: "Polygon",
      colorClass: styles.polygon,
      logo: POLYGON,
      alt: "Polygon Network Logo",
    },
    {
      name: "StarkNet",
      colorClass: styles.starknet,
      logo: STARKNET,
      alt: "StarkNet Network Logo",
    },
    {
      name: "Base",
      colorClass: styles.base,
      logo: BASE,
      alt: "Base Network Logo",
    },
    {
      name: "More Chain Soon",
      colorClass: styles.comingSoon,
      logo: ADD,
      alt: "More Chain Soon",
    },
  ];

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        {/* Main title */}
        <div className={styles.titleSection}>
          <h2 className={styles.mainTitle}>Predict & Create</h2>
          <h3 className={styles.subtitle}>
            Where <span>Artificial Intelligence</span> meets blockchain
            predictions
          </h3>
          <p className={styles.description}>
            Transform your market insights into unique NFTs, powered by advanced
            AI for both prediction analysis and artistic creation.
          </p>
        </div>

        {/* Two main feature blocks */}
        <div className={styles.featureBlocks}>
          {/* Process Block */}
          <div className={`${styles.featureCard} ${styles.processCard}`}>
            <div className={styles.processContent}>
              <h4 className={styles.processTitle}>
                Seamless Process <Sparkles className={styles.sparkleIcon} />
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
              Multi-Chain Platform
              <ArrowUpRight className={styles.arrowIcon} />
            </h4>
            <p className={styles.chainDescription}>
              Deploy predictions on your preferred blockchain with AI-optimized
              efficiency. More networks coming soon as we expand our cross-chain
              capabilities.
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
                <Target className={styles.featureSecondaryIcon} />
              </div>
              <h4 className={styles.featureTitle}>
                Artificial Intelligence Powered
              </h4>
            </div>
            <p className={styles.featureDescription}>
              AI-powered analysis combines with your market knowledge for more
              accurate predictions.
            </p>
            {/* <div className={styles.abstractShape1} />
            <div className={styles.abstractShape2} /> */}
          </div>

          {/* Creative NFTs */}
          <div className={`${styles.featureCard} ${styles.bottomCard}`}>
            <div className={styles.bottomFeatureContent}>
              <div className={styles.iconGroup}>
                <Bot className={styles.featureMainIcon} />
                <Sparkles className={styles.featureSecondaryIcon} />
              </div>
              <h4 className={styles.featureTitle}>Creative NFTs</h4>
            </div>
            <p className={styles.featureDescription}>
              Each prediction becomes a unique NFT with AI-generated artwork
              that tells your story.
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

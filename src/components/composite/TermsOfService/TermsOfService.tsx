import React from "react";
import styles from "./TermsOfService.module.css";

// Import the same chain icons
import SOLANA from "@/assets/icons/chains/Solana_Network_Logo.png";
import BASE from "@/assets/icons/chains/Base_Network_Logo.svg";
import POLYGON from "@/assets/icons/chains/Polygon_Network_Logo.png";
import STARKNET from "@/assets/icons/chains/Starknet_Network_Logo.svg";

interface TermsOfServiceProps {
  title: string;
  content: string;
}

const TermsOfService: React.FC = () => {
  const termsData: Record<string, TermsOfServiceProps> = {
    intro: {
      title: "Terms of Service",
      content:
        "Welcome to ProphecyJimpsons! These Terms of Service govern your use of our predictive NFT platform, effective January 1st, 2025. By accessing our platform, you acknowledge and agree to these terms, which we may modify at our discretion.",
    },
    collect: {
      title: "Platform Usage",
      content:
        "ProphecyJimpsons enables users to create and trade prediction-based NFTs, participate in our DAO governance, and engage with our community. You may utilize all platform features, including AI-generated artwork creation, prediction verification, and community engagement tools. Our platform emphasizes on decentralized decision-making and community-driven growth.",
    },
    prohibited: {
      title: "Prohibited Activities",
      content:
        "The platform strictly prohibits any form of market manipulation, intentionally false predictions, or harmful content. Users must not engage in illegal activities, abuse platform features, or attempt identity theft. We maintain a zero-tolerance policy for actions that compromise platform integrity or user security.",
    },
    intellectual: {
      title: "Intellectual Property",
      content:
        "All AI-generated artwork created through our platform follows specific ownership protocols. Prediction NFTs carry distinct rights and privileges within our ecosystem. While we protect our brand assets and platform content, we encourage community contributions within our guidelines. Users must respect copyright laws and intellectual property rights.",
    },
    limitations: {
      title: "Liability Limitations",
      content:
        "ProphecyJimpsons operates as a decentralized platform and cannot be held liable for market losses, prediction outcomes, or network issues. We do not assume responsibility for wallet problems, external service interruptions, or user disputes. Users participate in platform activities at their own risk.",
    },
    platform: {
      title: "Platform Rules",
      content:
        "Our community thrives on mutual respect and proper conduct. Users must adhere to community guidelines, maintain wallet security, and report any platform issues. All activities must comply with applicable laws and regulations while preserving our decentralized nature.",
    },
    termination: {
      title: "Termination Rights",
      content:
        "We maintain the right to protect our platform through necessary actions, including suspending accounts, removing harmful content, or blocking access when required. This includes the ability to cancel transactions or modify features to ensure platform security and stability.",
    },
    governingLaw: {
      title: "Governing Law",
      content:
        "These terms operate under applicable blockchain and cryptocurrency regulations while maintaining our commitment to decentralized autonomy. Our governance structure reflects both legal compliance and community-driven decision-making.",
    },
    contact: {
      title: "Contact",
      content:
        "For questions or concerns regarding these terms, please engage with our community through our official Discord channel or participate in DAO discussions. Our community moderators are available to address platform-related inquiries.",
    },
  };

  return (
    <main className={styles.container}>
      {/* Floating Chain Icons */}
      <div className={styles.floatingIcons}>
        <div className={`${styles.icon} ${styles.icon1}`}>
          <img src={SOLANA} alt="Solana logo" />
        </div>
        <div className={`${styles.icon} ${styles.icon2}`}>
          <img src={BASE} alt="Base logo" />
        </div>
        <div className={`${styles.icon} ${styles.icon3}`}>
          <img src={POLYGON} alt="Polygon logo" />
        </div>
        <div className={`${styles.icon} ${styles.icon4}`}>
          <img src={STARKNET} alt="Starknet logo" />
        </div>
      </div>

      <div className={styles.contentWrapper}>
        <div className={styles.titleContainer}>
          <h1 className={styles.title}>
            <span className={styles.highlight}>TERMS OF</span>{" "}
            <span className={styles.highlight}>SERVICE</span>
            {/* <span className={styles.regularText}>SERVICE</span> */}
          </h1>
        </div>

        <div className={styles.content}>
          <p className={styles.description}>
            By accessing ProphecyJimpsons, you agree to these terms. We reserve
            the right to modify these terms at any time.
          </p>

          <div className={styles.sectionsContainer}>
            {Object.entries(termsData).map(([key, section]) => (
              <div key={key} className={styles.section}>
                <h2 className={styles.sectionTitle}>{section.title}</h2>
                <p className={styles.sectionContent}>{section.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};

export default TermsOfService;

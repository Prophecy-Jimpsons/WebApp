import React from "react";
import steps from "./config";
import styles from "./BuyStep.module.css";

import { LucideIcon } from "lucide-react";

const VideoSection: React.FC = () => (
  <div className={styles.videoSection}>
    <h2 className={styles.mainTitle}>How to Buy JIMP Token</h2>
    <div className={styles.videoWrapper}>
      <iframe
        src="https://www.youtube.com/embed/3QH7ZTibV-Q"
        title="How to Buy JIMP Token"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className={styles.videoIframe}
      ></iframe>
    </div>
  </div>
);

interface StepConnectorProps {
  isLeft: boolean;
}

const StepConnector: React.FC<StepConnectorProps> = ({ isLeft }) => (
  <div className={styles.connectorWrapper}>
    <svg className={styles.connector} viewBox="0 0 100 50">
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#4834d4" />
          <stop offset="50%" stopColor="#ff6b6b" />
          <stop offset="100%" stopColor="#feda03" />
        </linearGradient>
      </defs>
      <path
        d={isLeft ? "M0,25 Q30,25 50,15 T100,5" : "M0,5 Q20,5 50,15 T100,25"}
        className={styles.connectorLine}
      />
    </svg>
  </div>
);

interface StepIconProps {
  Icon: LucideIcon;
}

const StepIcon: React.FC<StepIconProps> = ({ Icon }) => (
  <div className={styles.iconWrapper}>
    <div className={styles.iconCircle}>
      <Icon size={32} />
    </div>
  </div>
);

interface StepContentProps {
  number: string;
  title: string;
  description: string;
}

const StepContent: React.FC<StepContentProps> = ({
  number,
  title,
  description,
}) => (
  <div className={styles.stepContent}>
    <div className={styles.stepNumber}>{number}</div>
    <h4 className={styles.stepTitle}>{title}</h4>
    <p className={styles.stepDescription}>{description}</p>
  </div>
);

interface Step {
  number: string;
  title: string;
  description: string;
  icon: LucideIcon;
}

interface StepProps {
  step: Step;
  index: number;
}

const Step: React.FC<StepProps> = ({ step, index }) => {
  const isLeft = index % 2 === 0;

  return (
    <div className={styles.stepRow}>
      {isLeft ? (
        <>
          <StepContent {...step} />
          <StepConnector isLeft={true} />
          <StepIcon Icon={step.icon} />
        </>
      ) : (
        <>
          <StepIcon Icon={step.icon} />
          <StepConnector isLeft={false} />
          <StepContent {...step} />
        </>
      )}
    </div>
  );
};

const StepsSection: React.FC = () => (
  <div className={styles.stepsSection}>
    <h3 className={styles.stepsTitle}>Buying Steps</h3>
    <div className={styles.stepsWrapper}>
      {steps.map((step, index) => (
        <Step key={index} step={step} index={index} />
      ))}
    </div>
  </div>
);

const BuyStep: React.FC = () => {
  return (
    <section className={styles.buyStepWrapper}>
      <div className={styles.content}>
        <VideoSection />
        <StepsSection />
      </div>
    </section>
  );
};

export default BuyStep;

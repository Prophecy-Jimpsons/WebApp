import { PenBox, Brain, Sparkles, ArrowUpRight } from "lucide-react";
import styles from "./MintSteps.module.css";

const StepOne = "/MintSteps/step1.png";
const StepTwo = "/MintSteps/step2.png";
const StepThree = "/MintSteps/step3.png";
const StepFour = "/MintSteps/step4.png";

const MintSteps = () => {
  const steps = [
    {
      number: "01",
      title: "Be a Prophet!",
      icon: <PenBox className={styles.stepIcon} />,
      description:
        "Channel your inner fortune teller! What's your bold prediction? Example: 'Donald Trump will win the US presidential election in November 2024' or 'BTC will hit $100k'. Make your wildest predictions and let's see if you're right! 🔮",
      image: StepOne,
    },
    {
      number: "02",
      title: "AI Art Generation",
      icon: <Brain className={styles.stepIcon} />,
      description:
        "Our AI transforms your prophecy into unique digital artwork, creating a one-of-a-kind NFT design.",
      image: StepTwo,
    },
    {
      number: "03",
      title: "Free NFT Magic",
      icon: <Sparkles className={styles.stepIcon} />,
      description:
        "Turn your prophecy into an awesome NFT - totally FREE! No crypto needed, just your predictive powers. Start building your collection of future-telling tokens! ✨",
      image: StepThree,
    },
    {
      number: "04",
      title: "Become Legendary",
      icon: <ArrowUpRight className={styles.stepIcon} />,
      description:
        "Did your prediction come true? Boom! Your NFT gets verified and you level up as a crypto prophet. Build your reputation and let others witness your powers! 🏆",
      image: StepFour,
    },
  ];

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.titleSection}>
          <h2 className={styles.mainTitle}>Jimpsons Playground</h2>
          <h3 className={styles.subtitle}>
            Four Magical Steps to <span>Jimpsons Power</span>
          </h3>
        </div>

        <div className={styles.stepsContainer}>
          {steps.map((step, index) => (
            <div key={index} className={styles.stepCard}>
              <div className={styles.stepNumber}>{step.number}</div>
              <div className={styles.stepContent}>
                <div className={styles.textContent}>
                  <h4 className={styles.stepTitle}>
                    {step.icon}
                    {step.title}
                  </h4>
                  <p className={styles.stepDescription}>{step.description}</p>
                </div>
                <div className={styles.imageContainer}>
                  <img
                    src={step.image}
                    alt={`Step ${step.number} - ${step.title}`}
                    className={styles.stepImage}
                  />
                  <div className={styles.imageOverlay} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MintSteps;

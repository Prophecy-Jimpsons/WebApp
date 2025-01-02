import React from "react";
import styles from "./Roadmap.module.css";
import { roadmapData, benefits } from "@/assets/data/Roadmap";
import type { RoadmapPhase, Benefit } from "@/assets/data/Roadmap";

const Roadmap: React.FC = () => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <img
            src="/assets/icons/circle-check-regular"
            alt="Completed"
            className={styles.statusIcon}
          />
        );
      case "current":
        return (
          <img
            src="/assets/icons/clock-regular.svg"
            alt="In Progress"
            className={styles.statusIcon}
          />
        );
      default:
        return (
          <img
            src="/assets/icons/arrow-right-solid.svg"
            alt="Upcoming"
            className={styles.statusIcon}
          />
        );
    }
  };

  const getPhaseIcon = (icon: string) => {
    return (
      <img
        src={`/assets/icons/${icon}.svg`}
        alt={icon}
        className={styles.phaseIcon}
      />
    );
  };

  return (
    <section className={styles.roadmapWrapper}>
      {/* Floating Background Icons */}
      <div className={styles.floatingIcons}>
        <img
          src="/assets/icons/rocket-solid.svg"
          alt="rocket"
          className={`${styles.floatingIcon} ${styles.icon1}`}
        />
        <img
          src="/assets/icons/chart-line-solid.svg"
          alt="growth"
          className={`${styles.floatingIcon} ${styles.icon2}`}
        />
        <img
          src="/assets/icons/gear-solid.svg"
          alt="tech"
          className={`${styles.floatingIcon} ${styles.icon3}`}
        />
        <img
          src="/assets/icons/globe-solid.svg"
          alt="global"
          className={`${styles.floatingIcon} ${styles.icon4}`}
        />
      </div>

      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Strategic Launch Roadmap</h2>
          <p className={styles.subtitle}>
            Join us as we evolve from Pump.fun to become the leading multi-chain
            prediction platform
          </p>
        </div>

        <div className={styles.roadmapGrid}>
          {roadmapData.map((phase: RoadmapPhase) => (
            <div key={phase.phase} className={styles.card}>
              <div className={styles.cardHeader}>
                {getPhaseIcon(phase.icon)}
                <div className={styles.phaseInfo}>
                  <div className={styles.phase}>
                    {phase.phase}
                    {getStatusIcon(phase.status)}
                  </div>
                  <div className={styles.timing}>{phase.timing}</div>
                </div>
              </div>

              <h3 className={styles.cardTitle}>{phase.title}</h3>

              {phase.items ? (
                <ul className={styles.itemList}>
                  {phase.items.map((item, itemIndex) => (
                    <li key={itemIndex} className={styles.item}>
                      <div className={styles.dot} />
                      {item}
                    </li>
                  ))}
                </ul>
              ) : (
                phase.mainItems?.map((section, sectionIndex) => (
                  <div key={sectionIndex} className={styles.section}>
                    <h4 className={styles.sectionTitle}>{section.subtitle}</h4>
                    <ul className={styles.itemList}>
                      {section.items.map((item, itemIndex) => (
                        <li key={itemIndex} className={styles.item}>
                          <div className={styles.dot} />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))
              )}
            </div>
          ))}
        </div>

        <div className={styles.benefitsSection}>
          <h3 className={styles.benefitsTitle}>Early Investor Benefits</h3>
          <div className={styles.benefitsList}>
            {benefits.map((benefit: Benefit, index) => (
              <div key={index} className={styles.benefitItem}>
                <img
                  src={`/assets/icons/${benefit.icon}.svg`}
                  alt={benefit.icon}
                  className={styles.benefitIcon}
                />
                <span>{benefit.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Roadmap;

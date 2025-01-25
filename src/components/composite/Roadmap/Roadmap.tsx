import React from "react";
import styles from "./Roadmap.module.css";
import { roadmapData, benefits } from "@/assets/data/Roadmap";
import type { RoadmapPhase, Benefit } from "@/assets/data/Roadmap";
import { CheckCircle } from "lucide-react";

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
          <h2 className={styles.title}>Roadmap to Success</h2>
          <p className={styles.subtitle}>
            Building the future of decentralized predictions - from innovative
            Pump.fun origins to becoming the premier cross-chain oracle platform
          </p>
        </div>

        <div className={styles.roadmapGrid}>
          {roadmapData.map((phase: RoadmapPhase, index: number) => (
            <div key={phase.phase} className={styles.cardWrapper}>
              <div className={styles.connector}>
                <div className={styles.line} />
                <div className={styles.dot}>
                  <span>{index + 1}</span>
                </div>
              </div>

              <div className={styles.card}>
                <div className={styles.cardGlow} />

                <div className={styles.cardContent}>
                  <div className={styles.cardHeader}>
                    <div
                      className={`${styles.iconWrapper} ${styles[phase.status]}`}
                    >
                      {getPhaseIcon(phase.icon)}
                    </div>

                    <div className={styles.phaseInfo}>
                      <div className={styles.phaseTop}>
                        <h3 className={styles.phase}>{phase.phase}</h3>
                        <div className={styles.statusBadge}>
                          {getStatusIcon(phase.status)}
                        </div>
                      </div>
                      <div className={styles.timing}>{phase.timing}</div>
                    </div>
                  </div>

                  <h4 className={styles.cardTitle}>{phase.title}</h4>

                  <div className={styles.content}>
                    {phase.items ? (
                      <ul className={styles.itemList}>
                        {phase.items.map((item, idx) => (
                          <li key={idx} className={styles.item}>
                            <div
                              className={`${styles.checkbox} ${
                                phase.completedItems?.includes(idx)
                                  ? styles.completed
                                  : ""
                              }`}
                            >
                              {phase.completedItems?.includes(idx) && (
                                <CheckCircle size={12} />
                              )}
                            </div>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      phase.mainItems?.map((section, sIdx) => (
                        <div key={sIdx} className={styles.section}>
                          <h5 className={styles.sectionTitle}>
                            {section.subtitle}
                          </h5>
                          <ul className={styles.itemList}>
                            {section.items.map((item, iIdx) => (
                              <li key={iIdx} className={styles.item}>
                                <div
                                  className={`${styles.checkbox} ${
                                    section.completedItems?.includes(iIdx)
                                      ? styles.completed
                                      : ""
                                  }`}
                                >
                                  {section.completedItems?.includes(iIdx) && (
                                    <CheckCircle size={12} />
                                  )}
                                </div>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
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

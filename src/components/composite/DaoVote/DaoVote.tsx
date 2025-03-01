import type React from "react";
import { useState } from "react";
import styles from "./DaoVote.module.css";
import CardGroup from "./CardGroup";
import VoteCard from "./VoteCard";
import { oracleSources } from "./config";

const DaoVote: React.FC = () => {
  const [selectedSource, setSelectedSource] = useState<string>("");

  const handleSourceChange = (id: string) => {
    setSelectedSource(id);
    console.log(`Selected Source: ${id}`);
  };

  return (
    <div className={styles.section}>
      <h1 className={styles.title}>AI Oracle Source Voting </h1>
      <h4 className={styles.subtitle}>Community Governed Data Verification</h4>
      <p className={styles.description}>Select a source to vote on</p>
      <section className={styles.voteSection}>
        <CardGroup
          name="Governance Sources"
          onChange={handleSourceChange}
          defaultSelected="Source-1"
        >
          {oracleSources.map((source) => (
            <VoteCard
              key={source.id}
              id={source.id}
              title={source.title}
              description={source.description}
              author={source.author}
              authorImage={source.authorImage}
              votes={source.votes}
              daysLeft={source.daysLeft}
              progress={source.progress}
              isActive={source.status === "active"}
            >
              {source.additionalInfo && (
                <div className={styles.additionalInfo}>
                  <h4>{source.additionalInfo.title}</h4>
                  <ul>
                    {source.additionalInfo.items.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}
              <div className={styles.sourceMetadata}>
                <span className={styles.validationMethod}>
                  Validation: {source.validationMethod}
                </span>
              </div>
            </VoteCard>
          ))}
        </CardGroup>

        {selectedSource && (
          <div className={styles.selectedInfo}>
            <h2>
              Selected Source:{" "}
              {oracleSources.find((s) => s.id === selectedSource)?.title}
            </h2>
            <div className={styles.voteMetrics}>
              <div className={styles.votingPower}>
                <span className={styles.metricLabel}>Voting Power:</span>
                <span className={styles.metricValue}>
                  √Staked JIMP × Tier Multiplier
                </span>
              </div>
            </div>
            <button className={`${styles.voteButton}`}>Vote Source</button>
          </div>
        )}
      </section>
    </div>
  );
};

export default DaoVote;

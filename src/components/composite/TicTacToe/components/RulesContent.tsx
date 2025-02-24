import { useState } from "react";
import {
  ChevronRight,
  LayoutGrid,
  MoveRight,
  Trophy,
  Sparkles,
} from "lucide-react";
import styles from "./RulesContent.module.css";

const RulesContent = () => {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const handleSectionClick = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const rules = [
    {
      id: "board",
      icon: <LayoutGrid className={styles.ruleIcon} />,
      title: "Board Setup",
      description: "4x4 grid with 4 pieces per player",
      details: `🟦 Each player starts with 4 pieces that they'll need to strategically place and move on the board.`,
    },
    {
      id: "phases",
      icon: <MoveRight className={styles.ruleIcon} />,
      title: "Game Phases",
      description: "Place → then move anywhere",
      details:
        "🔄 The game consists of two phases:\n1. Place your 4 pieces strategically\n2. Move your pieces to any open spot",
    },
    {
      id: "winning",
      icon: <Trophy className={styles.ruleIcon} />,
      title: "Ways to Win",
      description: "Multiple winning patterns",
      details: `Win by creating:
         ↔️ Horizontal line (4-in-a-row)
         ↕️ Vertical line (4-in-a-column)
         ↘️↙️ Diagonal line (any direction)
         ⊞ 2x2 square block (anywhere)`,
    },
    {
      id: "ai",
      icon: <Sparkles className={styles.ruleIcon} />,
      title: "Game Modes",
      description: "Play against AI or friends",
      details:
        "🤖 Challenge AVAI in solo mode\n🚫 No ties – games always end with a winner!",
    },
  ];

  return (
    <div className={styles.rulesContainer}>
      {rules.map((rule) => (
        <div
          key={rule.id}
          className={`${styles.ruleCard} ${expandedSection === rule.id ? styles.expanded : ""}`}
          onClick={() => handleSectionClick(rule.id)}
          role="button"
          tabIndex={0}
          onKeyPress={(e) => {
            if (e.key === "Enter") handleSectionClick(rule.id);
          }}
        >
          <div className={styles.ruleHeader}>
            <div className={styles.ruleIconWrapper}>{rule.icon}</div>
            <div className={styles.ruleTitleGroup}>
              <h3>{rule.title}</h3>
              <p>{rule.description}</p>
            </div>
            <ChevronRight
              className={`${styles.chevron} ${expandedSection === rule.id ? styles.rotated : ""}`}
            />
          </div>
          {expandedSection === rule.id && (
            <div className={styles.ruleDetails}>
              {rule.details.split("\n").map((line, index) => (
                <p key={index}>{line}</p>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default RulesContent;

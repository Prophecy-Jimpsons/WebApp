import type React from "react";
import styles from "./Timer.module.css";

interface TimerProps {
  timeLeft: number;
}

const Timer: React.FC<TimerProps> = ({ timeLeft }) => {
  return (
    <div className={`${styles.timer} ${timeLeft <= 5 ? styles.warning : ""}`}>
      {timeLeft}s
    </div>
  );
};

export default Timer;

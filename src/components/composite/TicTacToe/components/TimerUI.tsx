import React, { useEffect, useState } from "react";
import styles from "./GameBoard.module.css";

interface TimerProps {
  initialTime: number;
  onTimeout: () => void;
  timeoutMessage: string;
}

const Timer = ({ initialTime, onTimeout, timeoutMessage }: TimerProps) => {
  const [timeRemaining, setTimeRemaining] = useState<number>(initialTime);

  useEffect(() => {
    if (timeRemaining > 0) {
      const timer = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1);
      }, 1000);

      return () => clearTimeout(timer);
    } else {
      onTimeout();
    }
  }, [timeRemaining, onTimeout]);

  return (
    <div className={styles.timer}>
      Timer: {timeRemaining}s<p>{timeoutMessage}</p>
    </div>
  );
};

export default Timer;

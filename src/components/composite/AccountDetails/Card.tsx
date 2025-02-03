
import { ReactNode } from 'react';
import styles from './Card.module.css';

interface CardProps {
  title?: string;
  children: ReactNode;
  className?: string;
}

export function Card({ title, children, className = '' }: CardProps) {
  return (
    <div className={`${styles.card} ${className}`}>
      {title && <h2 className={styles.cardTitle}>{title}</h2>}
      <div className={styles.cardContent}>

      {children}
      </div>
    </div>
  );
}

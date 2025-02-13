import styles from "./GameCell.module.css";

interface GameCellProps {
  value: string;
  onClick: () => void;
  isSelected: boolean;
  isHighlighted: boolean;
  isGameOver?: boolean;
}

const GameCell: React.FC<GameCellProps> = ({
  value,
  onClick,
  isSelected,
  isHighlighted,
  isGameOver,
}) => {
  return (
    <div
      className={`${styles.cell} ${value ? styles[value] : ""} ${isSelected ? styles.selected : ""} ${isHighlighted ? styles.highlighted : ""} ${isGameOver ? styles.disabled : ""}`}
      onClick={isGameOver ? undefined : onClick} // Conditionally disable onClick
    >
      {value}
    </div>
  );
};

export default GameCell;

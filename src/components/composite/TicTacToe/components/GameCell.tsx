import styles from "./GameCell.module.css";

interface GameCellProps {
  value: string;
  onClick: () => void;
  isSelected: boolean;
}

const GameCell: React.FC<GameCellProps> = ({ value, onClick, isSelected }) => {
  return (
    <div
      className={`${styles.cell} ${value ? styles[value] : ""} ${
        isSelected ? styles.selected : ""
      }`}
      onClick={onClick}
    >
      {value}
    </div>
  );
};

export default GameCell;

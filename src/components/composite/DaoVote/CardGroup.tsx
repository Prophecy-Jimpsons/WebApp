import React from "react";
import styles from "./CardGroup.module.css";

interface CardGroupProps {
  name: string;
  onChange: (id: string) => void;
  selectedId: string;
  children: React.ReactNode;
}

// Define expected child props
interface ChildProps {
  id: string;
  isSelected?: boolean;
  onSelect?: () => void;
}

const CardGroup: React.FC<CardGroupProps> = ({
  name,
  onChange,
  selectedId,
  children
}) => {
  const handleSelect = (id: string) => {
    onChange(id);
  };

  const childrenWithProps = React.Children.map(children, child => {
    if (React.isValidElement<ChildProps>(child)) {
      return React.cloneElement(child, {
        isSelected: child.props.id === selectedId,
        onSelect: () => handleSelect(child.props.id)
      });
    }
    return child;
  });

  return (
    <div className={styles.cardGroup} role="radiogroup" aria-labelledby={`${name}-group`}>
      <div id={`${name}-group`} className={styles.srOnly}>
        {name}
      </div>
      <div className={styles.cardContainer}>
        {childrenWithProps}
      </div>
    </div>
  );
};

export default CardGroup;

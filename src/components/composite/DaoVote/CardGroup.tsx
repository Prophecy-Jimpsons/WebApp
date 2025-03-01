import React, { useState } from "react";
import styles from "./CardGroup.module.css";
import { VoteCardProps } from "./VoteCard";

interface CardGroupProps {
  children: React.ReactElement<VoteCardProps>[];
  name: string;
  defaultSelected?: string;
  onChange?: (selectedId: string) => void;
}

const CardGroup: React.FC<CardGroupProps> = ({
  children,
  name,
  defaultSelected,
  onChange,
}) => {
  const [selectedId, setSelectedId] = useState<string>(defaultSelected || "");

  const handleSelect = (id: string) => {
    setSelectedId(id);
    if (onChange) {
      onChange(id);
    }
  };

  // Clone children and pass selection props
  const childrenWithProps = React.Children.map(children, (child) => {
    if (React.isValidElement<VoteCardProps>(child)) {
      return React.cloneElement(child, {
        isSelected: child.props.id === selectedId,
        onSelect: handleSelect,
      });
    }
    return child;
  });

  return (
    <div
      className={styles.cardGroup}
      role="radiogroup"
      aria-labelledby={`${name}-group`}
    >
      <div id={`${name}-group`} className={styles.srOnly}>
        {name}
      </div>
      {childrenWithProps}
    </div>
  );
};

export default CardGroup;

// AccountCard.tsx
import React, { useState } from 'react';
import styles from './Card.module.scss';

interface CardProps {
  symbol: string;
  name: string;

  icon?: React.ReactNode;
}

const avatars = [
  { src: '', alt: '' },
  { src: '', alt: '' },
  // { src: '', alt: '' },
  // { src: '', alt: '' },
  // { src: '', alt: '' },
  // { src: '', alt: '' },
];

const viewOptions = [
  { word: "Rename", id: "1" },
]
const Card: React.FC<CardProps> = ({
  symbol,
  name,

  icon
}) => {
  const [startEditting, setStartEditting] = useState(false);

  return (
    <div className={styles.container}>
      <div className={styles.leftSection}>
        <div className={styles.iconWrapper}>
          {icon}
        </div>
        <div className={styles.tokenInfo}>

          <span className={styles.symbol}>{symbol}</span>

          <span className={styles.name}>{name}</span>

        </div>
      </div>

    </div>
  );
};

export default Card;

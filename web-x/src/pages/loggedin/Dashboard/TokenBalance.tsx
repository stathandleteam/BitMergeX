// TokenBalance.tsx
import React from 'react';
import styles from './TokenBalance.module.scss';

interface TokenBalanceProps {
  symbol: string;
  name: string;
  balance: number;
  fiatValue: number;
  icon?: React.ReactNode;
  onClick: () => void
}

const TokenBalance: React.FC<TokenBalanceProps> = ({
  symbol,
  name,
  balance,
  fiatValue,
  icon,
  onClick
}) => {
  return (
    <div className={styles.container} onClick={onClick}>
      <div className={styles.leftSection}>
        <div className={styles.iconWrapper}>
          {icon}
        </div>
        <div className={styles.tokenInfo}>
          <span className={styles.symbol}>{symbol}</span>
          <span className={styles.name}>{name}</span>
        </div>
      </div>
      <div className={styles.rightSection}>
        <span className={styles.balance}>
          {balance.toFixed(6)}
        </span>
        <span className={styles.fiatValue}>
          ${fiatValue.toFixed(2)}
        </span>
      </div>
    </div>
  );
};

export default TokenBalance;

// Example usage:
// import { FaEthereum } from 'react-icons/fa';
// <TokenBalance
//   symbol="ETH"
//   name="Ethereum"
//   balance={0.001416}
//   fiatValue={5.42}
//   icon={<FaEthereum />}
// />
import React from 'react'
import styles from './Header.module.scss'
import STXLogo from '@/assets/images/stx-logo.webp';
import { AccountBalanceProps } from '@/context/stxfetch/AccountContext';

 interface Props {
  accountBalance: AccountBalanceProps;
 }

const Header = ({accountBalance}: Props) => {
  return (
    <div className={styles.card}>
        <img className={styles.logo} src={STXLogo} alt="" />
        <div className={styles.totalBalanceContainer}>
          <span className={styles.totalBalance}>Stacks Balance</span>
            <div className={styles.balance}>{`${accountBalance?.stxBalance||0} STX`}</div>
            <span className={styles.address}>{`$${accountBalance?.usdBalance?.toFixed(2) || '0'} USD`}</span>
        </div>
    </div>
  )
}

export default Header
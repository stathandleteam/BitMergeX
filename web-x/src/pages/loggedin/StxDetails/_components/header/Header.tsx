import React from 'react'
import styles from './Header.module.scss'
import STXLogo from '@/assets/images/stx-logo.webp'
const Header = () => {
  return (
    <div className={styles.card}>
        <img className={styles.logo} src={STXLogo} alt="" />
        <div className={styles.totalBalanceContainer}>
          <span className={styles.totalBalance}>Stacks Balance</span>
            <div className={styles.balance}>0 STX</div>
            <span className={styles.address}>$0 USD</span>
        </div>
    </div>
  )
}

export default Header
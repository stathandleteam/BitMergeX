import React from 'react'
import styles from './SwitchAccount.module.scss'
import { IoIosArrowDown } from 'react-icons/io'
import { useRouter } from '@/routing/RouterContext';
import { ROUTES } from '@/routing/constants';

const SwitchAccount = ({accountType, accountName}: {accountType: string, accountName: string}) => {
 
  const { navigate } = useRouter();

  const handleNavigation = async (route: string) => {
    navigate(route, { id: '123' });
  }

  return (
    <div className={styles.switchAccountContainer}>
        <span className={styles.accountType}>{accountType}</span>
        <div className={styles.accountNameContainer} onClick={() => handleNavigation(ROUTES.ACCOUNT_LIST)}>
            <span className={styles.arrow}><IoIosArrowDown /></span>
            <span className={styles.accountName}>{accountName}</span>
        </div>
    </div>
  )
}

export default SwitchAccount;
import React from 'react'
import styles from './btcDetails.module.scss'
import Header from './_components/header/Header'
import { useRouter } from '@/routing/RouterContext';
import WalletNavigation from '../Dashboard/WalletNavigation';
import TokenBalance from '../Dashboard/TokenBalance';
import BackIcon from '@/design-system/_components/BackIcon/BackIcon';
import { ROUTES } from '@/routing/constants';

const BtcDetails = () => {

    const { navigate } = useRouter();

    const handleNavigation = async (route: string) => {
      navigate(route, { id: '123' });
    }
  
    const onClick = (label: any)=>{
        console.log('label', label)    
    }
    
  return (
    <div className={styles['home-page']}>
        <div className={styles['body']}>

            <div className={styles['back-icon']}>
                <BackIcon onClick={()=>handleNavigation(ROUTES.DASHBOARD)} />
            </div>

            <div className={styles['top-layer']}>

                <div className={styles.walletSection}>
                    <Header  />
                    <WalletNavigation onClick = {onClick} />    
                </div>
            </div>
        </div>
    </div>
  )
}

export default BtcDetails
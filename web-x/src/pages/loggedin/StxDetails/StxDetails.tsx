import React from 'react'
import styles from './stxDetails.module.scss'
import Header from './_components/header/Header'
import { useRouter } from '@/routing/RouterContext';
import WalletNavigation from '../Dashboard/WalletNavigation';
import TokenBalance from '../Dashboard/TokenBalance';
import BackIcon from '@/design-system/_components/BackIcon/BackIcon';
import { ROUTES } from '@/routing/constants';
import TransactionHistory from './_components/transactionhistory/TransactionHistory';
import { TransactionProvider } from './context/TransactionContext';

const StxDetails = () => {

    const { navigate } = useRouter();

    const handleNavigation = async (route: string) => {
      navigate(route, { id: '123' });
    }
  
    const onClick = (label: any)=>{
        console.log('label', label) 
        
        switch (label) {
          case 'Transfer':
            handleNavigation(ROUTES.TRANSFER_STX)
            break;
        
          default:
            break;
        }
    }
    
  return (
    <div className={styles['home-page']}>
        <div className={styles['body']}>

            <div className={styles['back-icon']}>
                <BackIcon onClick={()=>handleNavigation(ROUTES.DASHBOARD)} />
            </div>

            <div className={styles['top-layer']}>
              <TransactionProvider>
                <Header  />
                <WalletNavigation onClick = {onClick} />  
                <TransactionHistory />  
              </TransactionProvider>
            </div>
        </div>
    </div>
  )
}

export default StxDetails
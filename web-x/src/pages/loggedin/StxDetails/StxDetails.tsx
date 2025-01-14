import React, { useEffect } from 'react'
import styles from './stxDetails.module.scss'
import Header from './_components/header/Header'
import { useRouter } from '@/context/routing/RouterContext';
import WalletNavigation from '../Dashboard/WalletNavigation';
import TokenBalance from '../Dashboard/TokenBalance';
import BackIcon from '@/design-system/_components/BackIcon/BackIcon';
import { ROUTES } from '@/context/routing/constants';
import TransactionHistory from './_components/transactionhistory/TransactionHistory';
import { TransactionProvider } from './context/TransactionContext';
import { useAccount } from '@/context/stxfetch/AccountContext';

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

    const {
      accountDetails,
      accountBalance,
      transactionHistory,
      fetchAccountDetails,
      fetchAccountBalance,
      fetchTransactionHistory,
    } = useAccount();

    useEffect(() => {

      (async ()=>{
        await fetchAccountDetails();
        await fetchAccountBalance();
        await fetchTransactionHistory();  
      })()
    }, [
    ]);
    
    
  return (
    <div className={styles['home-page']}>
        <div className={styles['body']}>

            <div className={styles['back-icon']}>
                <BackIcon onClick={()=>handleNavigation(ROUTES.DASHBOARD)} />
            </div>

            <div className={styles['top-layer']}>
              <TransactionProvider>
                <Header accountBalance = {accountBalance} />
                <WalletNavigation onClick = {onClick} />  
                <TransactionHistory />  
              </TransactionProvider>
            </div>
        </div>
    </div>
  )
}

export default StxDetails
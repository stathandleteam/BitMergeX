import React, { useEffect, useState } from 'react'
import styles from './AccountList.module.scss'
import BackIcon from '@/design-system/_components/BackIcon/BackIcon';
import { useRouter } from '@/routing/RouterContext';
import { ROUTES } from '@/routing/constants';
import AccountCard from './AccountCard';
import { FaEthereum } from 'react-icons/fa';
import { Button } from '@/design-system/_components/Button/Button';
const AccountList = () => {

  const { navigate,  } = useRouter();

  const [accounts, setAccounts] = useState<number[]>();

  useEffect(() => {
    setAccounts([0, 1])
  }, [])
  

  const handleNavigation = async (route: string) => {
      navigate(route, { id: '123' });
  };

  const handleGenerateAccount = async ()=>{

  }

  const handleGenerateHardwareWallet = async ()=>{
      
  }

  return (
    <div className={styles['home-page']}>
        <div className={styles['body']}>

            <div className={styles['back-icon']}>
                <BackIcon onClick={()=>handleNavigation(ROUTES.DASHBOARD)} />
            </div>

            <div className={styles['top-layer']}>

                <span className={styles['title']}>
                    Accounts
                </span>
                <div className={styles.tokenList}>
                    <AccountCard
                        symbol="Account 01"
                        name="0x3eeB455d...4D22003a18"
                        balance={1000}
                        fiatValue={3000}
                        icon={<FaEthereum />}
                    />

                    <AccountCard
                        symbol="Account 02"
                        name="0x3eeB455d...4D22003a18"
                        balance={1000}
                        fiatValue={3000}
                        icon={<FaEthereum />}
                    />                    
                </div>
            </div>

            <div className={styles['onboarding-buttons']}>
                <Button variant="secondary" style={{width: '100%'}} onClick={()=>handleGenerateAccount()}>Connect Account</Button>
                <Button variant="secondary" style={{width: '100%'}} onClick={()=>handleGenerateHardwareWallet()}>Generate Hardware Wallet</Button>
            </div>
        </div>
    </div>
  )
}

export default AccountList
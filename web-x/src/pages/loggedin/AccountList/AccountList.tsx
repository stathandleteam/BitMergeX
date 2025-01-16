import React, { useEffect, useState } from 'react'
import styles from './AccountList.module.scss'
import BackIcon from '@/design-system/_components/BackIcon/BackIcon';
import { useRouter } from '@/context/routing/RouterContext';
import { ROUTES } from '@/context/routing/constants';
import AccountCard from './AccountCard';
import { FaEthereum } from 'react-icons/fa';
import { Button } from '@/design-system/_components/Button/Button';
import { useAccount } from '@/context/stxfetch/AccountContext';
import { shortenAddress } from '@/design-system/utils/utils';
import { StxAccountManager } from '@/app/dbmangers/StxAccountManager';
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

    const {
        walletAccounts,
        fetchAllAccountsIncludingBalance,
        stxAccountIndex, 
        setStxAccountIndex,
        handleAddNewAccount,
        handleSetStxAccountIndex,
    } = useAccount();
  
      useEffect(() => {  
        (async ()=>{
            await fetchAllAccountsIncludingBalance();
            })()
        }, []);

      const handleOnClick = async (id: number)=>{
        try {
            setStxAccountIndex(id);
            await handleSetStxAccountIndex(id);
            setTimeout(()=>{
                handleNavigation(ROUTES.DASHBOARD)
            }, 100)
        } catch (error:any) {
            console.log(error.message)
        }
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
                    {walletAccounts.map((account: any, index: number)=>{
                        return (
                            <AccountCard
                                onClick={()=>handleOnClick(index)}
                                key={index}
                                symbol={`Account ${index + 1}`}
                                name={shortenAddress(account.address)}
                                balance={account.addressBalance?.toFixed(2) || '0'}
                                fiatValue={parseFloat((account.addressBalance * account.stxPriceInDollar)?.toFixed(2) || '0')}
                                icon={<></>}
                                selected={index === stxAccountIndex}
                            />
                        )
                    })}
                    {/* <AccountCard
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
                    />                     */}
                </div>
            </div>

            <div className={styles['onboarding-buttons']}>
                <Button variant="secondary" style={{width: '100%'}} onClick={()=>handleAddNewAccount()}>Connect Account</Button>
                <Button variant="secondary" style={{width: '100%'}} onClick={()=>handleGenerateHardwareWallet()}>Generate Hardware Wallet</Button>
            </div>
        </div>
    </div>
  )
}

export default AccountList
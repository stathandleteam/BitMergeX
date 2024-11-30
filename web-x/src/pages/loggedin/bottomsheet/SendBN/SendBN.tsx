import React from 'react'
import styles from './SendBN.module.scss'
import { FaEthereum } from 'react-icons/fa'
import TokenBalance from '../../Dashboard/TokenBalance';

const SendBN = ({children}: {children: React.ReactNode}) => {
  return (
    < >

        <span className={styles['title']}>
                    Account 1
            </span>
                <div className={styles.tokenList}>
                    {/* <Card
                        symbol="Stx"
                        name="Stacks"
                        icon={<FaEthereum />}
                    />

                    <Card
                        symbol="Btc"
                        name="Bitcoin"
                        icon={<FaEthereum />}
                    />                     */}
     
        { children}

                </div>

    </>
  )
}

export default SendBN
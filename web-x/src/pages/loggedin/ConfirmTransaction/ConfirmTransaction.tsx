import React from 'react';
import styles from './ConfirmTransaction.module.scss';
import { IoIosArrowDown } from 'react-icons/io';
import { MdContentCopy } from 'react-icons/md';
import { IoMdPerson } from 'react-icons/io';
import { IoRefreshCircleOutline } from 'react-icons/io5';
import { AmountSection, FeeSection, RecipientSection } from './_components/RecipientSection';

interface ConfirmTransactionProps {
  amount: string;
//   recipient: string;
  fee: { stx: string; usd: string };
  walletAddress: string;
  network: string;
  onConfirm: () => void;
  onCancel: () => void;
  addresses: any[];
    isBulkMode: boolean;
    totalTransferAmount: number;
    tokenShortName:string;
}

const FeeComponent = ({ label, primaryValue, secondaryValue }: { label: string; primaryValue: string; secondaryValue: string }) => {
    return (
      <div className={styles["fee-container"]}>
        <div className={styles["fee-label"]}>{label}</div>
        <div className={styles["fee-details"]}>
          <div className={styles["fee-values"]}>
            <div className={styles["fee-primary"]}>{primaryValue}</div>
            <div className={styles["fee-secondary"]}>{secondaryValue}</div>
          </div>
        </div>
      </div>
    );
  };

const ConfirmTransaction: React.FC<ConfirmTransactionProps> = ({
    amount,
    // recipient,
    fee,
    walletAddress,
    network,
    onConfirm,
    onCancel,
    addresses,
    isBulkMode,
    totalTransferAmount,
    tokenShortName
}) => {
  return (
      
      <div className={styles.content}>
        <div className={styles.amount}>
            <div className={styles['token-container']}>
                <div className={styles.value}> {tokenShortName}</div>
                <div className={styles.usd}> 
                    <span className={styles['token-value']}>
                        ${(parseFloat(amount)).toFixed(2)}
                    </span>
                    <span className={styles['token-name']}>
                        {parseFloat(amount).toFixed(2)}<span>{tokenShortName}</span>
                    </span>
                </div>
            </div>
        
          <div className={styles.recipient}>
          <div className={styles.reviewAddress}>
            {/* <span>{recipient}</span> */}
            {addresses.map((addr, index) => (
                  <div key={addr.id} className={styles.address }>
                    {/* <span>{index + 1}.</span> */}
                    <span>{addr.value}</span>

                    <div className={styles.actions}>
                        <button className={styles.iconButton}>
                            <MdContentCopy size={14} />
                        </button>
                        <button className={styles.iconButton}>
                            <IoMdPerson size={14} />
                        </button>
                    </div>
                  </div>
                ))}
            
          </div>
        </div>
        </div>
{/* Reusable Sections */}
        {/* <RecipientSection recipients={addresses} /> */}
      <AmountSection
        amount={amount}
        isBulkMode={isBulkMode}
        total={totalTransferAmount}
      />
      {/* <FeeSection fee={fee} /> */}

        <FeeComponent label={'Miner Fee'} primaryValue={fee.stx} secondaryValue={fee.usd} />

        <FeeComponent label={'Wallet Used'} primaryValue={walletAddress} secondaryValue={''} />


        <FeeComponent label={'Network'} primaryValue={network} secondaryValue={''} />
        {/* <FeeComponent label="Wallet Used" primaryValue={walletAddress} secondaryValue="" />
        <FeeComponent label="Network" primaryValue={network} secondaryValue="" /> */}
      </div>

      
  );
};

export default ConfirmTransaction;
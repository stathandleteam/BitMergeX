import React, { useState } from 'react';
import styles from './ConfirmTransaction.module.scss';
import { IoIosArrowDown } from 'react-icons/io';
import { MdContentCopy } from 'react-icons/md';
import { IoMdPerson } from 'react-icons/io';
import { IoRefreshCircleOutline } from 'react-icons/io5';
import { AmountSection, FeeSection, RecipientSection } from './_components/RecipientSection';
import TransactionSummary from './_components/TransactionSummary';

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
    dollarToOneStx: number
}

export const FeeComponent = ({ label, primaryValue, secondaryValue }: { label: string; primaryValue: string; secondaryValue: string }) => {
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
    tokenShortName,
    dollarToOneStx
}) => {

    // const dollarToOneStx = 2 //usd;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const hasMultipleAddresses = addresses.length > 1;
    const noOfRecipient =  addresses.length;
    const usdAmount = (parseFloat(amount.toString()) * dollarToOneStx * noOfRecipient)?.toFixed(2) || '0';
    const tokenAmount = (parseFloat(amount.toString()) * noOfRecipient)?.toFixed(2) || '0' ;
  
    const handleCopy = (text: string) => {
      navigator.clipboard.writeText(text);
      // You might want to add a toast notification here
    };
  
    const handleExternalLink = (address: string) => {
      // Implement your external link handler
      window.open(`https://explorer.stacks.co/address/${address}`, '_blank');
    };
  return (
      
      <div className={styles.content}>
        <div className={styles.amount}>
            <div className={styles['token-container']}>

              <div style={{display: 'flex', alignItems: 'center'}}>
                <div className={styles['token-value']}>{tokenAmount}</div>
                <div className={styles.value}> {tokenShortName}</div>
              </div>
                <div className={styles.usd}> 
                    <span className={styles['token-value-1']}>
                        ${usdAmount}
                    </span>
                    {/* <span className={styles['token-name']}>
                        {tokenAmount}<span>{tokenShortName}</span>
                    </span> */}
                </div>
            </div>
        
          {/* <div className={styles.recipient}>
          <div className={styles.reviewAddress}>
            {addresses.map((addr, index) => (
                  <div key={addr.id} className={styles.address }>
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
        </div> */}
        </div>

        {/* Recipient Section */}
      <div className={styles.recipientSection}>
        <h3 className={styles.sectionTitle}>Recipient</h3>
        <div className={styles.addressList}>
          {addresses.map((addr, index) => (
            <div key={index} className={styles.addressItem}>
              <p className={styles.address}>{addr.value}</p>
              <div className={styles.actions}>
                <button 
                  className={styles.iconButton}
                  onClick={() => handleCopy(addr.value)}
                  title="Copy address"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth="2" 
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" 
                    />
                  </svg>
                </button>
                <button 
                  className={styles.iconButton}
                  onClick={() => handleExternalLink(addr.value)}
                  title="View in explorer"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth="2" 
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" 
                    />
                  </svg>
                </button>
              </div>
            </div>
          ))}

        </div>
        {hasMultipleAddresses && (
            <button 
              className={styles.viewAllButton}
              onClick={() => setIsModalOpen(true)}
            >
              View all recipients ({addresses.length})
            </button>
          )}
      </div>

{/* Reusable Sections */}
        {/* <RecipientSection recipients={addresses} /> */}
      {/* {isBulkMode && <AmountSection
        amount={amount}
        isBulkMode={isBulkMode}
        total={totalTransferAmount}
      />} */}
      {/* <FeeSection fee={fee} /> */}

      <FeeComponent label={'Per Address'} primaryValue={`${amount} STX`} secondaryValue={''} />


      {isBulkMode && <FeeComponent label={'Total'} primaryValue={`${totalTransferAmount?.toFixed(2) || '0'} STX`} secondaryValue={''} />}

        <FeeComponent label={'Miner Fee'} primaryValue={fee.stx} secondaryValue={fee.usd} />

        <FeeComponent label={'Wallet Used'} primaryValue={walletAddress} secondaryValue={''} />


        <FeeComponent label={'Network'} primaryValue={network} secondaryValue={''} />
        {/* <FeeComponent label="Wallet Used" primaryValue={walletAddress} secondaryValue="" />
        <FeeComponent label="Network" primaryValue={network} secondaryValue="" /> */}

<TransactionSummary 
          addresses = {addresses}
          isModalOpen = {isModalOpen}
          setIsModalOpen = {setIsModalOpen}
        />
      </div>

      
  );
};

export default ConfirmTransaction;
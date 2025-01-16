// TransactionSummary.tsx
import React, { Dispatch, SetStateAction, useState } from 'react';
// import { TransactionSummaryProps } from './types';
import styles from './TransactionSummary.module.scss';

export interface Address {
    value: string;
  }
  
export interface TransactionSummaryProps {
    addresses: Address[];
    isModalOpen: boolean; 
    setIsModalOpen: Dispatch<SetStateAction<boolean>>;
  }

  interface AddressListProps {handleExternalLink: (address: string)=>void, handleCopy: (address: string)=>void, items: Address[], isModal?: boolean };

  

export const AddressList = ({ items, isModal = false, handleCopy, handleExternalLink }: AddressListProps) => (
    <div className={`${styles.addressList} ${isModal ? styles.expanded : ''}`}>
      {items.map((addr, index) => (
        <div key={index} className={styles.addressItem}>
         {isModal && <span className={styles.addressIndex}>{index + 1}</span>}

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
  );


export const TransactionSummary: React.FC<TransactionSummaryProps> = ({
  addresses,
  isModalOpen, 
  setIsModalOpen
}) => {

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    // Add toast notification here
  };

  const handleExternalLink = (address: string) => {
    window.open(`https://explorer.stacks.co/address/${address}`, '_blank');
  };


  return (
    <>
      {/* <div className={styles.container}> */}
        {/* Keep existing amount section */}
        
        {/* Updated Recipient Section */}
        {/* <div className={styles.recipientSection}>
          <h3 className={styles.sectionTitle}>Recipient</h3>
          <AddressList 
            items={addresses} 
            handleExternalLink={handleExternalLink} 
            handleCopy={handleCopy} 
          />
          {hasMultipleAddresses && (
            <button 
              className={styles.viewAllButton}
              onClick={() => setIsModalOpen(true)}
            >
              View all recipients ({addresses.length})
            </button>
          )}
        </div> */}

        {/* Keep existing fee section */}
      {/* </div> */}

      {/* Modal */}
      {isModalOpen && (
        <div className={styles.modal} onClick={() => setIsModalOpen(false)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Recipients ({addresses.length})</h3>
              <button 
                className={styles.closeButton}
                onClick={() => setIsModalOpen(false)}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="2" 
                    d="M6 18L18 6M6 6l12 12" 
                  />
                </svg>
              </button>
            </div>
            <div className={styles.modalBody}>
              <AddressList 
                items={addresses} 
                isModal={true} 
                handleExternalLink={handleExternalLink} 
                handleCopy={handleCopy} 
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TransactionSummary;
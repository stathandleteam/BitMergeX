import React from 'react';
import { 
  BiXCircle, 
  BiCopy,
  BiLinkExternal 
} from 'react-icons/bi';
import styles from './TransactionDetailModal.module.scss';
import { useTransactions } from '@/pages/loggedin/StxDetails/context/TransactionContext';

// Utility function to format date with time
const formatFullDate = (dateString: string) => {
  return new Date(dateString).toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });
};

// Utility function to copy to clipboard
const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text)
    .then(() => {
      // You might want to replace this with a toast notification
      alert('Copied to clipboard');
    })
    .catch(err => {
      console.error('Failed to copy', err);
    });
};

const TransactionDetailModal: React.FC = () => {
  const { selectedTransaction, setSelectedTransaction } = useTransactions();

  // If no transaction is selected, return null
  if (!selectedTransaction) return null;

  // Close modal
  const handleClose = () => {
    setSelectedTransaction(null);
  };

  // Open transaction in block explorer
  const openBlockExplorer = () => {
    if (selectedTransaction.txHash) {
      // Replace with actual block explorer URL for your blockchain
      const explorerUrl = `https://explorer.stacks.co/txid/${selectedTransaction.txHash}`;
      window.open(explorerUrl, '_blank', 'noopener,noreferrer');
    }
  };

  // Render transaction details row
  const renderDetailRow = (label: string, value: string | number | undefined, copyable?: boolean) => {
    if (value === undefined) return null;
    
    return (
      <div className={styles.detailItem}>
        <span className={styles.detailLabel}>{label}</span>
        <div className={styles.detailValueContainer}>
          <span className={styles.detailValue}>{value}</span>
          {copyable && (
            <button 
              className={styles.copyButton} 
              onClick={() => copyToClipboard(String(value))}
            >
              <BiCopy />
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className={styles.modalOverlay} onClick={handleClose}>
      <div 
        className={styles.modalContent} 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={styles.modalHeader}>
          <h2>Transaction Details</h2>
          <button 
            className={styles.closeButton} 
            onClick={handleClose}
          >
            <BiXCircle />
          </button>
        </div>

        {/* Transaction Summary */}
        <div className={styles.transactionSummary}>
          <div className={`${styles.transactionAmount} ${
            selectedTransaction.type === 'send' ? styles.sendAmount : 
            selectedTransaction.type === 'receive' ? styles.receiveAmount : 
            styles.transferAmount
          }`}>
            {selectedTransaction.type === 'send' ? '-' : '+'}
            {selectedTransaction.amount} {selectedTransaction.token}
          </div>
          <div className={`${styles.transactionStatus} ${
            selectedTransaction.status === 'completed' ? styles.completedStatus :
            selectedTransaction.status === 'pending' ? styles.pendingStatus :
            styles.failedStatus
          }`}>
            {selectedTransaction.status.charAt(0).toUpperCase() + selectedTransaction.status.slice(1)}
          </div>
        </div>

        {/* Transaction Details */}
        <div className={styles.detailSection}>
          {renderDetailRow('Type', 
            selectedTransaction.type.charAt(0).toUpperCase() + selectedTransaction.type.slice(1)
          )}
          {renderDetailRow('Date', formatFullDate(selectedTransaction.date))}
          {renderDetailRow('Description', selectedTransaction.description)}
          
          {selectedTransaction.to && renderDetailRow('To', selectedTransaction.to, true)}
          {selectedTransaction.from && renderDetailRow('From', selectedTransaction.from, true)}
          
          {renderDetailRow('Transaction Fee', 
            selectedTransaction.transactionFee ? 
            `${selectedTransaction.transactionFee} ${selectedTransaction.token}` : 
            undefined
          )}
          
          {renderDetailRow('Block Height', selectedTransaction.blockHeight)}
          {renderDetailRow('Confirmations', selectedTransaction.confirmations)}
          
          {selectedTransaction.txHash && (
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Transaction Hash</span>
              <div className={styles.detailValueContainer}>
                <span className={styles.detailValue}>{selectedTransaction.txHash}</span>
                <div className={styles.actionButtons}>
                  <button 
                    className={styles.copyButton} 
                    onClick={() => copyToClipboard(selectedTransaction.txHash!)}
                  >
                    <BiCopy />
                  </button>
                  <button 
                    className={styles.explorerButton} 
                    onClick={openBlockExplorer}
                  >
                    <BiLinkExternal />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionDetailModal;
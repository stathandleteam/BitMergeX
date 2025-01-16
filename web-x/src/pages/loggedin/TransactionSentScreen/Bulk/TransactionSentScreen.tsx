import React from 'react';
import { FaCheck, FaCopy, FaExternalLinkAlt } from 'react-icons/fa';
import styles from './TransactionSentScreen.module.scss';
import ScreenWrapper from '@/pages/ScreenWrapper/ScreenWrapper';
import { shortenToken } from '@/design-system/utils/utils';

interface TransactionDetails {
  txId: string;
  amount: number;
  recipient: string;
  timestamp: number;
}

interface TransactionSentScreenProps {
  transactionDetails: TransactionDetails;
  onClose: () => void;
}

const TransactionSentScreen: React.FC<TransactionSentScreenProps> = ({ 
  transactionDetails, 
  onClose 
}) => {
  const [copied, setCopied] = React.useState(false);

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const copyTxId = () => {
    navigator.clipboard.writeText(transactionDetails.txId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const openExplorer = () => {
    const explorerUrl = `https://explorer.stacks.co/txid/${transactionDetails.txId}`;
    window.open(explorerUrl, '_blank', 'noopener,noreferrer');
  };


  return (
    <ScreenWrapper>

    <div className={styles.transactionSentContainer}>
      <div className={styles.successIcon}>
        <FaCheck />
      </div>
      
      <span role='heading' className={styles.title}>Bulk Transactions Sent</span>
      
      <div className={styles.transactionDetails}>
        
        <div className={styles.detailRow}>
          {/* <span className={styles.label}>Amount</span> */}
          <span className={styles.value}>{transactionDetails.amount} STX</span>
          <span className={styles.value}><span className={styles['sent-to']}>Sent to</span> {shortenToken(transactionDetails.recipient)}</span>
          <span className={styles['view-explorer']} onClick={openExplorer}>View on Explorer <FaExternalLinkAlt /></span>
        </div>
        
        <div className={styles.detailRow}>
          {/* <span className={styles.label}>Amount</span> */}
          <span className={styles.value}>{transactionDetails.amount} STX</span>
          <span className={styles.value}><span className={styles['sent-to']}>Sent to</span> {shortenToken(transactionDetails.recipient)}</span>
          <span className={styles['view-explorer']} onClick={openExplorer}>View on Explorer <FaExternalLinkAlt /></span>
        </div>
        
        <div className={styles.detailRow}>
          {/* <span className={styles.label}>Amount</span> */}
          <span className={styles.value}>{transactionDetails.amount} STX</span>
          <span className={styles.value}><span className={styles['sent-to']}>Sent to</span> {shortenToken(transactionDetails.recipient)}</span>
          <span className={styles['view-explorer']} onClick={openExplorer}>View on Explorer <FaExternalLinkAlt /></span>
        </div>

        <div className={styles.detailRow}>
          {/* <span className={styles.label}>Amount</span> */}
          <span className={styles.value}>{transactionDetails.amount} STX</span>
          <span className={styles.value}><span className={styles['sent-to']}>Sent to</span> {shortenToken(transactionDetails.recipient)}</span>
          <span className={styles['view-explorer']} onClick={openExplorer}>View on Explorer <FaExternalLinkAlt /></span>
        </div>

        <div className={styles.detailRow}>
          {/* <span className={styles.label}>Amount</span> */}
          <span className={styles.value}>{transactionDetails.amount} STX</span>
          <span className={styles.value}><span className={styles['sent-to']}>Sent to</span> {shortenToken(transactionDetails.recipient)}</span>
          <span className={styles['view-explorer']} onClick={openExplorer}>View on Explorer <FaExternalLinkAlt /></span>
        </div>

        {/* <div className={styles.detailRow}>
          <span className={styles.label}>Recipient</span>
          <span className={styles.value}>{shortenToken(transactionDetails.recipient)}</span>
        </div> */}
        
        {/* <div className={styles.detailRow}>
          <span className={styles.label}>Transaction ID</span>
          <div className={styles.txIdContainer}>
            <span className={styles.txId}>{transactionDetails.txId}</span>
            <button 
              className={styles.copyButton} 
              onClick={copyTxId}
              aria-label="Copy Transaction ID"
            >
              {copied ? <FaCheck /> : <FaCopy />}
            </button>
          </div>
        </div>
        
        <div className={styles.detailRow}>
          <span className={styles.label}>Timestamp</span>
          <span className={styles.value}>
            {formatTimestamp(transactionDetails.timestamp)}
          </span>
        </div> */}
      </div>
      
      <div className={styles.actions}>
        {/* <button 
          className={styles.explorerButton} 
          onClick={openExplorer}
        >
          View on Explorer <FaExternalLinkAlt />
        </button> */}
        
        <button 
          className={styles.closeButton} 
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
    </ScreenWrapper>
  );
};

export default TransactionSentScreen;
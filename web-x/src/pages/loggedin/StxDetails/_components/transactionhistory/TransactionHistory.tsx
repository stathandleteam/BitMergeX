// TransactionHistory.tsx
import React, { useEffect, useRef, useCallback } from 'react';
import { 
  BiArrowToRight, 
  BiArrowFromRight, 
  BiTransfer,
  BiDotsVerticalRounded
} from 'react-icons/bi';
import styles from './TransactionHistory.module.scss';
import { Transaction, useTransactions } from '@/pages/loggedin/StxDetails/context/TransactionContext';

import TransactionDetailModal from '../transactionDetailModal/TransactionDetailModal';

// Utility functions
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

// Icon mapping for transaction types
const TransactionIcon = {
  send: <BiArrowToRight className={styles.sendIcon} />,
  receive: <BiArrowFromRight className={styles.receiveIcon} />,
  transfer: <BiTransfer className={styles.transferIcon} />
};

const TransactionHistory: React.FC = ({limit = 2}: {limit?: number}) => {
  const { 
    transactions, 
    isLoading, 
    hasMore, 
    error, 
    fetchMoreTransactions,
    setSelectedTransaction
  } = useTransactions();

  // Intersection Observer for infinite scroll
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreTriggerRef = useRef<HTMLDivElement>(null);

  const handleIntersection = useCallback((entries: IntersectionObserverEntry[]) => {
    const [entry] = entries;
    if (entry.isIntersecting && hasMore && !isLoading) {
      fetchMoreTransactions();
    }
  }, [fetchMoreTransactions, hasMore, isLoading]);

  useEffect(() => {
    // Set up Intersection Observer
    if (loadMoreTriggerRef.current) {
      observerRef.current = new IntersectionObserver(handleIntersection, {
        root: null,
        rootMargin: '20px',
        threshold: 1.0
      });

      if (loadMoreTriggerRef.current) {
        observerRef.current.observe(loadMoreTriggerRef.current);
      }
    }

    // Cleanup
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [handleIntersection]);

  // Truncate wallet address
  const truncateAddress = (address?: string) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Open transaction detail modal
  const handleTransactionClick = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
  };

  // Render loading state
  if (transactions.length === 0 && isLoading) {
    return (
      <div className={styles.transactionHistory}>
        <div className={styles.header}>
          <h3>Transaction History</h3>
        </div>
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <p>Loading transactions...</p>
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className={styles.transactionHistory}>
        <div className={styles.header}>
          <h3>Transaction History</h3>
        </div>
        <div className={styles.errorContainer}>
          <p>{error}</p>
          <button 
            onClick={fetchMoreTransactions} 
            className={styles.retryButton}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.transactionHistory}>
      <div className={styles.header}>
        <h3>Transaction History</h3>
        {/* <span className={styles.seeAll}>See All</span> */}
      </div>
      {transactions.length === 0 ? (
        <div className={styles.emptyState}>
          <p>No transactions found</p>
        </div>
      ) : (
        <>
          <div className={styles.transactionList}>
            {transactions.map((transaction) => (
              <div 
                key={transaction.id} 
                className={styles.transactionItem}
              >
                {/* <div className={styles.transactionIconContainer}>
                  {TransactionIcon[transaction.type]}
                </div>
                <div className={styles.transactionDetails}>
                  <div className={styles.transactionType}>
                    {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                    {transaction.to && <span className={styles.transactionAddress}>
                      {' '}to {truncateAddress(transaction.to)}
                    </span>}
                    {transaction.from && <span className={styles.transactionAddress}>
                      {' '}from {truncateAddress(transaction.from)}
                    </span>}
                  </div>
                  <div className={styles.transactionDescription}>
                    {transaction.description}
                  </div>
                  <div className={styles.transactionDate}>
                    {formatDate(transaction.date)}
                  </div>
                </div>
                <div className={styles.transactionAmountContainer}>
                  <div className={`${styles.transactionAmount} ${
                    transaction.type === 'send' ? styles.sendAmount : 
                    transaction.type === 'receive' ? styles.receiveAmount : 
                    styles.transferAmount
                  }`}>
                    {transaction.type === 'send' ? '-' : '+'}
                    {transaction.amount} {transaction.token}
                  </div>
                  <div className={`${styles.transactionStatus} ${
                    transaction.status === 'completed' ? styles.completedStatus :
                    transaction.status === 'pending' ? styles.pendingStatus :
                    styles.failedStatus
                  }`}>
                    {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                  </div>
                </div>
                <button className={styles.moreOptionsBtn}
                                onClick={() => handleTransactionClick(transaction)}
                >
                  <BiDotsVerticalRounded />
                </button> */}
                <div key={transaction.id} className={styles.transactionItem}>
            <div className={styles.transactionIconContainer}>
              {TransactionIcon[transaction.type]}
            </div>
            <div className={styles.transactionDetails}>
            
              <div className={styles.transactionType}>
                    {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                    {transaction.to && <span className={styles.transactionAddress}>
                      {' '}to {truncateAddress(transaction.to)}
                    </span>}
                    {transaction.from && <span className={styles.transactionAddress}>
                      {' '}from {truncateAddress(transaction.from)}
                    </span>}
                </div>
              <div className={styles.transactionDate}>{formatDate(transaction.date)}</div>
            </div>
            <div className={styles.transactionAmountContainer}>
              <div className={`${styles.transactionAmount} ${
                transaction.type === 'send' ? styles.sendAmount : styles.receiveAmount
              }`}>
                {transaction.type === 'send' ? '-' : '+'}
                {transaction.amount} {transaction.token}
              </div>
              <div className={`${styles.transactionStatus} ${
                    transaction.status === 'completed' ? styles.completedStatus :
                    transaction.status === 'pending' ? styles.pendingStatus :
                    styles.failedStatus
                  }`}>
                    {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}

                    
              </div>
              
            </div>
            <button className={styles.moreOptionsBtn}
                                onClick={() => handleTransactionClick(transaction)}
                >
                  <BiDotsVerticalRounded />
                </button>
          </div>
              </div>
            ))}
          </div>
          
          {/* Load more trigger */}
          <div 
            ref={loadMoreTriggerRef} 
            className={styles.loadMoreTrigger}
          >
            {isLoading && (
                <div className={styles.loadingContainer}>
                <div className={styles.spinner}></div>
                <p>Loading transactions...</p>
              </div>
            )}
            { !hasMore && (
              <p className={styles.noMoreTransactions}>
                No more transactions
              </p>
            )}
          </div>
          
          {/* Transaction Detail Modal */}
          <TransactionDetailModal />
        </>
      )}
    </div>
  );
};

export default TransactionHistory;
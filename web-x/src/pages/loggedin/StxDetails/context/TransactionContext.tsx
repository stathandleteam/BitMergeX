import React, { 
    createContext, 
    useState, 
    useContext, 
    ReactNode, 
    useCallback,
    useRef,
    useEffect
  } from 'react';
  
  // Enhanced Transaction Type with more details
  export interface Transaction {
    id: string;
    type: 'send' | 'receive' | 'transfer';
    amount: number;
    token: string;
    date: string;
    status: 'completed' | 'pending' | 'failed';
    to?: string;
    from?: string;
    transactionFee?: number;
    description?: string;
    blockHeight?: number;
    confirmations?: number;
    txHash?: string;
  }
  
  // Context type
  interface TransactionContextType {
    transactions: Transaction[];
    isLoading: boolean;
    hasMore: boolean;
    error: string | null;
    fetchMoreTransactions: () => Promise<void>;
    selectedTransaction: Transaction | null;
    setSelectedTransaction: (transaction: Transaction | null) => void;
  }
  
  // Create context
  const TransactionContext = createContext<TransactionContextType>({
    transactions: [],
    isLoading: false,
    hasMore: true,
    error: null,
    fetchMoreTransactions: async () => {},
    selectedTransaction: null,
    setSelectedTransaction: () => {}
  });
  
  // Provider component
  export const TransactionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
    
    // Pagination state
    const pageRef = useRef(1);
    const itemsPerPage = 5;
  
    const fetchMoreTransactions = useCallback(async () => {
      // Prevent multiple simultaneous requests
      if (isLoading) return;
  
      setIsLoading(true);
      setError(null);
  
      try {
        // Simulated API call with pagination
        const generateMockTransactions = (page: number): Transaction[] => {
          const startIndex = (page - 1) * itemsPerPage;
          return Array.from({ length: itemsPerPage }, (_, index) => ({
            id: `${startIndex + index + 1}`,
            type: ['send', 'receive', 'transfer'][Math.floor(Math.random() * 3)] as Transaction['type'],
            amount: parseFloat((Math.random() * 100).toFixed(2)),
            token: 'STX',
            date: new Date(Date.now() - index * 86400000).toISOString(),
            status: ['completed', 'pending', 'failed'][Math.floor(Math.random() * 3)] as Transaction['status'],
            to: `0x${Math.random().toString(16).slice(2, 12)}`,
            from: `0x${Math.random().toString(16).slice(2, 12)}`,
            transactionFee: parseFloat((Math.random() * 0.1).toFixed(4)),
            description: ['Network transfer', 'Wallet deposit', 'Exchange trade'][Math.floor(Math.random() * 3)],
            blockHeight: startIndex + index + 10000,
            txHash: `0x${Math.random().toString(16).slice(2, 42)}`
          }));
        };
  
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const newTransactions = generateMockTransactions(pageRef.current);
        
        // Update transactions
        setTransactions(prev => [...prev, ...newTransactions]);
        
        // Increment page
        pageRef.current += 1;
  
        // Simulate reaching end of transactions after 5 pages
        if (pageRef.current > 5) {
          setHasMore(false);
        }
  
        setIsLoading(false);
      } catch (err) {
        setError('Failed to load more transactions');
        setIsLoading(false);
      }
    }, [isLoading]);
  
    // Automatically fetch initial transactions when provider mounts
    useEffect(() => {
      fetchMoreTransactions();
    }, []);
  
    // Provide context value
    const contextValue = {
      transactions,
      isLoading,
      hasMore,
      error,
      fetchMoreTransactions,
      selectedTransaction,
      setSelectedTransaction
    };
  
    return (
      <TransactionContext.Provider value={contextValue}>
        {children}
      </TransactionContext.Provider>
    );
  };
  
  // Custom hook for using transaction context
  export const useTransactions = () => {
    const context = useContext(TransactionContext);
    if (!context) {
      throw new Error('useTransactions must be used within a TransactionProvider');
    }
    
    return context;
  };
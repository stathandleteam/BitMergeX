import React, { createContext, useContext, useState, useEffect, Dispatch, SetStateAction } from 'react';

// Define the context type
interface AccountContextType {
  accountDetails: any | null;
  accountBalance: AccountBalanceProps;
  transactionHistory: any | null;
  fetchAccountDetails: () => Promise<void>;
  fetchAccountBalance: () => Promise<void>;
  fetchTransactionHistory: () => Promise<void>;
  walletAccounts: any | null;
  fetchAllAccountsIncludingBalance: () => Promise<void>; 
  stxAccountIndex: number; 
  setStxAccountIndex: Dispatch<SetStateAction<number>>;
  handleAddNewAccount: () => Promise<void>;
  handleSetStxAccountIndex: (index: number) => Promise<void>;
}

import { StxAccountManager } from '@/app/dbmangers/StxAccountManager';

// Create the context
const AccountContext = createContext<AccountContextType | null>(null);
export type AccountBalanceProps = { stxBalance: number, usdBalance:number}

export const AccountProvider = ({ children }: { children: React.ReactNode }) => {
  const [accountDetails, setAccountDetails] = useState<any | null>(null);
  const [accountBalance, setAccountBalance] = useState<AccountBalanceProps>({ stxBalance: 0, usdBalance: 0});
  const [transactionHistory, setTransactionHistory] = useState<any | null>(null);
  const [walletAccounts, setWalletAccounts] = useState<any[] | null[]>([]);
  const [stxAccountIndex, setStxAccountIndex] = useState<number>(0);
  
  useEffect(()=>{
    (async () => {
      const accountIndex = await StxAccountManager.retrieveStxAccountIndex()
      // networkType && setNetworkType(networkType);     
      if (accountIndex < 0) {
        throw new Error('Index cannot be negative');
      }
      setStxAccountIndex(accountIndex) 
      // chrome.runtime.sendMessage({ type: Actions.SET_ROUTER_STATE, payload });
      
    })
  },[])
  
  // Helper function to send requests
  const sendRequest = (action: string, payload?: any): Promise<any> => {
    return new Promise((resolve, reject) => {
      try {
        chrome.runtime.sendMessage({ action, ...payload }, (response: any) => {
          if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError.message);
            reject(chrome.runtime.lastError.message);
          } else {
            resolve(response);
          }
        });
      } catch (error) {
        console.error('Error sending request:', error);
        reject(error);
      }
    });
  };

  const handleSetStxAccountIndex = async (index: number) => {
    // await StxAccountManager.storeStxAccountIndex(index)
    try {
      setStxAccountIndex(index);
      await sendRequest('set-stx-account-index', { accountIndex: index });
    } catch (error) {
      console.error('Failed to set stx account index:', error);
    }
  }

  // Fetch account details
  const fetchAccountDetails = async () => {
    try {
      const details = await sendRequest('account-details');
      setAccountDetails(details);
    } catch (error) {
      console.error('Failed to fetch account details:', error);
    }
  };

  const handleAddNewAccount = async () => {
    try {
      await sendRequest('add-new-account-to-wallet');
      // setAccountDetails(details);
      await fetchAllAccountsIncludingBalance();
    } catch (error) {
      console.error('Failed to fetch account details:', error); 
    }
  }

  const fetchAllAccountsIncludingBalance = async () => {
    try {
      const details = await sendRequest('all-accounts-with-balances');
      setWalletAccounts(details.data || []);
    } catch (error) {
      console.error('Failed to fetch account details:', error);
    }
  }

  // Fetch account balance
  const fetchAccountBalance = async () => {
    try {
      const balance = await sendRequest('account-balance');
      setAccountBalance(balance?.data || 0);
    } catch (error) {
      console.error('Failed to fetch account balance:', error);
    }
  };

  // Fetch transaction history
  const fetchTransactionHistory = async () => {
    try {
      const history = await sendRequest('transaction-history');
      setTransactionHistory(history);
    } catch (error) {
      console.error('Failed to fetch transaction history:', error);
    }
  };

  return (
    <AccountContext.Provider
      value={{
        accountDetails,
        accountBalance,
        transactionHistory,
        fetchAccountDetails,
        fetchAccountBalance,
        fetchTransactionHistory,
        handleSetStxAccountIndex,
        walletAccounts,
        fetchAllAccountsIncludingBalance,
        stxAccountIndex, 
        setStxAccountIndex,

        handleAddNewAccount

      }}
    >
      {children}
    </AccountContext.Provider>
  );
};

// Hook to use the AccountContext
export const useAccount = () => {
  const context = useContext(AccountContext);
  if (!context) {
    throw new Error('useAccount must be used within an AccountProvider');
  }
  return context;
};
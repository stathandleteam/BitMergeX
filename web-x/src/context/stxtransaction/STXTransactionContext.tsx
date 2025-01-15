import { FormErrorsType, stxFormEmpty } from '@/pages/loggedin/TransferForm/hooks/useTransfer';
import React, { createContext, Dispatch, SetStateAction, useContext, useState } from 'react';
import { ROUTES } from '../routing/constants';

interface STXTransactionContextType {
  validateAmount: (amount: number) => Promise<{ success: boolean; errors?: string[] }>;
  validateAddress: (address: string) => Promise<{ success: boolean; errors?: string[] }>;
  sendSTX: (recipient: string, amount: number, memo?: string, feeConfig?: FeeConfig) => Promise<{ success: boolean; data?: { transactionId: string, fee: number }; error?: string }>;
  stxTransferErrors:  string[];
  setstxTransferErrors: Dispatch<SetStateAction<string[]>>;
  getStxPrice: () => Promise<{ success: boolean; data?: number; error?: string }>;
  transaction: { success: boolean; data?: { transactionId: string, fee: number, recipient: string, amount: number }; error?: string };
  fetchTransaction: () => Promise<void>;
}

type FeeConfig = {
  baseNetworkFee: number;
  appFee: number;
  feeReceiver?: string;
};

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

// Create the context
const STXTransactionContext = createContext<STXTransactionContextType | null>(null);

export const STXTransactionProvider = ({ children }: { children: React.ReactNode }) => {

  const [stxTransferErrors, setstxTransferErrors] = useState<string[]>(stxFormEmpty);
  const [transaction, setTransaction] = useState({ success: false, data: { transactionId: '', fee: 0, recipient: '', amount: 0 }, error: '' });

  // Exposed methods for the context using sendRequest
  const validateAmount = (amount: number) => sendRequest('validate-amount', { amount });
  const validateAddress = (address: string) => sendRequest('validate-address', { address });
  const sendSTX = async (recipient: string, amount: number, memo?: string, feeConfig?: FeeConfig) => {
    const transactionx = await sendRequest('send-stx', { recipient, amount, memo, feeConfig });
    await setTransaction(transaction)

    setTimeout(async ()=>{
      await sendRequest('transaction-history');
    }, 1000)

    return transactionx
  };

  const getStxPrice = () => sendRequest('get-stx-price');

  const fetchTransaction = async () => {
    try {
      const response =  await sendRequest('getLastRoute', { payload: 'testing' });
      if (response?.success) {
        if (response.routeParams) {
          setTransaction(response.routeParams[ROUTES.TRANSACTION_SENT_SCREEN] || { success: false, data: { transactionId: '', fee: 0, recipient: '', amount: 0 }, error: '' });
        }
      }
    } catch(error){
        console.log("working")
    }

  }
  // Provide the context
  return (
    <STXTransactionContext.Provider value={{fetchTransaction, validateAmount, validateAddress, sendSTX, stxTransferErrors, setstxTransferErrors, getStxPrice, transaction }}>
      {children}
    </STXTransactionContext.Provider>
  );
};

// Hook to use the STXTransactionContext
export const useSTXTransaction = () => {
  const context = useContext(STXTransactionContext);
  if (!context) {
    throw new Error('useSTXTransaction must be used within an STXTransactionProvider');
  }
  return context;
};
import TransactionSentScreen from "./Single/TransactionSentScreen";
import BulkTransactionSentScreen from "./Bulk/TransactionSentScreen";
import { useRouter } from "@/context/routing/RouterContext";
import { ROUTES } from "@/context/routing/constants";
import { useSTXTransaction } from "@/context/stxtransaction/STXTransactionContext";
import { useEffect, useState } from "react";

const TransactionSentScreenContainer = ()=> {

    const { previousRoute, navigate, params } = useRouter();


    const { fetchTransaction, transaction: {
        success, data, error
    }} = useSTXTransaction();
    
    useEffect(() => {
      (async ()=>{
        await fetchTransaction()
      })()
    }, [])

    const amount = data?.amount || 0;
    const recipient = data?.recipient || '';

    const mockTransactionDetails = {
      txId: data?.transactionId || '',
      amount: amount,
      recipient: recipient,
      timestamp: Date.now()
    };
    // const mockTransactionDetails = {
    //   txId: '0x1234567890abcdef...',
    //   amount: 100,
    //   recipient: 'SP3X6WGHH68BTHY39A5P39EKH1BWPZPZH0ZDPR1P5',
    //   timestamp: Date.now()
    // };
  
    return (
      <TransactionSentScreen 
        transactionDetails={mockTransactionDetails}
        onClose={() => {
            navigate(ROUTES.DASHBOARD)
        }}
      />
    );
  }

  export default TransactionSentScreenContainer
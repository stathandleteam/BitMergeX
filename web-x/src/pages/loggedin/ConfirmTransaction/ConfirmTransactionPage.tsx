

import React, { useState } from 'react';
import ConfirmTransaction from './ConfirmTransaction';

const ConfirmTransactionPage: React.FC = () => {
  const [amount, setAmount] = useState('0.0974');
  const [recipient, setRecipient] = useState('0xe5f2f...df97');
  const [fee, setFee] = useState({ eth: '0.8 GLMR', usd: '$1.50' });
  const [walletAddress, setWalletAddress] = useState('0x4269...DD60');
  const [network, setNetwork] = useState('Moonbeam');

  const handleConfirm = () => {
    // Perform the actual transfer transaction here
    console.log('Confirming transaction...');
  };

  const handleCancel = () => {
    // Navigate back or perform any other necessary actions
    console.log('Canceling transaction...');
  };

  return (
    <ConfirmTransaction
          amount={amount}
          recipient={recipient}
          fee={fee}
          walletAddress={walletAddress}
          network={network}
          onConfirm={handleConfirm}
          onCancel={handleCancel} 
          addresses={[]} 
          isBulkMode={false} 
          totalTransferAmount={0}    />
  );
};

export default ConfirmTransactionPage;
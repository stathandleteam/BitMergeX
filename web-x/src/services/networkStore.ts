// src/stores/networkStore.ts
import { proxy } from 'valtio';

// Define initial network state
export const networkStore = proxy({
  networkType: 'testnet' as 'mainnet' | 'testnet' | 'devnet', // default to Devnet
  get baseUrl() {
    switch (this.networkType) {
      case 'mainnet':
        return 'https://api.stacks.co/extended/v1';
      case 'testnet':
        return 'https://api.testnet.stacks.co/extended/v1';
      case 'devnet':
        return 'http://localhost:3999/extended/v1';
      default:
        throw new Error('Invalid network type');
    }
  },
});

// Function to update the network type
export const setNetworkType = (networkType: 'mainnet' | 'testnet' | 
    'devnet' ) => {
  networkStore.networkType = networkType;
};

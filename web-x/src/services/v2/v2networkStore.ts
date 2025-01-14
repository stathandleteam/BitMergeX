// src/stores/networkStore.ts
import { proxy } from 'valtio';

// Define initial network state
export const v2networkStore = proxy({
    networkType: 'testnet' as 'mainnet' | 'testnet' | 'devnet', // default to Testnet
    get baseUrl() {
      switch (this.networkType) {
        case 'mainnet':
          return 'https://api.stacks.co/v2'; // Updated to v2
        case 'testnet':
          return 'https://api.testnet.stacks.co/v2'; // Updated to v2
        case 'devnet':
          return 'http://localhost:3999/v2'; // Updated to v2, assuming devnet still uses localhost
        default:
          throw new Error('Invalid network type');
      }
    },
  });

// Function to update the network type
export const setV2NetworkType = (networkType: 'mainnet' | 'testnet' | 
    'devnet' ) => {
        v2networkStore.networkType = networkType;
};

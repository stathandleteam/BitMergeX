import { 
  makeSTXTokenTransfer,
  broadcastTransaction,
  AnchorMode,
  createStacksPrivateKey,
  pubKeyfromPrivKey,
  TransactionVersion,
  getAddressFromPublicKey,
  validateStacksAddress
} from '@stacks/transactions';
import { StacksMainnet, StacksTestnet, StacksNetwork, StacksDevnet } from '@stacks/network';
import { VITE_API_KEY } from '@/api/secrets';
import { StxWalletService } from './stx-wallet-service';
import { stxTransactionHistoryApi } from '@/services/stxTransactionHistoryApi';
import { store } from "@/app/store";
import { v2ExtendApi } from '@/services/v2/v2ExtendApi';
import { networkStore } from '@/services/networkStore';

const { dispatch } = store;

// Network Configuration
// enum StacksNetworkType {
//   Mainnet = 'mainnet',
//   Testnet = 'testnet',
//   Devnet = 'devnet'
// }

type StacksNetworkType = 'mainnet' | 'testnet' | 'devnet';

// Fee Configuration Interface
interface FeeConfig {
  baseNetworkFee: number;  // Base Stacks network fee
  appFee: number;          // Additional fee for the app
  feeReceiver?: string;    // Optional address to receive app fees
}

// Transaction Details Interface
interface TransactionDetails {
  recipient: string;
  amount: number;  // Amount in STX
  memo?: string;
}

// Validation Result Interface
interface ValidationResult {
  isValid: boolean;
  errors: string[];
  estimatedFee?: number;
}

class StacksTransactionManager {
  private network: StacksNetwork | undefined;
  private networkType: StacksNetworkType;
  private apiBaseUrl: string;

  constructor(networkType: StacksNetworkType = 'devnet') {
    this.networkType = networkType;
    this.initializeNetwork();
    this.apiBaseUrl = this.getApiBaseUrl();
  }

  /**
   * Initialize network based on network type
   */
  private initializeNetwork() {
    switch (this.networkType) {
      case 'mainnet':
        this.network = new StacksMainnet();
        break;
      case 'testnet':
        this.network = new StacksTestnet();
        break;
      case 'devnet':
        this.network = new StacksDevnet({
          // url: `https://api.platform.hiro.so/v1/ext/${VITE_API_KEY}/stacks-blockchain-api`,
          // url: 'http://localhost:3999',
        });
        break;
    }
  }

  /**
   * Get appropriate API base URL
   */
  private getApiBaseUrl(): string {
      switch (this.networkType) {
          // case 'mainnet':                
          //     return 'https://api.stacks.co/extended/v1';
          // case 'testnet'::
          //     return 'https://api.testnet.stacks.co/extended/v1'
          // case 'devnet':
          //     return 'http://localhost:3999'

          case 'mainnet':
              return 'https://api.stacks.co/extended/v1';
          case 'testnet':
              return 'https://api.testnet.stacks.co/extended/v1';
          case 'devnet':
              return 'http://localhost:3999/extended/v1';
            
          default:
              return 'http://localhost:3999/extended/v1';
      }
  }

 /**
* Validate STX Address
* @param address - The STX address to validate
* @returns An object with validation result and potential error messages
*/
validateAddress(address: string): { isValid: boolean; errors?: string[] } {
const errors: string[] = [];

// Check if address is empty or just whitespace
if (!address.trim()) {
  errors.push("Address cannot be empty or just whitespace.");
} else {

  const isValid = validateStacksAddress(address);
  if (!isValid) {
    errors.push("Invalid STX address format. Address should start with 'ST' or 'SP' followed by 38 alphanumeric characters.");
  }
}

return {
  isValid: errors.length === 0,
  ...(errors.length > 0 && { errors })
};
}

  /**
   * Validate transaction amount
   * @param amount - The amount in STX to validate
   * @returns An object with validation result and potential error messages
   */
  validateAmount(amount: number): { isValid: boolean; errors?: string[] } {
    const errors: string[] = [];
    
    if (amount === null) {
      errors.push("Amount cannot be empty or just whitespace.");
    } 
    if (amount <= 0) {
      errors.push("Amount must be greater than zero.");
    }
    
    if (amount >= 1_000_000) {
      errors.push("Amount exceeds the reasonable upper limit of 1,000,000 STX.");
    }

    // Check for precision (assuming STX supports up to 6 decimal places)
    if (!Number.isInteger(amount * 1000000)) {
      errors.push("Amount must be precise to 6 decimal places (e.g., 1.000000 STX).");
    }

    return {
      isValid: errors.length === 0,
      ...(errors.length > 0 && { errors })
    };
  }  

  /**
   * Estimate transaction fee from Stacks network
   */
  async estimateNetworkFee(): Promise<number> {
    // try {
    //   const response = await dispatch(v2ExtendApi.endpoints.getTransferFee.initiate());
      
    //   // Wait for the query to complete and check if the data is available
    //   const { data } = await response;
      
    //   // Ensure 'estimated_fee_rate' exists in the response
    //   if (data && 'estimated_fee_rate' in data) {
    //     return data.estimated_fee_rate / 1_000_000; // Convert from microSTX to STX
    //   } 
    //   else {
    //     throw new Error('Invalid fee response structure');
    //   }
    // } catch (error: any) {
    //   console.error('Failed to fetch network fee:', error.message);
      
    //   // Handle RTK Query errors
    //   if (error.originalStatus) {
    //     console.error('RTK Query error:', `Status: ${error.originalStatus}, Message: ${error.message}`);
    //   } else {
    //     console.error('Unknown Error:', error);
    //   }
  
      // Fallback to a default fee
      return this.networkType === 'mainnet' 
        ? 0.000001 
        : 0.0000005;
    // }
  }

  /**
   * Comprehensive transaction validation
   */
  async validateTransaction(
    senderAddress: string, 
    transactionDetails: TransactionDetails,
    feeConfig: FeeConfig
  ): Promise<ValidationResult> {
    const errors: string[] = [];

    // Validate recipient address
    if (!this.validateAddress(transactionDetails.recipient)) {
      errors.push('Invalid recipient address');
    }

    // Validate amount
    if (!this.validateAmount(transactionDetails.amount)) {
      errors.push('Invalid transfer amount');
    }

    // Estimate network fee
    const networkFee = await this.estimateNetworkFee();
    
    // Calculate total fee (network fee + app fee)
    const totalFee = networkFee + (feeConfig.appFee || 0);

    // // Optional: Add balance check
    try {
      const balanceResponse = await dispatch(stxTransactionHistoryApi.endpoints.getAddressBalance.initiate(senderAddress));
      
      // Safely check if balanceResponse.data exists
      if (balanceResponse.data && 'balance' in balanceResponse.data) {
        const balance = Number(balanceResponse.data.balance);
        
        if (balance < (transactionDetails.amount + totalFee)) {
          errors.push('Insufficient balance for transaction');
        }
      } else {
        errors.push('Unable to verify balance');
      }
    } catch (error) {
      errors.push('Unable to verify balance');
    }

    return {
      isValid: errors.length === 0,
      errors,
      estimatedFee: totalFee
    };
  }

  /**
   * Send STX tokens with advanced fee handling
   */
  async sendSTX(
  //   privateKey: string, 
    transactionDetails: TransactionDetails,
    feeConfig: FeeConfig,
    details:any
  ): Promise<{
    success: boolean;
    transactionId?: string;
    fee?: number;
    error?: string;
  }> {

      const {
          address,
          privateKey
        } = details;
    
  try {
      const senderAddress = address//this.getAddressFromPrivateKey(stacksPrivateKey);

      //  Validate transaction first
      const validationResult = await this.validateTransaction(
        senderAddress, 
        transactionDetails, 
        feeConfig
      );

      // Check validation
      if (!validationResult.isValid) {
        return {
          success: false,
          error: validationResult.errors.join(', ')
        };
      }

      // Prepare transaction
      const transaction = await makeSTXTokenTransfer({
        recipient: transactionDetails.recipient,
        amount: BigInt(Math.round(transactionDetails.amount * 1_000_000)),
        senderKey: privateKey,
        network: 'testnet', //this.network,
        anchorMode: AnchorMode.Any,
      //   postConditions: [
      //     makeStandardSTXPostCondition(
      //       senderAddress, 
      //       PostConditionType.Equal, 
      //       BigInt(Math.round(transactionDetails.amount * 1_000_000))
      //     )
      //   ],
        memo: transactionDetails.memo
      });

      // Broadcast transaction
      const txResponse = await broadcastTransaction(transaction);

      // If app fee is configured and a fee receiver is specified
      // if (feeConfig.appFee && feeConfig.feeReceiver) {
      //   await this.sendAppFee(
      //     privateKey, 
      //     feeConfig.feeReceiver, 
      //     feeConfig.appFee
      //   );
      // }

      return {
        success: true,
        transactionId: txResponse.txid,
        fee: validationResult.estimatedFee
      };
    } catch (error) {
      console.error('Transaction failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Send app fee to a specified address
   */
  private async sendAppFee(
    senderPrivateKey: string, 
    feeReceiver: string, 
    appFee: number
  ) {
    try {
      
      // Similar to main sendSTX method, but for app fee
      const transaction = await makeSTXTokenTransfer({
        recipient: feeReceiver,
        amount: BigInt(Math.round(appFee * 1_000_000)),
        senderKey: senderPrivateKey,
        network: this.network,
        anchorMode: AnchorMode.Any,
        memo: 'App transaction fee'
      });

      await broadcastTransaction(transaction);
    } catch (error) {
      console.warn('App fee transfer failed:', error);
    }
  } 

}

export const stacksTransactionManager = new StacksTransactionManager(networkStore.networkType);
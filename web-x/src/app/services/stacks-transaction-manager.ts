import { 
    makeSTXTokenTransfer,
    broadcastTransaction,
    AnchorMode,
    createStacksPrivateKey,
    pubKeyfromPrivKey,
    TransactionVersion,
    getAddressFromPublicKey
  } from '@stacks/transactions';
  import { StacksMainnet, StacksTestnet, StacksNetwork, StacksDevnet } from '@stacks/network';
  import axios from 'axios';
import { VITE_API_KEY } from '@/api/secrets';
import { StxWalletService } from './stx-wallet-service';
  
  // Network Configuration
  enum StacksNetworkType {
    Mainnet = 'mainnet',
    Testnet = 'testnet',
    Devnet = 'devnet'
  }
  
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
  
    constructor(networkType: StacksNetworkType = StacksNetworkType.Testnet) {
      this.networkType = networkType;
      this.initializeNetwork();
      this.apiBaseUrl = this.getApiBaseUrl();
    }
  
    /**
     * Initialize network based on network type
     */
    private initializeNetwork() {
      switch (this.networkType) {
        case StacksNetworkType.Mainnet:
          this.network = new StacksMainnet();
          break;
        case StacksNetworkType.Testnet:
          this.network = new StacksTestnet();
          break;
        case StacksNetworkType.Devnet:
          this.network = new StacksDevnet({
            url: `https://api.platform.hiro.so/v1/ext/${VITE_API_KEY}/stacks-blockchain-api`,
            // url: 'http://localhost:3999',
          });
          break;
      }
    }
  
    /**
     * Get appropriate API base URL
     */
    private getApiBaseUrl(): string {
      return this.networkType === StacksNetworkType.Mainnet
        ? 'https://api.stacks.co/extended/v1'
        : 'https://api.testnet.stacks.co/extended/v1';
    }
  
    /**
     * Validate STX Address
     */
    validateAddress(address: string): boolean {
      // Basic Stacks address validation
      const addressRegex = /^(ST|SP)[a-zA-H0-9]{38}$/;
      return addressRegex.test(address);
    }
  
    /**
     * Validate transaction amount
     */
    validateAmount(amount: number): boolean {
      return amount > 0 && amount < 1_000_000; // Reasonable upper limit
    }
  
    /**
     * Estimate transaction fee from Stacks network
     */
    async estimateNetworkFee(): Promise<number> {
      try {
        const response = await axios.get(`${this.apiBaseUrl}/fees/transfer`);
        // Use the recommended fee, converting from microstacks to STX
        return response.data.estimated_fee_rate / 1_000_000;
      } catch (error) {
        console.warn('Failed to fetch network fee, using default', error);
        // Fallback to a default fee
        return this.networkType === StacksNetworkType.Mainnet 
          ? 0.000001 
          : 0.0000005;
      }
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
  
      // Optional: Add balance check
      try {
        const balanceResponse = await axios.get(
          `${this.apiBaseUrl}/address/${senderAddress}/stx?unanchored=true&until_block=60000`
        );
        const balance = Number(balanceResponse.data.balance) / 1_000_000;
        
        if (balance < (transactionDetails.amount + totalFee)) {
          errors.push('Insufficient balance for transaction');
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
  
        // Validate transaction first
        // const validationResult = await this.validateTransaction(
        //   senderAddress, 
        //   transactionDetails, 
        //   feeConfig
        // );
  
        // // Check validation
        // if (!validationResult.isValid) {
        //   return {
        //     success: false,
        //     error: validationResult.errors.join(', ')
        //   };
        // }
  
        // Prepare transaction
        const transaction = await makeSTXTokenTransfer({
          recipient: transactionDetails.recipient,
          amount: BigInt(Math.round(transactionDetails.amount * 1_000_000)),
          senderKey: privateKey,
          network: this.network,
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
        if (feeConfig.appFee && feeConfig.feeReceiver) {
          await this.sendAppFee(
            privateKey, 
            feeConfig.feeReceiver, 
            feeConfig.appFee
          );
        }
  
        return {
          success: true,
          transactionId: txResponse.txid,
        //   fee: validationResult.estimatedFee
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

  import axios from 'axios';
  
  interface TransactionHistoryOptions {
    limit?: number;
    offset?: number;
    fromDate?: Date;
    toDate?: Date;
  }
  
  interface TransactionDetails {
    txId: string;
    type: string;
    status: string;
    amount?: number;
    sender?: string;
    recipient?: string;
    timestamp: Date;
    fee: number;
  }
  
  class StacksTransactionHistoryService {
    private baseApiUrl: string;
  
    constructor(network: 'mainnet' | 'testnet' = 'testnet') {
      this.baseApiUrl = network === 'mainnet'
        ? 'https://api.stacks.co/extended/v1'
        : 'https://api.testnet.stacks.co/extended/v1';
    }
  
    /**
     * Fetch transaction history for a specific address
     * @param address Stacks blockchain address
     * @param options Optional filtering and pagination options
     */
    async getTransactionHistory(
      address: string, 
      options: TransactionHistoryOptions = {}
    ): Promise<TransactionDetails[]> {
      try {
        const params = new URLSearchParams({
          limit: (options.limit || 50).toString(),
          offset: (options.offset || 0).toString()
        });
  
        const response = await axios.get(
          `${this.baseApiUrl}/address/${address}/transactions`, 
          { params }
        );
  
        return response.data.results.map((tx: any) => ({
          txId: tx.tx_id,
          type: tx.tx_type,
          status: tx.tx_status,
          amount: tx.token_transfer 
            ? Number(tx.token_transfer.amount) / 1_000_000 
            : undefined,
          sender: tx.sender_address,
          recipient: tx.token_transfer?.recipient,
          timestamp: new Date(tx.block_time * 1000),
          fee: Number(tx.fee_rate) / 1_000_000
        }));
      } catch (error) {
        console.error('Failed to fetch transaction history:', error);
        throw error;
      }
    }
  
    /**
     * Fetch specific transaction details by transaction ID
     * @param txId Transaction ID
     */
    async getTransactionDetails(txId: string): Promise<TransactionDetails | null> {
      try {
        const response = await axios.get(`${this.baseApiUrl}/tx/${txId}`);
        const tx = response.data;
  
        return {
          txId: tx.tx_id,
          type: tx.tx_type,
          status: tx.tx_status,
          amount: tx.token_transfer 
            ? Number(tx.token_transfer.amount) / 1_000_000 
            : undefined,
          sender: tx.sender_address,
          recipient: tx.token_transfer?.recipient,
          timestamp: new Date(tx.block_time * 1000),
          fee: Number(tx.fee_rate) / 1_000_000
        };
      } catch (error) {
        console.error('Failed to fetch transaction details:', error);
        return null;
      }
    }
  
    /**
     * Get balance for a specific address
     * @param address Stacks blockchain address
     */
    async getAddressBalance(address: string) {
      try {
        const response = await axios.get(`${this.baseApiUrl}/address/${address}/stx`);
        return {
          balance: Number(response.data.balance) / 1_000_000,
          totalReceived: Number(response.data.total_received) / 1_000_000,
          totalSent: Number(response.data.total_sent) / 1_000_000
        };
      } catch (error) {
        console.error('Failed to fetch address balance:', error);
        throw error;
      }
    }
  }


  export default StacksTransactionHistoryService

import { apiSlice } from './apiSlice';

interface TransactionHistoryOptions {
  limit?: number;
  offset?: number;
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

interface AddressBalance {
  balance: number;
  totalReceived: number;
  totalSent: number;
}


// Configure RTK Query API

export const stxTransactionHistoryApi = apiSlice.injectEndpoints({

  endpoints: (builder) => ({
    // Fetch transaction history for a specific address
    
    getTransactionHistory: builder.query<TransactionDetails[], { address: string; options?: TransactionHistoryOptions }>({
      query: ({ address, options }) => ({
        url: `/address/${address}/transactions`,
        // params: {  
        //   limit: options?.limit || 50,
        //   offset: options?.offset || 0,
        // },
      }),
      transformResponse: (response: any) =>
        response.results.map((tx: any) => ({
          txId: tx.tx_id,
          type: tx.tx_type,
          status: tx.tx_status,
          amount: tx.token_transfer ? Number(tx.token_transfer.amount) / 1_000_000 : undefined,
          sender: tx.sender_address,
          recipient: tx.token_transfer?.recipient,
          timestamp: new Date(tx.block_time * 1000),
          fee: Number(tx.fee_rate) / 1_000_000,
        })),
    }),

    // Fetch specific transaction details by transaction ID
    getTransactionDetails: builder.query<TransactionDetails | null, string>({
      query: (txId) => `/tx/${txId}`,
      transformResponse: (tx: any) => ({
        txId: tx.tx_id,
        type: tx.tx_type,
        status: tx.tx_status,
        amount: tx.token_transfer ? Number(tx.token_transfer.amount) / 1_000_000 : undefined,
        sender: tx.sender_address,
        recipient: tx.token_transfer?.recipient,
        timestamp: new Date(tx.block_time * 1000),
        fee: Number(tx.fee_rate) / 1_000_000,
      }),
    }),

    // Fetch balance for a specific address
    getAddressBalance: builder.query<AddressBalance, string>({
      // query: (address) => `/address/${address}/stx`,
      query: (address) => ({
        url: `/address/${address}/stx`
      }),
      transformResponse: (response: any) => ({
        balance: Number(response.balance) / 1_000_000,
        totalReceived: Number(response.total_received) / 1_000_000,
        totalSent: Number(response.total_sent) / 1_000_000,
      }),
    }),
  }),
});

// Export hooks for use in components
export const {
  useGetTransactionHistoryQuery,
  useGetTransactionDetailsQuery,
  useGetAddressBalanceQuery,
  useLazyGetAddressBalanceQuery,
  
} = stxTransactionHistoryApi;

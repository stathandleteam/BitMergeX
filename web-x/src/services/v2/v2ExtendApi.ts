import { v2apiSlice } from "./v2apiSlice";

export const v2ExtendApi =  v2apiSlice.injectEndpoints({
    endpoints: (builder) => ({
      // Query for transfer fee information
      getTransferFee: builder.query<{ estimated_fee_rate: number }, void>({
        query: () => ({
          url: `/fees/transfer`,
        }),
      }),
    }),
  });
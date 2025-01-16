// priceApi.ts
// import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const YOUR_CMC_API_KEY_HERE = "3e66a0b9-6e38-40d0-8959-65646100ea0d"
// Custom base query function for the price API
// priceApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Custom base query function for CoinMarketCap API
const cmcBaseQuery = fetchBaseQuery({
  baseUrl: 'https://pro-api.coinmarketcap.com/v1',
  prepareHeaders: (headers, { getState }) => {
    // Retrieve the API key from wherever you store it (e.g., environment variables or state)
    const apiKey = YOUR_CMC_API_KEY_HERE; // Replace this with your actual API key
    headers.set('X-CMC_PRO_API_KEY', apiKey);
    return headers;
  }
});

interface CMCPriceData {
  data: {
    [symbol: string]: {
      quote: {
        USD: {
          price: number;
        };
      };
    };
  };
}
const cacheTimeInMinute = 60*30;  // Keeps data in cache for 30 minutes

export const priceApi = createApi({
  reducerPath: 'priceApi',
  baseQuery: cmcBaseQuery,
  endpoints: (builder) => ({
    getStxPrice: builder.query<number, void>({
      query: () => ({
        url: 'cryptocurrency/quotes/latest',
        params: {
          symbol: 'STX',
          convert: 'USD'
        }
      }),
      
      // Transform the response to just return the price
      transformResponse: (response: CMCPriceData) => {
        if (response.data && response.data.STX && response.data.STX.quote && response.data.STX.quote.USD) {
          return response.data.STX.quote.USD.price;
        }
        throw new Error('Failed to fetch STX price from CoinMarketCap');
      },
      keepUnusedDataFor: cacheTimeInMinute,  // 60, // Cache data for 1 minute when no longer in use
    }),
  }),
});

// Generated hook
export const { useGetStxPriceQuery } = priceApi;
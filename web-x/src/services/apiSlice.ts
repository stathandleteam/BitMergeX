// src/services/exampleApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { dynamicBaseQuery } from './customBaseQuery';


export const apiSlice = createApi({
  reducerPath: 'stacksApi',
  baseQuery: dynamicBaseQuery,
  endpoints: (builder) => ({
    // Define your endpoints here
  }),
  // refetchOnFocus: true,
  // refetchOnReconnect: true,
  tagTypes: ['TransactionHistory']
});

// Export hooks for usage in functional components
export const { } = apiSlice;
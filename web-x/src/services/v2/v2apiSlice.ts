// src/services/exampleApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { v2DynamicBaseQuery } from '../customBaseQuery';


export const v2apiSlice = createApi({
  reducerPath: 'v2stacksApi',
  baseQuery: v2DynamicBaseQuery,

  // reducerPath: 'apiSlice',
  // baseQuery: fetchBaseQuery({ baseUrl: 'https://api.example.com/' }),
  endpoints: (builder) => ({
    // Define your endpoints here
  }),
});

// Export hooks for usage in functional components
export const { } = v2apiSlice;
// src/services/exampleApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { dynamicBaseQuery } from './customBaseQuery';


export const apiSlice = createApi({
  reducerPath: 'stacksApi',
  baseQuery: dynamicBaseQuery,

  // reducerPath: 'apiSlice',
  // baseQuery: fetchBaseQuery({ baseUrl: 'https://api.example.com/' }),
  endpoints: (builder) => ({
    // Define your endpoints here
  }),
});

// Export hooks for usage in functional components
export const { } = apiSlice;
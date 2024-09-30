// src/services/exampleApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const exampleApi = createApi({
  reducerPath: 'exampleApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://api.example.com/' }),
  endpoints: (builder) => ({
    // Define your endpoints here
  }),
});

// Export hooks for usage in functional components
export const { } = exampleApi;
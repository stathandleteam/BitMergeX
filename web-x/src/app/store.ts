// src/app/store.ts
import { apiSlice } from '@/services/apiSlice';
import { priceApi } from '@/services/priceApi';
import { v2apiSlice } from '@/services/v2/v2apiSlice';
import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
// import { apiSlice } from '../services/apiSlice';
// import { priceApi } from './priceApi';


export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    [priceApi.reducerPath]: priceApi.reducer,
    [v2apiSlice.reducerPath]: v2apiSlice.reducer

    // [stxTransactionHistoryApi.reducerPath]: stxTransactionHistoryApi.reducer
    // Add other reducers here
  },
  // middleware: (getDefaultMiddleware) =>
  //   getDefaultMiddleware().concat(apiSlice.middleware),

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      priceApi.middleware,
      apiSlice.middleware,
      v2apiSlice.middleware
    ),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
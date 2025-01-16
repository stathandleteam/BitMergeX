// src/services/customBaseQuery.ts
import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { networkStore } from './networkStore';
// import { networkStore } from '@/stores/networkStore';

export const customBaseQuery = fetchBaseQuery({
  baseUrl: '', // Will be overridden dynamically
});

export const dynamicBaseQuery = async (args:any, api:any, extraOptions:any) => {
  // Dynamically set the baseUrl from networkStore
  const baseUrl = networkStore.baseUrl;
  const query = { ...args, url: `${baseUrl}${args.url}` };

  // Call the original fetchBaseQuery with the modified query
  return customBaseQuery(query, api, extraOptions);
};


export const v2DynamicBaseQuery = async (args:any, api:any, extraOptions:any) => {
  // Dynamically set the baseUrl from networkStore
  const baseUrl = networkStore.baseUrl;
  const query = { ...args, url: `${baseUrl}${args.url}` };

  // Call the original fetchBaseQuery with the modified query
  return customBaseQuery(query, api, extraOptions);
};

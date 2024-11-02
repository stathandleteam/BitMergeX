import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ROUTES } from './constants';
import { RouterContextType, RouteParams } from './types';
import { StxWalletService } from '@/app/services/stx-wallet-service';

const RouterContext = createContext<RouterContextType | undefined>(undefined);

interface RouterProviderProps {
  children: ReactNode;
}

export function RouterProvider({ children }: RouterProviderProps) {


  

  const [currentRoute, setCurrentRoute] = useState<string>(ROUTES.HOME);
  const [params, setParams] = useState<RouteParams | undefined>();

  useEffect(() => {

    (async ()=>{
      const check = await StxWalletService.checkSeedExist()
      setCurrentRoute(check === true?ROUTES.LOGIN:ROUTES.HOME)
    })()

  }, [])

  useEffect(() => {
    // Load last route from storage when component mounts
    chrome?.storage?.local?.get(['lastRoute', 'routeParams'], (result) => {
      if (result.lastRoute) {
        console.log("result", result)
        setCurrentRoute(result.lastRoute);
        if (result.routeParams) {
          setParams(result.routeParams);
        }
      }
    });
  }, []);
  

  const navigate = (route: string, newParams?: RouteParams) => {
    setCurrentRoute(route);
    newParams? setParams(newParams): null;
    
    // Save route state to chrome storage
    chrome?.storage?.local?.set({ 
      lastRoute: route,
      routeParams: newParams ?? params
    });
  };

  return (
    <RouterContext.Provider value={{ currentRoute, params, navigate }}>
      {children}
    </RouterContext.Provider>
  );
}

export const useRouter = (): RouterContextType => {
  const context = useContext(RouterContext);
  if (context === undefined) {
    throw new Error('useRouter must be used within a RouterProvider');
  }
  return context;
};

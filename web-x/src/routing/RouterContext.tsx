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
  const [previousRoute, setPreviousRoute] = useState<string | null>(null)

  useEffect(() => {

    (async () => {
      const check = await StxWalletService.checkSeedExist()
      setCurrentRoute(check === true ? ROUTES.LOGIN : ROUTES.HOME)
      setPreviousRoute(null)
    })()

  }, [])

  useEffect(() => {
    // Load last route from storage when component mounts
    chrome?.storage?.local?.get(['beforeLastRoute', 'lastRoute', 'routeParams'], (result) => {
      if (result.lastRoute) {
        setCurrentRoute(result.lastRoute);
        setPreviousRoute(result.beforeLastRoute)
        if (result.routeParams) {
          setParams(result.routeParams);
        }
      }
    });
  }, []);


  const navigate = (route: string, newParams?: RouteParams) => {
    const previousRoute = currentRoute;
    setPreviousRoute(previousRoute);
    setCurrentRoute(route);
    typeof newParams === 'object' ? setParams({ ...params, ...newParams }) : setParams(params);

    // Save route state to chrome storage
    chrome?.storage?.local?.set({
      beforeLastRoute: previousRoute,
      lastRoute: route,
      routeParams: typeof newParams === 'object' ? { ...params, ...newParams } : params
    });
  };

  return (
    <RouterContext.Provider value={{ previousRoute, currentRoute, params, navigate }}>
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

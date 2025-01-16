// import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
// import { ROUTES } from './constants';
// import { RouterContextType, RouteParams } from './types';
// import { StxWalletService } from '@/app/services/stx-wallet-service';

// const RouterContext = createContext<RouterContextType | undefined>(undefined);

// interface RouterProviderProps {
//   children: ReactNode;
// }

// export function RouterProvider({ children }: RouterProviderProps) {

//   const [currentRoute, setCurrentRoute] = useState<string>(ROUTES.HOME);
//   const [params, setParams] = useState<RouteParams | undefined>();
//   const [previousRoute, setPreviousRoute] = useState<string | null>(null)
  
//   useEffect(() => {

//     (async () => {
//       const check = await StxWalletService.checkSeedExist()
//       setCurrentRoute(check === true ? ROUTES.LOGIN : ROUTES.HOME)
//       setPreviousRoute(null)
//     })()

//   }, [])

//   useEffect(() => {
//     // Load last route from storage when component mounts
//     chrome?.storage?.local?.get(['beforeLastRoute', 'lastRoute', 'routeParams'], (result) => {
//       console.log("asdfasd")
//       if (result.lastRoute) {
//         setCurrentRoute(result.lastRoute);
//         setPreviousRoute(result.beforeLastRoute)
//         if (result.routeParams) {
//           setParams(result.routeParams);
//         }
//       }
//     });
//   }, []);


//   const navigate = (route: string, newParams?: RouteParams) => {
//     const previousRoute = currentRoute;
//     setPreviousRoute(previousRoute);
//     setCurrentRoute(route);
//     typeof newParams === 'object' ? setParams({ ...params, ...newParams }) : setParams(params);

//     // Save route state to chrome storage
//     chrome?.storage?.local?.set({
//       beforeLastRoute: previousRoute,
//       lastRoute: route,
//       routeParams: typeof newParams === 'object' ? { ...params, ...newParams } : params
//     });
//   };

//   return (
//     <RouterContext.Provider value={{ previousRoute, currentRoute, params, navigate }}>
//       {children}
//     </RouterContext.Provider>
//   );
// }

// export const useRouter = (): RouterContextType => {
//   const context = useContext(RouterContext);
//   if (context === undefined) {
//     throw new Error('useRouter must be used within a RouterProvider');
//   }
//   return context;
// };

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ROUTES } from './constants';
import { RouterContextType, RouteParams } from './types';
import { StxWalletService } from '@/app/services/stx-wallet-service';
import NetworkManager from '@/services/NetworkManager';
import { setNetworkType } from '@/services/networkStore';

const RouterContext = createContext<RouterContextType | undefined>(undefined);

interface RouterProviderProps {
  children: ReactNode;
}

export function RouterProvider({ children }: RouterProviderProps) {
  const [currentRoute, setCurrentRoute] = useState<string>(ROUTES.HOME);
  const [params, setParams] = useState<RouteParams | undefined>();
  const [previousRoute, setPreviousRoute] = useState<string | null>(null);

  useEffect(() => {

    (async () => {
      const check = await StxWalletService.checkSeedExist()
      setCurrentRoute(check === true ? ROUTES.LOGIN : ROUTES.HOME)
      setPreviousRoute(null)
    })()

  }, [])

  useEffect(() => {
    // Load last route from storage when component mounts
    (async () => {
      const networkType = await NetworkManager.retrieveNetworkType()
      networkType && setNetworkType(networkType);      
    })
  }, [])
  

  

  // useEffect(() => {
  //   // Check seed existence via background script
  //   chrome.runtime.sendMessage({ action: 'checkSeedExist' }, (response) => {
  //     if (response?.exists) {
  //       setCurrentRoute(ROUTES.LOGIN);
  //       setPreviousRoute(null);
  //     } else {
  //       setCurrentRoute(ROUTES.HOME);
  //     }
  //   });
  // }, []);

  useEffect(() => {
    // Load last route from storage via background script
    chrome.runtime.sendMessage({ action: 'getLastRoute' }, (response) => {
      if (response?.success) {
        setCurrentRoute(response.lastRoute || ROUTES.HOME);
        setPreviousRoute(response.beforeLastRoute || null);
        if (response.routeParams) {
          setParams(response.routeParams);
        }
      }
    });
  }, []);

  const navigate = (route: string, newParams?: RouteParams) => {
    const previousRoute = currentRoute;
    setPreviousRoute(previousRoute);
    setCurrentRoute(route);
    const updatedParams = typeof newParams === 'object' ? { ...params, ...newParams } : params;
    setParams(updatedParams);

    // Save route state to background script
    chrome.runtime.sendMessage(
      {
        action: 'saveRoute',
        data: { route, params: updatedParams, previousRoute },
      },
      (response) => {
        if (!response?.success) {
          console.error('Failed to save route:', response.error);
        }
      }
    );
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

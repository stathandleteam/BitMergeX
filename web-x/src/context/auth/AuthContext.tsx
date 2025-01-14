

// AuthContext.ts
import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthContextType } from './types';
import { processLogin } from './processlogin/ProcessLogin';
import { useRouter } from '../routing/RouterContext';
import { ROUTES } from '../routing/constants';

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { navigate } = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    chrome?.storage?.local.get(['session'], function(items) {
      if (items.session && items.session.isActive) {
        const now = new Date().getTime();
        if (now - items.session.timestamp < 30 * 60 * 1000) { // 30 minutes session duration
          setIsLoggedIn(true);
          navigate(ROUTES.DASHBOARD)
        } else {
          logout();
        }
      }
    });
  }, []);

  // const login = async (password: string) => {
  //   return new Promise<boolean>((resolve) => {
  //     chrome.runtime.sendMessage({ action: 'login', password }, function(response) {
  //       if (response.success) {
  //         setIsLoggedIn(true);
  //         resolve(true);
  //       } else {
  //         resolve(false);
  //       }
  //     });
  //   });
  // };

  const login = async (password: string) => {
    // Ensure you're in a Chrome extension context
    if (!chrome?.runtime?.sendMessage) {
      try {

        // console.error('Not in a Chrome extension context');
        console.log('Not in a Chrome extension context')

       const result =  await processLogin({password})
        console.log("Login result:", result);
        return result;

      } catch (error:any) {
       return error.message 
      }
      
    }
    
    // return "It is a chrome extension";
    try {
      return new Promise<{ success: boolean }>((resolve) => {
        chrome?.runtime?.sendMessage(
          { action: 'login', password }, 
          (response: { success: boolean }) => {
            console.log("response", response)
            if (response?.success) {
              setIsLoggedIn(true);
              return resolve(response);
            } else {
             return resolve(response);
            }
          }
        );
      });
    } catch (error:any) {
      console.error('Login error:', error);
      return error.message;
    }
  };
  
  const logout = () => {
    chrome?.storage?.local?.remove(['session', 'walletInstance'], function() {
      setIsLoggedIn(false);
      navigate(ROUTES.LOGIN)
    });
  };

  // Periodic check for session validity
  useEffect(() => {
    const timer = setInterval(() => {
      chrome?.storage?.local?.get(['session'], function(items) {
        if (items.session && items.session.isActive) {
          const now = new Date().getTime();
          if (now - items.session.timestamp > 30 * 60 * 1000) { // 30 minutes
            logout();
          }
        }
      });

    }, 60000); // Every minute

    return () => clearInterval(timer); // Cleanup on component unmount
  }, []);
  
  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout  }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};



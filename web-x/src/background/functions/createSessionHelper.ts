import { StxAccountManager } from "@/app/dbmangers/StxAccountManager";
import { stxWalletDbService } from "@/app/services/stx-wallet-service";


export const createSessionHelper = async (request: any, sender:any, sendResponse: any)=>{
          try {
            switch (request.action) {
                case 'login': // Create or Update
                const unlockWallet = await stxWalletDbService.unlockWallet(request.password);
                  const stxAccountIndex = await StxAccountManager.retrieveStxAccountIndex()
                console.log("stxAccountIndex", stxAccountIndex)
                if (unlockWallet) {
                  const session = {
                    isActive: true,
                    timestamp: new Date().getTime(),
                  };
      
                  if (typeof chrome !== "undefined" && chrome?.storage?.local) {
                    await new Promise<void>((resolve, reject) => {
                      chrome?.storage?.local.set(
                        {
                          session,
                          walletInstance: unlockWallet,
                          stxAccountIndex
                        },
                        () => {
                          if (chrome.runtime.lastError) {
                            reject(chrome.runtime.lastError);
                          } else {
                            resolve();
                          }
                        }
                      );
                    });
      
                    sendResponse({ success: true, walletInstance: unlockWallet });
                  } else {
                    sendResponse({ success: false, error: "Not in a Chrome extension context" });
                  }
                } else {
                  sendResponse({ success: false, error: "Invalid password" });
                }
                break;
            
              case 'logout': // Handle user logout
                chrome.storage.local.remove(['session', 'walletInstance'], () => {
                  if (chrome.runtime.lastError) {
                    sendResponse({ success: false, error: chrome.runtime.lastError.message });
                  } else {
                    sendResponse({ success: true });
                  }
                });
                break;
      
              case 'checkSession': // Validate session
                chrome.storage.local.get(['session'], (items) => {
                  if (chrome.runtime.lastError) {
                    sendResponse({ success: false, error: chrome.runtime.lastError.message });
                  } else if (
                    items.session &&
                    items.session.isActive &&
                    new Date().getTime() - items.session.timestamp < 30 * 60 * 1000 // 30 minutes
                  ) {
                    sendResponse({ success: true });
                  } else {
                    sendResponse({ success: false, error: 'Session expired' });
                  }
                });
                break;
      
              default:
                sendResponse({ success: false, error: 'Invalid action' });
            }
          } catch (error: any) {
            console.log({ success: false, error: error.message })
            sendResponse({ success: false, error: error.message });
          }
        
}
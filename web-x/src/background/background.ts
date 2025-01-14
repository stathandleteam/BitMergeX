import { stxWalletDbService } from "@/app/services/stx-wallet-service";
import { state } from "@/context/state/extensionState";
import { createSessionHelper } from "./functions/createSessionHelper";
import { routerHelper } from "./functions/routerHelper";
import { fetchHelper } from "./functions/fetchData";
import { stxTransactionHandler } from "./functions/stxTransactionHandler";
// import browser from "webextension-polyfill";

// const { stxWalletDbService } = require('../src/app/services/stx-wallet-service');


const registerEventListeners = () => {


chrome.runtime.onMessage.addListener((msg) => {
  console.log('message received from content script: ', msg);
  return true;
})

  chrome.runtime.onInstalled.addListener(() => {
    // chrome.storage.local.set(state);
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

    console.log('Stacks Wallet Extension installed');

    switch (request.action) {
      case 'checkSeedExist': // Check if a seed exists
      case 'getLastRoute': // Retrieve last route and params
      case 'saveRoute': // Save the current route

        routerHelper(request, sender, sendResponse)
        break;

      case 'login': // Create or Update
      case 'logout': // Handle user logout
      case 'checkSession': // Validate session

        createSessionHelper(request, sender, sendResponse)
        break;

      case 'account-details':
      case 'account-balance':
      case 'transaction-history':
      case 'all-accounts-with-balances':
      case 'add-new-account-to-wallet':
        fetchHelper(request, sender, sendResponse)
        break;

      case 'validate-address':
      case 'validate-amount':
      case 'send-stx':
      case 'get-stx-price':
        stxTransactionHandler(request, sender, sendResponse)
        break;
      default:
        console.log({ success: false, error: 'Invalid action' })

        sendResponse({ success: false, error: 'Invalid action' });

    }
    return true; // To allow async responses
  });

    
  
  });
  
  // chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

  //   if (request.action === 'login') {

  //       // Make the listener callback async
  //       (async () => {
  //           try {
  //               // Await the unlockWallet promise
  //               const unlockWallet = await stxWalletDbService.unlockWallet(request.password);
                
  //               if (unlockWallet) {
  //                   const session = {
  //                       isActive: true,
  //                       timestamp: new Date().getTime()
  //                   };
                    
  //                 // Check if running in a Chrome extension context
  //                 if (typeof chrome !== "undefined" && chrome?.storage?.local) {

  //                   // Use a Promise-based approach for chrome?.storage?.local.set
  //                   await new Promise<void>((resolve, reject) => {
  //                       chrome?.storage?.local.set({ 
  //                           'session': session, 
  //                           'walletInstance': unlockWallet 
  //                       }, () => {
  //                           if (chrome.runtime.lastError) {
  //                               reject(chrome.runtime.lastError);
  //                           } else {
  //                               resolve();
  //                           }
  //                       });
  //                   });

  //                   // Send successful response
  //                   sendResponse({ success: true, walletInstance: unlockWallet });

  //                 } else {

  //                   console.error("Not in a Chrome extension context");
  //                   sendResponse({ success: false, error: "Not in a Chrome extension context" });

  //                 }
    
  //               } else {
  //                   sendResponse({ success: false, error: 'Invalid password' });
  //               }
  //           } catch (error:any) {
  //               console.error('Login error:', error);
  //               sendResponse({ success: false, error: error.message });
  //           }
  //     })();

  //     // Important: Always return true for async listeners
  //     return true; // Will respond asynchronously
  //   }
  // });

}

(() => {
  registerEventListeners();
})();


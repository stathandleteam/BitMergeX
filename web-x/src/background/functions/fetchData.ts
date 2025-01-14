import { stxTransactionHistoryApi } from "@/services/stxTransactionHistoryApi";
import { stxWalletDbService, StxWalletService } from "@/app/services/stx-wallet-service";
import { store } from "@/app/store";
import { priceApi } from "@/services/priceApi";
import { StxAccountManager } from "@/app/dbmangers/StxAccountManager";

const { dispatch } = store;

export const fetchHelper = async (request: any, sender:any, sendResponse: any) => {
    try {
        switch(request.action){
            case 'set-stx-account-index':
              chrome.storage.local.get(['session', 'walletInstance'], async (items)=> {
                if (chrome.runtime.lastError) {
                  sendResponse({ success: false, error: chrome.runtime.lastError.message });
                } else if (
                  // items.session &&
                  // items.session.isActive &&
                  items.walletInstance 
                ) {

                  const indexChanged = await StxAccountManager.storeStxAccountIndex(request.accountIndex);
                  // sendResponse({ success: true, data: newAccount });
                  const retrieveStxAccountIndex = await StxAccountManager.retrieveStxAccountIndex();

                  console.log("retrieveStxAccountIndex", retrieveStxAccountIndex)

                  if (indexChanged) {
                    sendResponse({ success: true, data: retrieveStxAccountIndex });
                  } else {
                    sendResponse({ success: false, error: "Invalid password" });
                  }
                  
                }
              })
              break;
            case 'add-new-account-to-wallet':
              chrome.storage.local.get(['session', 'walletInstance'], async (items)=> {
                if (chrome.runtime.lastError) {
                  sendResponse({ success: false, error: chrome.runtime.lastError.message });
                } else if (
                  // items.session &&
                  // items.session.isActive &&
                  items.walletInstance 
                ) {
                  const updatedWallet = await StxWalletService.addAccountsToWallet(items.walletInstance);
                  // sendResponse({ success: true, data: newAccount });
                  if (updatedWallet) {
                    const session = {
                      isActive: true,
                      timestamp: new Date().getTime(),
                    };
                    if (typeof chrome !== "undefined" && chrome?.storage?.local) {
                      await new Promise<void>((resolve, reject) => {
                        chrome?.storage?.local.set(
                          {
                            // session,
                            walletInstance: updatedWallet,
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
        
                      sendResponse({ success: true, walletInstance: updatedWallet });
                    } else {
                      sendResponse({ success: false, error: "Not in a Chrome extension context" });
                    }
                  } else {
                    sendResponse({ success: false, error: "Invalid password" });
                  }
                }
              })
              break;
            case 'all-accounts-with-balances':
              chrome.storage.local.get(['session', 'walletInstance'], async (items) => {
                if (chrome.runtime.lastError) {
                  sendResponse({ success: false, error: chrome.runtime.lastError.message });
                } else if (
                  // items.session &&
                  // items.session.isActive &&
                  items.walletInstance 
                ) {
                  console.log("items.walletInstance", items.walletInstance);

                  const noOfAccounts = items.walletInstance.accounts.length;
                  const accountList:any = [];
                  for (let i = 0; i < noOfAccounts; i++) {
                    const details = (await stxWalletDbService.getAccountDetails(items.walletInstance.accounts[i], 128));
                    const balance = await dispatch(stxTransactionHistoryApi.endpoints.getAddressBalance.initiate(details.address));
                    const priceData = await dispatch(priceApi.endpoints.getStxPrice.initiate());
                    // details.balance = balance.data;
                    // details.price = priceData.data;
                    accountList.push({
                      ...details,
                      addressBalance: balance.data?.balance,
                      stxPriceInDollar: priceData.data,
                      index: i
                    });
                    // items.walletInstance.accounts[i] = details;
                  }
                  sendResponse({ success: true, data: accountList });
                } else {
                  sendResponse({ success: false, error: 'Session expired' });
                }
              })
              break;
            case 'account-details':
                chrome.storage.local.get(['session', 'walletInstance', 'stxAccountIndex'], async (items) => {
                  if (chrome.runtime.lastError) {
                    sendResponse({ success: false, error: chrome.runtime.lastError.message });
                  } else if (
                    // items.session &&
                    // items.session.isActive &&
                    items.walletInstance 
                  ) {
                    const index = 0;
                    const details = (await stxWalletDbService.getAccountDetails(items.walletInstance.accounts[index], 128));
                    sendResponse({ success: true, data: details });
                  } else {
                    sendResponse({ success: false, error: 'Session expired' });
                  }
                });
                break;
            case 'account-balance':
                chrome.storage.local.get(['session', 'walletInstance', 'stxAccountIndex'], async (items) => {
                  if (chrome.runtime.lastError) {
                    sendResponse({ success: false, error: chrome.runtime.lastError.message });
                  } else if (
                    // items.session &&
                    // items.session.isActive &&
                    items.walletInstance 
                  ) {
                    const index = 0;

                    const details = (await stxWalletDbService.getAccountDetails(items.walletInstance.accounts[index], 128));
                    const balance = await dispatch(stxTransactionHistoryApi.endpoints.getAddressBalance.initiate(details.address));
                    const priceData = await dispatch(priceApi.endpoints.getStxPrice.initiate());


                    if (balance.data?.balance && priceData?.data){

                      // const usdBalance = await convertSTXToUSD(balance.data?.balance);
                      const usdBalance = balance.data?.balance * priceData?.data;

                      sendResponse({ success: true, data:  { stxBalance: balance.data?.balance, usdBalance} });
  
                    } else {

                      sendResponse({ success: false, error: 'Unable to fetch balance' });

                    }


                  } else {
                    sendResponse({ success: false, error: 'Session expired' });
                }
                });
                break;
                
            case 'transaction-history':
                chrome.storage.local.get(['walletInstance', 'stxAccountIndex'], async (items) => {
                  if (chrome.runtime.lastError) {
                    sendResponse({ success: false, error: chrome.runtime.lastError.message });
                  } else if (
                    items.walletInstance  
                  ) {
                    const index = 0;
                    const details = (await stxWalletDbService.getAccountDetails(items.walletInstance.accounts[index], 128));

                    const options  = {
                        limit: 10,
                        offset: 0
                      }
                   const transactionHistory = await dispatch(stxTransactionHistoryApi.endpoints.getTransactionHistory
                    .initiate({ address: details.address, options}));
                    
                    sendResponse({ success: true, data: transactionHistory.data });

                } else {
                    sendResponse({ success: false, error: 'Session expired' });
                  }
                });
                break;
        }
    } catch (error:any) {
        console.log({ success: false, error: error.message })
        sendResponse({ success: false, error: error.message });
    }
}
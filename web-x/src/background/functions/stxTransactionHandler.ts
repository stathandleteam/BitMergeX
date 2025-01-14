import { stxTransactionHistoryApi } from "@/services/stxTransactionHistoryApi";
import { stxWalletDbService } from "@/app/services/stx-wallet-service";
import { store } from "@/app/store";
import { priceApi } from "@/services/priceApi";
import { stacksTransactionManager } from "@/app/services/stacks-transaction-manager";

const { dispatch } = store;

export const stxTransactionHandler = async (request: any, sender: any, sendResponse: any) => {
  try {
    switch (request.action) {
      case 'validate-amount':
        const amountValidation = stacksTransactionManager.validateAmount(request.amount);
        console.log("amountValidation", amountValidation);
        sendResponse({ success: amountValidation.isValid, errors: amountValidation.errors });
        break;

      case 'validate-address':
        const addressValidation = stacksTransactionManager.validateAddress(request.address);
        console.log("addressValidation", addressValidation);
        sendResponse({ success: addressValidation.isValid, errors: addressValidation.errors });
        break;
    
      case 'get-stx-price':
        chrome.storage.local.get(['session', 'walletInstance'], async (items) => {
          if (chrome.runtime.lastError) {
            sendResponse({ success: false, error: chrome.runtime.lastError.message });
          } else if (items.walletInstance) {
            // const stxPrice = await priceApi.getStxPrice();
            const priceData = await dispatch(priceApi.endpoints.getStxPrice.initiate());
            if (priceData?.data){
                sendResponse({ success: true, data: priceData?.data });
            } else {
              sendResponse({ success: false, error: 'Unable to fetch stx price' });
            }
          } else {
            sendResponse({ success: false, error: 'Session expired' });
          }}
        )
        break;
      case 'send-stx':
        chrome.storage.local.get(['session', 'walletInstance'], async (items) => {
          if (chrome.runtime.lastError) {
            sendResponse({ success: false, error: chrome.runtime.lastError.message });
          } else if (items.walletInstance) {
            const index = 0;
            const details = await stxWalletDbService.getAccountDetails(items.walletInstance.accounts[index], 128);
            const feeConfig = request.feeConfig || { baseNetworkFee: 0.000001, appFee: 0 }; // Default fee config if not provided

            const sendSTXResult = await stacksTransactionManager.sendSTX({
              recipient: request.recipient,
              amount: request.amount,
              memo: request.memo || ''
            }, feeConfig, details);
            
            console.log("sendSTXResult", sendSTXResult);

            if (sendSTXResult.success) {
              sendResponse({ 
                success: true, 
                data: {
                  transactionId: sendSTXResult.transactionId,
                  fee: sendSTXResult.fee
                }
              });
             
            } else {
              sendResponse({ success: false, error: sendSTXResult.error });
            }

          } else {
            sendResponse({ success: false, error: 'Session expired or wallet not found' });
          }
        });
        break;

      // Existing cases like 'account-details', 'account-balance', 'transaction-history' would go here

      default:
        sendResponse({ success: false, error: 'Unknown action' });
        break;
    }
  } catch (error: any) {
    console.error({ success: false, error: error.message });
    sendResponse({ success: false, error: error.message });
  }
};
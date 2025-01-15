import { StxWalletService } from "@/app/services/stx-wallet-service";

export const routerHelper = async (request:any, sender:any, sendResponse:any)=>{
          try {
            switch (request.action) {
              case 'checkSeedExist': // Check if a seed exists
                const exists = await StxWalletService.checkSeedExist();
                sendResponse({ exists });
                break;
      
              case 'getLastRoute': // Retrieve last route and params
                chrome.storage.local.get(['beforeLastRoute', 'lastRoute', 'routeParams'], (result) => {
                  if (chrome.runtime.lastError) {
                    sendResponse({ success: false, error: chrome.runtime.lastError.message });
                  } else {

                    console.log("request.payload", request.payload, result.routeParams)

                    sendResponse({
                      success: true,
                      lastRoute: result.lastRoute || null,
                      beforeLastRoute: result.beforeLastRoute || null,
                      routeParams: result.routeParams || null,
                    });
                  }
                });
                break;
      
              case 'saveRoute': // Save the current route
                const { route, params, previousRoute } = request.data;
                chrome.storage.local.set(
                  {
                    beforeLastRoute: previousRoute,
                    lastRoute: route,
                    routeParams: params,
                  },
                  () => {
                    if (chrome.runtime.lastError) {
                      sendResponse({ success: false, error: chrome.runtime.lastError.message });
                    } else {
                      sendResponse({ success: true });
                    }
                  }
                );
                break;
      
              default:
                sendResponse({ success: false, error: 'Invalid action' });
            }
          } catch (error: any) {
            sendResponse({ success: false, error: error.message });
          }
      
      
}
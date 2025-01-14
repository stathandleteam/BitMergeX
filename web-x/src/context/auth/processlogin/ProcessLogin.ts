import { stxWalletDbService } from "@/app/services/stx-wallet-service";

export const  processLogin =   async ({password}: {password:string}) => {
    try {
        // Await the unlockWallet promise
        const unlockWallet = await stxWalletDbService.unlockWallet(password);

        console.log({ success: true, walletInstance: unlockWallet })

        if (unlockWallet) {
            const session = {
                isActive: true,
                timestamp: new Date().getTime()
            };

            // Check if running in a Chrome extension context
            // if (typeof chrome !== "undefined" && chrome?.storage?.local) {

            //     // Use a Promise-based approach for chrome?.storage?.local.set
            //     await new Promise<void>((resolve, reject) => {
            //         chrome?.storage?.local.set({ 
            //             'session': session, 
            //             'walletInstance': unlockWallet 
            //         }, () => {

            //             // if (chrome.runtime.lastError) {
            //             //     reject(chrome.runtime.lastError);
            //             // } else {
            //                 resolve();
            //             // }
            //         });
            //     });
            // } else {
            //     console.error("Not in a Chrome extension context");
            //     return { success: false, error: "Not in a Chrome extension context" };
            // }
            
            return { success: true, walletInstance: unlockWallet, session: session };

        } else {

            return { success: false, error: 'Invalid password' };
        }

    } catch (error:any) {
        return {success: false, error: error.message};
    }
}

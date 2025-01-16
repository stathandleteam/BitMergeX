import { TransactionVersion } from "@stacks/transactions";
import { Wallet } from "@stacks/wallet-sdk";
import { encryptSeed } from "../helpers/encryption";
import StxWalletDbService from "../services/stxWalletDbService";
import { StxWalletService } from "../services/stxWalletService";

// Complete Example

const restoreUserWallet = async ({password, seedPhrase}:{password: string, seedPhrase: string}) => {

    const baseWalletService = new StxWalletService();

    try {

      // Step 2: Create a wallet for the user (Wallet Service)

       const wallet: Wallet = await baseWalletService.restoreWalletWithSeed(seedPhrase, password);
      
       const encryptedSeed = await encryptSeed(seedPhrase, password);
       const walletAddress = (await baseWalletService.getAccountDetails(wallet.accounts[0], TransactionVersion.Testnet)).address;
       const { userId } =  await StxWalletDbService.updateWalletForUser(walletAddress, undefined, encryptedSeed);
  
      return userId;  // Return the updated wallet

    } catch (error: any) {
      throw new Error('Error in wallet process: ' + error.message);
    }
  };

  export default restoreUserWallet;
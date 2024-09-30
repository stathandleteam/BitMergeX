import { TransactionVersion } from "@stacks/transactions";
import { Wallet } from "@stacks/wallet-sdk";
import { encryptSeed } from "../helpers/encryption";
import { generateMnemonic } from "../helpers/generateKey";
import StxWalletDbService from "../services/stxWalletDbService";
import { StxWalletService } from "../services/stxWalletService";

// Complete Example
const registerUserAndCreateWallet = async ({userId, password, walletName}:{userId: string, password: string, walletName: string}) => {

    const baseWalletService = new StxWalletService();

    try {

      // Step 2: Create a wallet for the user (Wallet Service)

        const secretKey = generateMnemonic();

       const wallet: Wallet = await baseWalletService.createOrGetBaseWallet(secretKey, password);

       const encryptedSeed = await encryptSeed(secretKey, password);

      const walletAddress = (await baseWalletService.getAccountDetails(wallet.accounts[0], TransactionVersion.Testnet)).address;

      await StxWalletDbService.createWalletForUser(userId, walletName, encryptedSeed, walletAddress);

      console.log("wallet.accounts[0]", wallet.accounts[0], "secretKey", secretKey);

      console.log("walletAddress", walletAddress, "userId", userId, "walletName", walletName, "encryptedSeed", encryptedSeed, "walletAddress", walletAddress);

      // Step 3: Add an account to the wallet (Wallet Service)

      const nextIndex = wallet.accounts.length > 0 ? wallet.accounts.length - 1 : 0;
      const account = wallet.accounts[nextIndex];
      const accountData:{
          address: string,
          publicKey: string,
          privateKey: string,
      } = await baseWalletService.getAccountDetails(account, TransactionVersion.Testnet);

      console.log("accountData", accountData);
      const walletDb = StxWalletDbService.addAccountToWallet(userId, account.index,  accountData.address, accountData.publicKey);
  
      return walletDb;  // Return the updated wallet

    } catch (error: any) {
      throw new Error('Error in wallet process: ' + error.message);
    }
  };

  export default registerUserAndCreateWallet;
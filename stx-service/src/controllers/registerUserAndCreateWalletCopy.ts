import { NextFunction, Request, Response } from "express";
import { TransactionVersion } from "@stacks/transactions";
import { Wallet } from "@stacks/wallet-sdk";
import { encryptSeed } from "../helpers/encryption";
import { generateMnemonic } from "../helpers/generateKey";
import StxWalletDbService from "../services/stxWalletDbService";
import { StxWalletService } from "../services/stxWalletService";
import { asyncWrapper } from "./utils/asyncWrapper";
import { sendError, sendResponse } from "../helpers";



// Complete Example

const registerUserAndCreateWalletCopy = asyncWrapper(
  async (req: Request|any, res: Response, next: NextFunction) => {

  // const registerUserAndCreateWalletCopy = async (userId: string, password: string, walletName: string) => {
    const {userId, password, walletName}: {userId: string, password: string, walletName: string} = req.body; 

    const baseWalletService = new StxWalletService();
  
      try {
  
        // Step 2: Create a wallet for the user (Wallet Service)
  
          const secretKey = generateMnemonic();
  
         const wallet: Wallet = await baseWalletService.createOrGetBaseWallet(secretKey, password);
          
         const encryptedSeed = await encryptSeed(secretKey, password);
  
         await StxWalletDbService.createWalletForUser(userId, walletName, encryptedSeed, 'stx-address');
    
        // Step 3: Add an account to the wallet (Wallet Service)
  
        const nextIndex = wallet.accounts.length - 1
        const account = wallet.accounts[nextIndex];
        const accountData:{
            address: string,
            publicKey: string,
            privateKey: string,
        } = await baseWalletService.getAccountDetails(account, TransactionVersion.Testnet);
  
        const walletDb = StxWalletDbService.addAccountToWallet(userId, account.index,  accountData.address, accountData.publicKey);
    
  
        return sendResponse(res, {wallet: walletDb}, 201);

      } catch (error: any) {
        // throw new Error('Error in wallet process: ' + error.message);
        return sendError(res, error);

      }
    });

  export default registerUserAndCreateWalletCopy;
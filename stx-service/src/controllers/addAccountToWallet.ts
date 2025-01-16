import { TransactionVersion } from "@stacks/transactions";
import { Wallet } from "@stacks/wallet-sdk";
import { decryptSeed } from "../helpers/encryption";
import StxWalletDbService from "../services/stxWalletDbService";
import { StxWalletService } from "../services/stxWalletService";
import { asyncWrapper } from "./utils/asyncWrapper";
import {  Request, Response } from "express";
import { sendError, sendResponse } from "../helpers";



// Complete Example

const addAccountToWallet = asyncWrapper(
  async (req: Request|any, res: Response) => {

    const { userId, password }: {userId: string, password: string } = req.body; 

    const baseWalletService = new StxWalletService();
  
      try {
  
        // Step 2: Retrive Existing wallet for the user (Wallet Service)
  
        const existingWalletDb = await StxWalletDbService.getWalletForUser(userId);
          
        const decryptedSeed = await decryptSeed(existingWalletDb.encryptedSeed, password);

        const wallet: Wallet = await baseWalletService.createOrGetBaseWallet(decryptedSeed, password);

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
        return sendError(res, error);
      }
    });

  export default addAccountToWallet;
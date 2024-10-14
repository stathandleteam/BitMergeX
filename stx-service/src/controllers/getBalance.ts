import { Request, Response } from "express";
import { sendError, sendResponse } from "../helpers";
import { asyncWrapper } from "./utils/asyncWrapper";
import { StxWalletDbService, StxWalletService } from "../services";


export const getOnChainAccountBalance = asyncWrapper(
    async (req: Request|any, res: Response) => {
        const stxWalletDbService = new StxWalletService();
        const address = req.params.address;
        try{
            
            const onChainBalance = await stxWalletDbService.getBalance(address);

            return sendResponse(res, {balance: onChainBalance}, 201);

        } catch (error: any) {

            return sendError(res, error);
  
        }
    }
)

export const getWalletAccountBalance = asyncWrapper(
    async (req: Request|any, res: Response) => {
        
        const accountIdx = req.params.accountIdx;

        try{
            const userId = req.userId;

            const wallet = await StxWalletDbService.getWalletForUser(userId);
            
            const balance = await wallet.accounts[accountIdx].balance;

            return sendResponse(res, {balance}, 201);

        } catch (error: any) {

            return sendError(res, error);
  
        }
});

export const getWalletBalance = asyncWrapper(
    async (req: Request|any, res: Response) => {

        try{
            
            const userId = req.userId;
            const wallet = await StxWalletDbService.getWalletForUser(userId);
            const balance = wallet.accounts.reduce((total, account) => total + account.balance, 0);
            return sendResponse(res, {balance: balance}, 201);

        } catch (error: any) {

            return sendError(res, error);
  
        }
    }
);



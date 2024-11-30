import { Request, Response } from "express";
import { sendError, sendResponse } from "../helpers";
import { asyncWrapper } from "./utils/asyncWrapper";
import { StxWalletDbService, StxWalletService } from "../services";


export const sendStx = asyncWrapper(
    async (req: Request|any, res: Response) => {
        const stxWalletDbService = new StxWalletService();
        const address = req.params.address;

        const {senderAddress, privKey, recipientAddress, amount, memo} = req.body;

        try{
            
            const onChainBalance = await stxWalletDbService.sendStx({senderAddress, privKey, recipientAddress, amount, memo});

            return sendResponse(res, {balance: onChainBalance,  message: 'Transaction successful' }, 201);

        } catch (error: any) {

            return sendError(res, error);
  
        }
    }
)
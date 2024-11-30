import { Request, Response } from "express";
import { sendError, sendResponse } from "../helpers";
import { asyncWrapper } from "./utils/asyncWrapper";
import { StxWalletDbService } from "../services";




const getWallet = asyncWrapper(
    async (req: Request|any, res: Response) => {
        try{
            const userId = req.userId;
            const wallet = await StxWalletDbService.getWalletForUser(userId);
            return sendResponse(res, {wallet}, 201);
        } catch (error: any) {
          // throw new Error('Error in wallet process: ' + error.message);
          return sendError(res, error);
  
        }
    });


export default getWallet;
import { Request, Response } from "express";
import createHttpError from "http-errors";

import { asyncWrapper } from "../utils/asyncWrapper";
import { logger, sendError, hashPassword, sendResponse } from "../../helpers";
import { userService } from "../../services/userService";
import { messages } from "../../constants";
import { publishTo } from "rabbitmq/publisher";
import { consumeFrom } from "../../rabbitmq/consumer";

const registerController = asyncWrapper(async (req: Request, res: Response) => {
  try {

    const { seedPhrase, password } = req.body;

    // const existingUser = await userService.findUserByEmail(email);

    // if (existingUser) {
    //   logger.error(messages.EXISTING_EMAIL);
    //   return sendError(res, createHttpError(409, messages.EXISTING_EMAIL));
    // }

    const data = { event: 'restoreWallet', data: { seedPhrase, password } }

    await publishTo(data, "wallet_queue");

    const walletData:any = await consumeFrom("user_queue")

    const hash = await hashPassword(password);

    await userService.findAndUpdateUserById({id: walletData.userId.toString(),  password: hash});
    
    console.log("walletData", walletData);

    return sendResponse(res, messages.WALLET_RESTORED, 201);

  } catch (err) {

    const error = err as Error;

    logger.error(error.message);
    return sendError(res, error);
  }
});

export default registerController;
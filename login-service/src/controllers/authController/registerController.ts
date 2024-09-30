import { Request, Response } from "express";
import createHttpError from "http-errors";

import { asyncWrapper } from "../utils/asyncWrapper";
import { logger, sendError, hashPassword, sendResponse } from "../../helpers";
import { userService } from "../../services/userService";
import { messages } from "../../constants";
import { publishTo } from "../../rabbitmq/publisher";
import { consumeFrom } from "../../rabbitmq/consumer";

const registerController = asyncWrapper(async (req: Request, res: Response) => {
  try {

    const { name, email, password } = req.body;

    const existingUser = await userService.findUserByEmail(email);

    if (existingUser) {
      logger.error(messages.EXISTING_EMAIL);
      return sendError(res, createHttpError(409, messages.EXISTING_EMAIL));
    }

    const hash = await hashPassword(password);

    const userDoc:any =  await userService.create(name, email, hash, "user");

    const data = { event: 'createWallet', data: { userId: userDoc.id, password, walletName: 'Account 1' } }

    // const data = { event: 'createWallet', data: { userId: "91f7c019b8e98e7d1c0a5f63", password: "password2", walletName: 'Account 1' } }

    console.log("data", data)

    await publishTo(data, "wallet_queue");

    console.log("updated", "updated")

    const { data:walletData, event }:any  = await consumeFrom("user_queue")
    
    if (event === 'walletCreationFailed'){
      return sendError(res, createHttpError(401, walletData.message));
    }

    console.log("walletData", walletData);

    return sendResponse(res, {message: messages.ACCOUNT_CREATED,  data: walletData}, 201);

  } catch (err) {

    const error = err as Error;

    logger.error(error.message);
    return sendError(res, error);
  }
});

export default registerController;
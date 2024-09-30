import { Request, Response } from "express";

import { sendResponse } from "../helpers/response";
import { asyncWrapper } from "./utils/asyncWrapper";

const helloController = {
  hello: asyncWrapper(async (_req: Request, res: Response) => {
    sendResponse(res, { message: "Hello world" });
  }),
};

export default helloController;
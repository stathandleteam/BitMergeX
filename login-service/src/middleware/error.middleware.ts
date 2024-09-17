import { ErrorRequestHandler, NextFunction, Request, Response } from "express"
import { logger as logEvent } from "../utils/logger";
import { CustomError } from "../utils/custom_error";

// const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
//   res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
// };


const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    const logMessage = `${err.name}: ${err.message} status: ${res.statusCode} - ${req.originalUrl} - ${req.method} - ${req.ip}`;
    logEvent(logMessage, 'errLog.log')
    
    if (err instanceof CustomError) {
      res.status(err.statusCode).json({ message: err.customMessage });
    } else {
      res.status(500).json({ message: 'Internal Server Error' });
    }
}


export default errorHandler;
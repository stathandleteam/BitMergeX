import { NextFunction, Request, Response } from 'express'
import { logger as logEvent } from '../utils/logger';


export const logger = (req: Request, res: Response, next: NextFunction) => {
	const logMessage = `${req.method}\t${req.headers.origin}\t${req.url}`;
	logEvent(logMessage, 'reqLog.log')
	console.log(`${req.method} ${req.path}`)
	next();
};

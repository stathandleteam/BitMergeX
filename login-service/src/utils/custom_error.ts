
export class CustomError extends Error {
    statusCode: number;
    customMessage: string;
    status: string;
    isOperational: boolean;
  
    constructor(message: string, statusCode: number, customMessage?: string) {
      super(message);
      this.statusCode = statusCode;
      this.customMessage = customMessage || 'Something went wrong';
      this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
      this.isOperational = true;
      Error.captureStackTrace(this, this.constructor);
    }
}
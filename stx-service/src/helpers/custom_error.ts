
// export class CustomError extends Error {
//     statusCode: number;
//     customMessage: string;
//     status: string;
//     isOperational: boolean;
  
//     constructor(message: string, statusCode: number, customMessage?: string) {
//       super(message);
//       this.statusCode = statusCode;
//       this.customMessage = customMessage || 'Something went wrong';
//       this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
//       this.isOperational = true;
//       Error.captureStackTrace(this, this.constructor);
//     }
// }

export class HttpException extends Error {
  public status: number;
  public message: string;
  customMessage: string | undefined;

  constructor(status: number, message: string, customMessage?: string) {
    super(message);
    this.status = status;
    this.message = message;
    this.customMessage = customMessage;
  }
}
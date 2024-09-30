import { Schema, model, Document } from 'mongoose';
  
// Define the STX Transaction interface
interface IStxTransaction extends Document {
    transactionId: string; // Unique transaction identifier
    fromAddress: string;
    toAddress: string;
    amount: number;
    fee: number;
    type: string;
    status: string; // pending, completed, failed
    createdAt: Date;
  }
  
  // Define the STX Transaction schema
  const StxTransactionSchema = new Schema<IStxTransaction>({
    transactionId: { type: String, required: true, unique: true },
    fromAddress: { type: String, required: true },
    toAddress: { type: String, required: true },
    amount: { type: Number, required: true },
    fee: { type: Number, required: true },
    type: { type: String, enum: ['send', 'receive'], required: true },
    status: { type: String, required: true }, // pending, completed, failed
    createdAt: { type: Date, default: Date.now },
  });
  
  // Create the STX Transaction model
  export const StxTransactionModel = model<IStxTransaction>('StxTransaction', StxTransactionSchema);
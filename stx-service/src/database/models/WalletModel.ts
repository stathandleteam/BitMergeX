import { model, Schema, Types } from "mongoose";

// Interface for the Account
export interface IAccount {
  address: string;
  accountId: number;
  publicKey: string;
  createdAt: Date;
  balance: number;
}

// Account Schema
export const AccountSchema = new Schema<IAccount>({
  address: { 
    type: String, unique: true, sparse: true 
    // type: String, required: true, unique: true
   },
  accountId: { type: Number, required: true },
  publicKey: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  balance: { type: Number, default: 0 }

});

export interface IWalletModel  extends Document {
  userId: Types.ObjectId;  // Link to user
  name: string;  // e.g., 'Main Wallet', 'Savings'
  encryptedSeed: string;
  accounts: IAccount[];
  primaryAddress: string;
  createdAt: Date;
}

const WalletSchema = new Schema<IWalletModel>({
  userId: { type: Schema.Types.ObjectId, required: true },  // Link to user
  name: { type: String, required: true },  // e.g., 'Main Wallet', 'Savings'
  encryptedSeed: { type: String, required: true },
  primaryAddress: { type: String, required: true },
  // accounts: [AccountSchema],  // Array of accounts
  accounts: { type: [AccountSchema], default: [] },
  createdAt: { type: Date, default: Date.now }
});

export default model<IWalletModel>('StxWallet', WalletSchema);
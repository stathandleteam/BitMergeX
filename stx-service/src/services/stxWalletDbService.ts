import { Document, Types } from "mongoose";
import WalletModel, { AccountSchema, IWalletModel, } from "../database/models/WalletModel";
import { StxTransactionModel } from "../database/models/StxTransactionModel";


type WalletDoc = Document<unknown, NonNullable<unknown>, IWalletModel> &
  Omit<
    IWalletModel & {
      _id: Types.ObjectId;
    },
    never
  >;

const convertWalletDocToWallet = (walletDoc: WalletDoc|any) => {
  const user: any = {
    id: walletDoc._id.toString(),
    userId: walletDoc.name,
  };

  return user;
};


class StxWalletDbService {
  static async create(
  // name: string,
  // email: string,
  // hashPassword: string,
  // role: ,
  userId: string, 
  walletName: string, 
  encryptedSeed: string, 
  principalAddress: string
): Promise<any> {
    const userDoc = await WalletModel.create({
      userId,  // Reference to the user
          name: walletName,
          encryptedSeed: encryptedSeed,
          primaryAddress: principalAddress,
    });
    return convertWalletDocToWallet(userDoc);
  
}
    static async createWalletForUser(userId: string, walletName: string, encryptedSeed: string, principalAddress: string) {
        const newWallet = new WalletModel({
          userId,  // Reference to the user
          name: walletName,
          encryptedSeed: encryptedSeed,
          primaryAddress: principalAddress,
        });
      
        const savedWallet = await newWallet.save(); // Save wallet to the DB
        return savedWallet;
      };


    static async updateWalletForUser(address: string, walletName: string | undefined, encryptedSeed: string) {

        // Find the wallet associated with the userId
        const updateData: { [key: string]: string } = {};

        if (walletName) {
          updateData.name = walletName;
        }
    
        if (encryptedSeed) {
          updateData.encryptedSeed = encryptedSeed;
        }
        if (walletName || encryptedSeed) {
          const row = await WalletModel
            .findOneAndUpdate({ primaryAddress: address }, updateData, { returnDocument: "after" })
            .exec();
          if (row) {
            return convertWalletDocToWallet(row);
          }
        }
        return null;
    }

    static async addAccountToWallet(userId: string, accountId:number, address: string, publicKey: string){
        // Find the wallet associated with the userId
        const wallet = await WalletModel.findOne({ userId });
        
        if (!wallet) {
          throw new Error('Wallet not found');
        }
      
        // Create a new account object
        const newAccount: any = {
            accountId,
            address,
            publicKey,
            createdAt: new Date(),
          };
          
      
        // Add the new account to the wallet's accounts array
        wallet.accounts.push(newAccount);
      
        // Save the updated wallet
        const updatedWallet = await wallet.save();
      
        return updatedWallet;
      };


      // Function to retrieve all accounts of a user's wallet
       static async getWalletForUser(userId: string){
            const wallet = await WalletModel.findOne({ userId });
            if (!wallet) {
              throw new Error('Wallet not found');
            }  
            return wallet;
        };

    async createStxTransaction(fromAddress: string, toAddress: string, amount: number, fee: number) {
      // Generate a unique transaction ID
      const transactionId = `tx_${Date.now()}`;
    
      // Create a new transaction document
      const newTransaction = new StxTransactionModel({
        transactionId,
        fromAddress,
        toAddress,
        amount,
        fee,
        status: 'pending',
        createdAt: new Date(),
      });

      // Save the transaction to the database
      await newTransaction.save();
      return newTransaction;
    }
        
}

export default StxWalletDbService;
// https://api.testnet.hiro.so
// ST2C3FB97P0FDRV7XCX9J7CPCVGEE6419D7PNX16Y

import { StacksDevnet, StacksNetwork } from "@stacks/network";
import {  generateWallet, getStxAddress, Wallet, generateNewAccount, Account } from '@stacks/wallet-sdk';
import { StacksMainnet, StacksTestnet } from '@stacks/network';
import { AnchorMode, broadcastTransaction, Cl, ClarityValue, createStacksPrivateKey, getNonce, makeContractCall, makeSTXTokenTransfer, Pc, PostConditionMode, privateKeyToString, pubKeyfromPrivKey, publicKeyToString, TransactionVersion, uintCV } from '@stacks/transactions';
import { restoreWalletAccounts } from '@stacks/wallet-sdk';
import { createPostCondition, generateMnemonic, getNonceFromAddress } from "../helpers/generateKey";
import { decryptSeed, encryptSeed } from "../helpers/encryption";
import * as bip39 from 'bip39';
import { VITE_API_KEY } from '@/api/secrets';
import { secureIndexedDBStorage } from "./stx-wallet-storage";
import { validateStacksAddress } from '@stacks/transactions';

import { MainWalletApp } from "./stx-wallet-controller";
import { StxAccountManager } from "../dbmangers/StxAccountManager";
import { networkStore } from '@/services/networkStore';
import { store } from "../store";
import { stxTransactionHistoryApi } from "@/services/stxTransactionHistoryApi";


type StacksNetworkType = 'mainnet' | 'testnet' | 'devnet';
const { dispatch } = store;

export class StxWalletService {
    
    private GAIA_HUB_URL = 'https://hub.stacks.co';

    private network: StacksMainnet | StacksTestnet  = new StacksTestnet();

    // constructor() {
    //     this.network = new StacksDevnet({
    //         url: `https://api.platform.hiro.so/v1/ext/${VITE_API_KEY}/stacks-blockchain-api`,
    //         // url: `https://api.testnet.hiro.so/v1/ext/${VITE_API_KEY}/stacks-blockchain-api`
    //     });
    // }

    // private network: StacksNetwork;

    private networkType: StacksNetworkType;
    private apiBaseUrl: string;

    constructor(networkType: StacksNetworkType = 'testnet') {
        this.networkType = networkType;
        this.initializeNetwork();
        this.apiBaseUrl = this.getApiBaseUrl();
    }

    /**
     * Initialize network based on network type
     */
    private initializeNetwork() {
        switch (this.networkType) {
            case 'mainnet':
                this.network = new StacksMainnet();
                this.GAIA_HUB_URL = 'https://hub.blockstack.org'; // Mainnet Gaia hub
                break;
            case 'testnet':
                this.network = new StacksTestnet();
                this.GAIA_HUB_URL = 'https://hub.testnet.stacks.co'; // Testnet Gaia hub
                break;
            case 'devnet':
                this.network = new StacksDevnet({
                    url: 'http://localhost:3999',
                });
                this.GAIA_HUB_URL = 'http://localhost:3000'; // Local Gaia hub for devnet
                break;
            default:
                throw new Error('Unsupported network type');
        }
    }

  /**
   * Get appropriate API base URL
   */
  private getApiBaseUrl(): string {
      switch (this.networkType) {
          // case 'mainnet':                
          //     return 'https://api.stacks.co/extended/v1';
          // case 'testnet'::
          //     return 'https://api.testnet.stacks.co/extended/v1'
          // case 'devnet':
          //     return 'http://localhost:3999'

          case 'mainnet':
              return 'https://api.stacks.co/extended/v1';
          case 'testnet':
              return 'https://api.testnet.stacks.co/extended/v1';
          case 'devnet':
              return 'http://localhost:3999/extended/v1';
            
          default:
              return 'http://localhost:3999/extended/v1';
      }
  }

    // group axis crush dust alert east merry increase beef uphold eye law
    static async getMnemonic(): Promise<string> {
        const mnemonic = generateMnemonic();
        return mnemonic
    }

   static downloadTxtFile (seedPhrase: string) {
        const element = document.createElement("a");
        const file = new Blob(
          ["Seed Phrase: " + seedPhrase],
          { type: "text/plain;charset=utf-8" }
        );
        element.href = URL.createObjectURL(file);
        element.download = "DigitizID_BTC_Wallet.txt";
        document.body.appendChild(element);
        element.click();
      };

    static async validateSeedPhrase (mnemonic: string){
        if (!bip39.validateMnemonic(mnemonic)) {
            return false
        }
        return true
    }

    async createWallet(password: string, mnemonic: string): Promise<Wallet> {
        
        if (!await StxWalletService.validateSeedPhrase(mnemonic)) {
            throw new Error('Invalid mnemonic');
        }

        const wallet = await generateWallet({
            secretKey: mnemonic,
            password,
        });

        const encryptedSeed = await encryptSeed(mnemonic, password);
        
        this.storeSeed(encryptedSeed);
        await StxAccountManager.storeStxAccountIndex(0);

        return wallet

    }


    async getAccount(wallet: Wallet, index:number){
        return getStxAddress({ account: wallet.accounts[index] });
    }
    async restoreWallet(mnemonic: string, password: string): Promise<{ address: string }> {

        if (!await StxWalletService.validateSeedPhrase(mnemonic)) {
            throw new Error('Invalid mnemonic');
        }

        // const secretKey = await bip39.mnemonicToEntropy(mnemonic);
        
        const wallet = await generateWallet({
            secretKey: mnemonic,
            password,
        });

        // const wallet = await this.restoreWalletWithSeed(mnemonic, password);
        const address = getStxAddress({ account: wallet.accounts[0] });

        // Encrypt the seed for storage
        
        const encryptedSeed = await encryptSeed(mnemonic, password);

        this.storeSeed(encryptedSeed);
        await StxAccountManager.storeStxAccountIndex(0);

        return { address };
    }


    async createOrGetBaseWallet(secretKey: string, password: string) {
        const wallet: Wallet = await generateWallet({
            secretKey: secretKey,
            password: password,
        });

        return wallet;
    }

    async restoreWalletWithSeed(secretKey: string, password: string = '') {
        try {
            const baseWallet: Wallet = await generateWallet({
                secretKey: secretKey,
                password: password,
            });
            const wallet = await restoreWalletAccounts({
                wallet: baseWallet,
                gaiaHubUrl: this.GAIA_HUB_URL,
                network: this.network,
            });
            return wallet;
        } catch (error) {
            console.error('Error restoring wallet with seed:', error);
            throw error; // Or handle this error in a way that makes sense for your application
        }
    }

    static async addAccountsToWallet(wallet: Wallet) {
        const newWallet = await generateNewAccount(wallet);
        return newWallet;
    }

    async getAccountDetails(account: Account, transactionVersion: TransactionVersion ) {
        const stxAddress = getStxAddress({ account, transactionVersion});
        const stxPrivateKey = privateKeyToString(
            createStacksPrivateKey(account.stxPrivateKey)
        )
        const stxPublicKey = publicKeyToString( pubKeyfromPrivKey(account.stxPrivateKey))

        return {
            address: stxAddress,
            publicKey: stxPublicKey,
            privateKey: stxPrivateKey,
        };
    }

    // Function to get balance from a deployed contract
    public async getBalance(address: string): Promise<any> {
        
        const OWNER_PRIVKEY = '753b7cc01a1a2e86221266a154af739463fce51219d97e4f856cd7200c3bd2a601';//process.env.OWNER_PRIVKEY;

        if (!OWNER_PRIVKEY) {
            throw new Error('Failed to fetch balance');
        }
        try {

            const nonce = await getNonce(address, this.network);

            // Construct the contract call to 'get-balance' function

            const functionArgs: ClarityValue[] = [Cl.principal(address),];
            const transaction = await makeContractCall({
                contractAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
                contractName: 'stx-wallet-test',
                functionName: 'get-balance',
                functionArgs,
                fee: BigInt(300),
                nonce: nonce,
                network: this.network,
                anchorMode: AnchorMode.OnChainOnly,
                senderKey: OWNER_PRIVKEY,
                postConditionMode: PostConditionMode.Deny,
            });

            // Broadcast the transaction
            const result = await broadcastTransaction(transaction, this.network);
            
            return result;

        } catch (error) {
            console.error('Error fetching balance:', error);
            throw new Error('Failed to fetch balance');
        }
    }

    // Function to send STX
    public async sendStx({senderAddress, privKey, recipientAddress, amount, memo}:{senderAddress: string, privKey: string, recipientAddress: string, amount: number, memo: string}): Promise<any> {
        try {
            
            // const nonce = await getNonceFromAddress(senderAddress, this.network);
            // const amountToSend = Cl.uint(amount); // Convert to microstacks

            // const postCondition_1 = createPostCondition(senderAddress, amount);
            // console.log("postCondition_1", postCondition_1)

            // const transaction = await makeContractCall({
            //     contractAddress:
            //     //  process.env.CONTRACT_ADDRESS || 
            //     'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
            //     contractName: 'stx-wallet-test',
            //     functionName: 'send-stx',
            //     functionArgs: [amountToSend, Cl.principal(senderAddress), Cl.principal(recipientAddress), Cl.bufferFromAscii(memo)],
            //     fee: BigInt(300),
            //     nonce: nonce,
            //     network: this.network,
            //     anchorMode: AnchorMode.OnChainOnly,
            //     senderKey: privKey,
            //     postConditions: [postCondition_1],
            //     postConditionMode: PostConditionMode.Deny,
            // });

            const transaction = await makeSTXTokenTransfer({
                recipient: recipientAddress,
                amount: BigInt(Math.round(0.0001 * 1_000_000)),
                senderKey: privKey,
                network: this.network,
                anchorMode: AnchorMode.Any,
                fee: BigInt(300),
                memo: 'App transaction fee'
              });
        
              console.log("transaction", transaction);
            const result = await broadcastTransaction(transaction, this.network);

            return result;

        } catch (error:any) {
            console.error('Error sending STX:', error.message);
            throw new Error('Failed to send STX');
        }
    }
     private async storeSeed(encryptedSeed: any) {
        await secureIndexedDBStorage.storeSeed({
            encrypted: encryptedSeed,
            iv: 'someIV',
            authTag: 'someAuthTag',
            salt: 'someSalt'
        });
    }

    private async retrieveSeed() {
        try {
            // Retrieve the seed
            const retrievedSeed = await secureIndexedDBStorage.retrieveSeed();
            return retrievedSeed;
        } catch (error) {
            throw new Error('Not implemented');
        }
    }

    async unlockWallet(password: string): Promise<Wallet | null> {

        try {

            const encryptedSeed = await this.retrieveSeed();
            if (!encryptedSeed) {
                console.error('No seed found in storage');
                return null;
            }
            const decryptedSeed: string | null = await decryptSeed(encryptedSeed, password);
            
            if (!decryptedSeed) {
                console.error('Failed to decrypt seed with given password');
                return null;
            }
        
            // Use restoreWalletWithSeed for full restoration
            // const wallet: Wallet = await this.restoreWalletWithSeed(decryptedSeed, password);
            const wallet: Wallet = await this.createOrGetBaseWallet( decryptedSeed, password)
             // Scan for existing accounts

            return wallet;
        } catch (error) {
            console.error('Error unlocking wallet:', error);
            return null;
        }
    }
    

    static async checkSeedExist() {
        try {
            const retrievedSeed = await secureIndexedDBStorage.retrieveSeed();
            return !!retrievedSeed
        } catch (error) {
            
        }
    }

    static async resetWallet() {
        try {
            await secureIndexedDBStorage.clearSeed();  
            return true;
        } catch (error) {
            console.log("error", error)
            return false
        }
    }

    async scanForAccounts(wallet: Wallet, transactionVersion: TransactionVersion, maxAccounts = 10) {
        const discoveredAccounts = [];
        let currentWallet = wallet;
    
        // Start with the first account that's already in the wallet
        discoveredAccounts.push(currentWallet.accounts[0]);
    
        // Scan subsequent possible accounts
        for (let i = 1; i < maxAccounts; i++) {
          try {
            // Generate the next account
            currentWallet = generateNewAccount(currentWallet);
            const account: Account = currentWallet.accounts[currentWallet.accounts.length - 1];
            
            // Check if this account has any activity
            const stxAddress = getStxAddress({ account, transactionVersion});

            const hasActivity = await this.checkAccountActivity(stxAddress);
            
            if (hasActivity) {
              discoveredAccounts.push(account);
            } else {
              // If we find an account with no activity, we can assume we've found all accounts
              // (Optional: you might want to check a few more indices to be sure)
              break;
            }
          } catch (error) {
            console.error(`Error scanning account at index ${i}:`, error);
            break;
          }
        }
    
        return discoveredAccounts;
      }
    
      async checkAccountActivity(stxAddress: string) {
        try {
          // Check for transactions
            const options  = {
                limit: 10,
                offset: 0
            }

            const transactionHistory = await dispatch(stxTransactionHistoryApi.endpoints.getTransactionHistory
            .initiate({ address: stxAddress, options}, { forceRefetch: true }));

            //   const transactions = await this.accountsApi.getAccountTransactions({
            //     principal: publicKey,
            //     limit: 1
            //   });

        
          // Check for STX balance
          const balance = await dispatch(stxTransactionHistoryApi.endpoints.getAddressBalance.initiate(stxAddress));

          //   const balance = await this.accountsApi.getAccountBalance({
        //     principal: publicKey
        //   });
    
          // Consider an account active if it has any transactions or balance
          return  (transactionHistory.data && transactionHistory.data.length > 0 || balance?.data && balance?.data?.balance > 0);
          
        } catch (error) {
          console.error('Error checking account activity:', error);
          return false;
        }
      }
}

export const stxWalletDbService = new StxWalletService(networkStore.networkType);

async function main (){
    const stxWalletService = new StxWalletService(networkStore.networkType);

    // const mnemonicRecipientAddress = 'sell invite acquire kitten bamboo drastic jelly vivid peace spawn twice guilt pave pen trash pretty park cube fragile unaware remain midnight betray rebuild'
    // const secretKeyRecipientAddress = '7287ba251d44a4d3fd9276c88ce34c5c52a038955511cccaf77e61068649c17801'
    // const recipientAddress = 'ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5'; // Devnet address
    const recipientAddress = 'ST1KK2VMSSTSK1BY64SG2WFFFTMAGCY15FXT37HHX';

    // let recipientWallet = await stxWalletService.createWallet("testpassword", mnemonicRecipientAddress);
    

    const password = 'testpassword';
    // const mnemonic = 'twice kind fence tip hidden tilt action fragile skin nothing glory cousin green tomorrow spring wrist shed math olympic multiply hip blue scout claw'; //
    const mnemonic  = 'grain shed arch side fine wave plastic vague bus abandon knife true'

    // const mnemonic = await StxWalletService.getMnemonic();

    let senderWallet = await stxWalletService.createWallet(password, mnemonic);
    console.log("senderWallet", senderWallet)

    const details = (await stxWalletService.getAccountDetails(senderWallet.accounts[0], 128));

    const result = await stxWalletService.sendStx({
      senderAddress: details.address,
      privKey: details.privateKey,
      recipientAddress,
      amount: 1, // Send 1 STX
      memo: 'Test transaction',
    });

    console.log("result", result);

}

// main()
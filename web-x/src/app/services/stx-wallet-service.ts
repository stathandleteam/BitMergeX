import { StacksDevnet } from "@stacks/network";
import {  generateWallet, getStxAddress, Wallet, generateNewAccount, Account, AllowedKeyEntropyBits } from '@stacks/wallet-sdk';
import { StacksMainnet, StacksTestnet } from '@stacks/network';
import { AnchorMode, broadcastTransaction, Cl, ClarityValue, createStacksPrivateKey, getNonce, makeContractCall, Pc, PostConditionMode, privateKeyToString, pubKeyfromPrivKey, publicKeyToString, TransactionVersion, uintCV } from '@stacks/transactions';
import { restoreWalletAccounts } from '@stacks/wallet-sdk';
import { createPostCondition, generateMnemonic, getNonceFromAddress } from "../helpers/generateKey";
import { decryptSeed, encryptSeed } from "../helpers/encryption";
import * as bip39 from 'bip39';
import { VITE_API_KEY } from '@/api/secrets';
import { secureIndexedDBStorage } from "./stx-wallet-storage";
import { MainWalletApp } from "./stx-wallet-controller";

export class StxWalletService {
    private GAIA_HUB_URL = 'https://hub.stacks.co';
    private network: StacksMainnet | StacksTestnet  = new StacksTestnet();

    constructor() {
        this.network = new StacksDevnet({
            url: `https://api.platform.hiro.so/v1/ext/${VITE_API_KEY}/stacks-blockchain-api`,
        });
    }

    // group axis crush dust alert east merry increase beef uphold eye law
    static async getMnemonic(): Promise<string> {
        const mnemonic = generateMnemonic();
        console.log("await StxWalletService.getMnemonic()", mnemonic)
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
        console.log("mnemonic", mnemonic);
        console.log(bip39.validateMnemonic(mnemonic))
        if (!bip39.validateMnemonic(mnemonic)) {
            return false
        }
        return true
    }
    async createWallet(password: string, mnemonic: string): Promise<{ mnemonic: string; address: string }> {
        
        console.log(mnemonic)
        
        if (!await StxWalletService.validateSeedPhrase(mnemonic)) {
            throw new Error('Invalid mnemonic');
        }
        // const secretKey = generateMnemonic();

        // const secretKey = await bip39.mnemonicToEntropy(mnemonic);

        const wallet = await generateWallet({
            secretKey: mnemonic,
            password,
        });

        const encryptedSeed = await encryptSeed(mnemonic, password);
       
        const address = getStxAddress({ account: wallet.accounts[0] });

        this.storeSeed(encryptedSeed);

        return { mnemonic, address };

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

        const address = getStxAddress({ account: wallet.accounts[0] });

        // Encrypt the seed for storage
        
        const encryptedSeed = await encryptSeed(mnemonic, password);

        this.storeSeed(encryptedSeed);

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
        const baseWallet: Wallet = await generateWallet({
            secretKey: secretKey,
            password: password,
        });
        const wallet = await restoreWalletAccounts({
            wallet: baseWallet,
            gaiaHubUrl: this.GAIA_HUB_URL,
            network: new StacksMainnet(),
        });
        return wallet;
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
        
        const OWNER_PRIVKEY = process.env.OWNER_PRIVKEY;

        if (!OWNER_PRIVKEY) {
            throw new Error('Failed to fetch balance');
        }
        try {

            const nonce = await getNonce(address, this.network);

            // Construct the contract call to 'get-balance' function

            const functionArgs: ClarityValue[] = [Cl.principal(address),];
            const transaction = await makeContractCall({
                contractAddress: process.env.CONTRACT_ADDRESS || 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
                contractName: 'stx-wallet',
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
            console.log('Balance Transaction Result:', result);
            
            return result;

        } catch (error) {
            console.error('Error fetching balance:', error);
            throw new Error('Failed to fetch balance');
        }
    }

    // Function to send STX
    public async sendStx({senderAddress, privKey, recipientAddress, amount, memo}:{senderAddress: string, privKey: string, recipientAddress: string, amount: number, memo: string}): Promise<any> {
        try {
            
            const nonce = await getNonceFromAddress(senderAddress, this.network);
            const amountToSend = Cl.uint(amount); // Convert to microstacks
            const postCondition_1 = createPostCondition(senderAddress, amount);

            const transaction = await makeContractCall({
                contractAddress: process.env.CONTRACT_ADDRESS || 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
                contractName: 'stx-wallet',
                functionName: 'send-stx',
                functionArgs: [amountToSend, Cl.principal(senderAddress), Cl.principal(recipientAddress), Cl.bufferFromAscii(memo)],
                fee: BigInt(300),
                nonce: nonce,
                network: this.network,
                anchorMode: AnchorMode.OnChainOnly,
                senderKey: privKey,
                postConditions: [postCondition_1],
                postConditionMode: PostConditionMode.Deny,
            });

            const result = await broadcastTransaction(transaction, this.network);

            console.log('Send STX Transaction Result:', result);

            return result;

        } catch (error) {
            console.error('Error sending STX:', error);
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
        // console.log('Storing encrypted seed:', encryptedSeed);
    }

    private async retrieveSeed() {
        try {
            // Retrieve the seed
            const retrievedSeed = await secureIndexedDBStorage.retrieveSeed();
            console.log('Retrieved seed:', retrievedSeed);
            return retrievedSeed;
        } catch (error) {
            throw new Error('Not implemented');
        }
    }

    async unlockWallet(password: string): Promise<any> {
        const encryptedSeed = await this.retrieveSeed();
        const decryptedSeed: string = await decryptSeed(encryptedSeed, password);
        console.log("encryptedSeed", decryptedSeed)

        const wallet: Wallet = await this.createOrGetBaseWallet(decryptedSeed, password);
        return wallet;

    }

    static async checkSeedExist() {
        try {
            const retrievedSeed = await secureIndexedDBStorage.retrieveSeed();
            return !!retrievedSeed
        } catch (error) {
            
        }
    }
}

// Usage example
async function main() {

    const wallet = new StxWalletService();
    // const mnemonic = await StxWalletService.getMnemonic()
    // Create a new wallet
    // const {  address } = await wallet.createWallet('strongPassword123', mnemonic);
    // console.log('New wallet created:', { mnemonic, address });
    const { mnemonic, address } = {mnemonic: 'bridge learn wish slim tragic dwarf nature satoshi enact outside manage road', address: 'ST1VGK6W827P09QAKESZQ8C6F8FG7S99V73XHKSCE'}
    // Restore a wallet
    const restoredWallet = await wallet.restoreWallet(mnemonic, 'strongPassword123');
    console.log('Wallet restored:', restoredWallet);

    // Check wallet exist
    const check = await StxWalletService.checkSeedExist()
    console.log(`Wallet ${check?"exist": "do not exist"}`);

    // Unlock the wallet
    const walletUnlocked = await wallet.unlockWallet('strongPassword123');
    console.log('Wallet unlocked successfully', walletUnlocked);

}

main().catch(console.error);

// Usage
(async () => {
    const stxWalletDbService = new StxWalletService()
    const walletApp = new MainWalletApp();

    const password = 'your_password';
    const mnemonic = await StxWalletService.getMnemonic();

    // const wallet = await walletApp.getWallet(password, mnemonic);
    const wallet = await stxWalletDbService.unlockWallet('strongPassword123')

    if (wallet) {
        
        // console.log("new account", await walletApp.addAccountToWallet(wallet));
       const accountDetails = await walletApp.getWalletAccountDetails(wallet.accounts[0], TransactionVersion.Mainnet) ;
       console.log("accountBalance", accountDetails ? await walletApp.getWalletBalance(accountDetails.address): "Balance is not available") ;
        // await walletApp.sendStx(wallet.address, 'your_private_key', 'recipient_address', 100, 'Transaction memo');
    }
})();

export const stxWalletDbService = new StxWalletService();
import { StacksDevnet } from "@stacks/network";
import { generateWallet, getStxAddress, Wallet, generateNewAccount, Account, AllowedKeyEntropyBits } from '@stacks/wallet-sdk';
import { StacksMainnet, StacksTestnet } from '@stacks/network';
import { AnchorMode, broadcastTransaction, Cl, ClarityValue, createStacksPrivateKey, getNonce, makeContractCall, Pc, PostConditionMode, privateKeyToString, pubKeyfromPrivKey, publicKeyToString, TransactionVersion, uintCV } from '@stacks/transactions';
import { restoreWalletAccounts } from '@stacks/wallet-sdk';
import { createPostCondition, getNonceFromAddress } from "../helpers/generateKey";

export class StxWalletService {
    private GAIA_HUB_URL = 'https://hub.stacks.co';
    private network: StacksMainnet | StacksTestnet  = new StacksTestnet();

    constructor() {
        this.network = new StacksDevnet({
            url: 'http://devnet:devnet@localhost:18443' //`https://api.platform.hiro.so/v1/ext/${process.env.API_KEY}/stacks-blockchain-api`,
        });
    }

    async createOrGetBaseWallet(secretKey: string, password: string) {
        const wallet: Wallet = await generateWallet({
            secretKey: secretKey,
            password: password,
        });

        return wallet;
    }

    async restoreWalletWithSeed(secretKey: string, password: string = '') {
        const baseWallet = await this.createOrGetBaseWallet(secretKey, password);
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
}

export default StxWalletService;
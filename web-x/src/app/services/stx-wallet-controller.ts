// import { StxWalletService } from './StxWalletService';
import { Wallet, Account } from '@stacks/wallet-sdk';
import { stxWalletDbService, StxWalletService } from './stx-wallet-service';
import { TransactionVersion } from '@stacks/transactions';

export class MainWalletApp {
    private walletService: StxWalletService;

    constructor() {
        this.walletService = new StxWalletService();
    }

    async getWallet(password: string, mnemonic: string) {
        try {
            const wallet = await this.walletService.createWallet(password, mnemonic);
            return wallet;
        } catch (error) {
            console.error("Error creating wallet:", error);
        }
    }

    async addAccountToWallet(wallet: Wallet) {
        try {
            const updatedWallet = await StxWalletService.addAccountsToWallet(wallet);
            return updatedWallet;
        } catch (error) {
            console.error("Error adding account to wallet:", error);
        }
    }

    async getWalletAccountDetails(account: Account, transactionVersion: TransactionVersion) {
        try {
            const details = await this.walletService.getAccountDetails(account, transactionVersion);
            return details;
        } catch (error) {
            console.error("Error fetching account details:", error);
        }
    }

    async getWalletBalance(address: string) {
        try {
            const balance = await this.walletService.getBalance(address);
            return balance;
        } catch (error) {
            console.error("Error fetching wallet balance:", error);
        }
    }

    async getOnChainAccountBalance(address: string) {
        try {
            const balance = await this.walletService.getBalance(address);
            return balance;
        } catch (error) {
            console.error("Error fetching on-chain account balance:", error);
        }
    }

    async sendStx(senderAddress: string, privKey: string, recipientAddress: string, amount: number, memo: string) {
        try {
            const transactionResult = await this.walletService.sendStx({
                senderAddress,
                privKey,
                recipientAddress,
                amount,
                memo,
            });
            return transactionResult;
        } catch (error) {
            console.error("Error sending STX:", error);
        }
    }
}


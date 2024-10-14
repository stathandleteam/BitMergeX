import { AllowedKeyEntropyBits, generateSecretKey } from '@stacks/wallet-sdk';
import { getNonce, PostCondition, createSTXPostCondition, FungibleConditionCode } from "@stacks/transactions";
import { StacksNetwork } from '@stacks/network';

/**
 * Generates a BIP39 mnemonic for the given entropy.
 * If no entropy is specified, default is 128 bits.
 * @param entropy - number of bits of entropy
 * @returns BIP39 mnemonic
 */
export const generateMnemonic = (entropy: AllowedKeyEntropyBits | undefined = 128)=>{
    const secretKey = generateSecretKey(entropy);
    return secretKey
}

/**
 * Utility function to get nonce for a given address
 * @param address - Stacks address
 * @param network - Stacks network (Devnet/Testnet)
 */
export async function getNonceFromAddress(address: string, network: "mainnet" | "testnet" | "devnet" | "mocknet" | StacksNetwork | undefined ): Promise<bigint> {
    try {
        const nonce = await getNonce(address, network);
        return nonce;
    } catch (error) {
        console.error(`Error fetching nonce for address ${address}:`, error);
        throw new Error('Failed to fetch nonce');
    }
}

/**
 * Utility function to create a post condition
 * @param address - Sender's address
 * @param amount - Amount to send (in microstacks)
 */
export function createPostCondition(address: string, amount: number): PostCondition {
    return createSTXPostCondition(
        address,
        FungibleConditionCode.Equal,
        BigInt(amount) // Amount in microstacks
    );
}

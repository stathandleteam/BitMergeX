import { secureIndexedDBStorage } from "../helpers/SecureIndexDb";

export class StxAccountManager {
    private static STX_ACCOUNT_INDEX_ID = 'stx_account_index';

    // Store or update the STX account index
    static async storeStxAccountIndex(index: number) {
        if (index < 0) {
            throw new Error('Index cannot be negative');
        }
        
        await secureIndexedDBStorage.storeData(this.STX_ACCOUNT_INDEX_ID, {
            encrypted: index.toString(), // Store as string to avoid potential floating-point issues with JSON
            iv: '',
            authTag: '',
            salt: ''
        });
        return true;
    }

    // Retrieve the STX account index
    static async retrieveStxAccountIndex(): Promise<number> {
        try {
            const indexData = await secureIndexedDBStorage.retrieveData(this.STX_ACCOUNT_INDEX_ID);
            const index = parseInt(indexData.encrypted, 10); // Convert back to number
            return isNaN(index) ? 0 : index; // Default to 0 if no valid number stored
        } catch (error) {
            console.error('Failed to retrieve STX account index:', error);
            return 0; // Default back to 0 on error
        }
    }

    // Remove the STX account index or reset to 0 if it's not already at 0
    static async removeStxAccountIndex() {
        try {
            const currentIndex = await this.retrieveStxAccountIndex();
            if (currentIndex > 0) {
                await this.storeStxAccountIndex(0); // Reset to 0 if not already 0
            }
        } catch (error) {
            console.error('Failed to remove STX account index:', error);
        }
    }
}

export const stxAccountManager = new StxAccountManager();
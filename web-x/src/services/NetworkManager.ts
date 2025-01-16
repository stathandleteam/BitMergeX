// import { secureIndexedDBStorage } from './path/to/SecureIndexedDBStorage'; // Adjust path as necessary

import { secureIndexedDBStorage } from "@/app/helpers/SecureIndexDb";
import { NetworkType } from "@/pages/loggedin/settings/settingpages/NetworkSettingsPage/NetworkSettingsPage";

class NetworkManager {
    private static NETWORK_TYPE_ID = 'network_type';

    // Store the network type
    static async storeNetworkType(networkType: NetworkType) {
        // EncryptedData for NetworkType would just contain the type as the 'encrypted' field 
        // since we don't need IV, authTag, or salt for this simple string data
        await secureIndexedDBStorage.storeData(this.NETWORK_TYPE_ID, {
            encrypted: networkType,
            iv: '',  // Not used for this case
            authTag: '', // Not used for this case
            salt: '' // Not used for this case
        });
    }

    // Retrieve the network type
    static async retrieveNetworkType(): Promise<NetworkType | null> {
        try {
            const networkData = await secureIndexedDBStorage.retrieveData(this.NETWORK_TYPE_ID);
            return networkData.encrypted as NetworkType;
        } catch (error) {
            console.error('Failed to retrieve network type:', error);
            return null;
        }
    }

    // Update the network type
    static async updateNetworkType(networkType: NetworkType) {
        await this.storeNetworkType(networkType); // Updating is just storing anew
    }

    // Check if a network type exists
    static async networkTypeExists(): Promise<boolean> {
        try {
            const networkType = await this.retrieveNetworkType();
            return networkType !== null;
        } catch (error) {
            return false;
        }
    }
}

export default NetworkManager;
interface EncryptedData {
    encrypted: string;   // The encrypted data
    iv: string;          // Initialization Vector
    authTag: string;     // Authentication tag for encryption
    salt: string;        // Salt used in key derivation
}

class SecureIndexedDBStorage {
    private dbName: string = 'SecureStorage';
    private dbVersion: number = 1;

    // Create a secure IndexedDB connection
    private async openIndexedDB(): Promise<IDBDatabase> {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.dbVersion);

            request.onupgradeneeded = (event) => {
                const db = request.result;
                if (!db.objectStoreNames.contains('data')) {
                    // 'data' can store various items, not just seeds
                    db.createObjectStore('data', { keyPath: 'id' });
                }
            };

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(new Error('Failed to open IndexedDB'));
        });
    }

    // Additional encryption layer
    private additionalEncryption(data: any): string {
        const encoder = new TextEncoder();
        const dataBuffer = encoder.encode(JSON.stringify(data));

        return window.btoa(
            String.fromCharCode.apply(null, 
                Array.from(new Uint8Array(dataBuffer)).map(b => b ^ 0x55)
            )
        );
    }

    // Decrypt stored data with additional security
    private decryptStoredData(encryptedData: string): any {
        try {
            const decoded = window.atob(encryptedData);
            const dataBuffer = new Uint8Array(
                decoded.split('').map(char => char.charCodeAt(0) ^ 0x55)
            );
            
            const decoder = new TextDecoder();
            return JSON.parse(decoder.decode(dataBuffer));
        } catch (error) {
            console.error('Decryption failed', error);
            throw new Error('Failed to decrypt stored data');
        }
    }

    // Store encrypted data in IndexedDB
    async storeData(id: string, encryptedData: EncryptedData): Promise<void> {
        const db = await this.openIndexedDB();

        return new Promise((resolve, reject) => {
            const transaction = db.transaction(['data'], 'readwrite');
            const store = transaction.objectStore('data');

            const request = store.put({
                id: id,
                data: encryptedData,
                timestamp: Date.now()
            });

            request.onsuccess = () => resolve();
            request.onerror = () => reject(new Error('Failed to store data'));
        });
    }

    // Retrieve encrypted data from IndexedDB
    async retrieveData(id: string): Promise<EncryptedData> {
        const db = await this.openIndexedDB();

        return new Promise((resolve, reject) => {
            const transaction = db.transaction(['data'], 'readonly');
            const store = transaction.objectStore('data');
            const request = store.get(id);

            request.onsuccess = () => {
                if (request.result) {
                    try {
                        resolve(request.result.data);
                    } catch (error) {
                        reject(new Error('Failed to decrypt stored data'));
                    }
                } else {
                    reject(new Error('No data found for the given ID'));
                }
            };

            request.onerror = () => reject(new Error('Failed to retrieve data'));
        });
    }

    // Clear stored data
    async clearData(id: string): Promise<void> {
        const db = await this.openIndexedDB();

        return new Promise((resolve, reject) => {
            const transaction = db.transaction(['data'], 'readwrite');
            const store = transaction.objectStore('data');
            const request = store.delete(id);

            request.onsuccess = () => resolve();
            request.onerror = () => reject(new Error('Failed to clear data'));
        });
    }
}

export const secureIndexedDBStorage = new SecureIndexedDBStorage();
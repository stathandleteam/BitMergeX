// Define the structure of an encrypted seed
interface EncryptedSeed {
    encrypted: string;   // The encrypted seed data
    iv: string;          // Initialization Vector
    authTag: string;     // Authentication tag for encryption
    salt: string;        // Salt used in key derivation
}

// Comprehensive IndexedDB Secure Storage Implementation
class SecureIndexedDBStorage {
    private dbName: string = 'WalletSecureStorage';
    private dbVersion: number = 1;

    // Create a secure IndexedDB connection
    private async openIndexedDB(): Promise<IDBDatabase> {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.dbVersion);

            request.onupgradeneeded = (event) => {
                const db = request.result;
                if (!db.objectStoreNames.contains('seeds')) {
                    db.createObjectStore('seeds', { keyPath: 'id' });
                }
            };

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(new Error('Failed to open IndexedDB'));
        });
    }

    // Additional encryption layer
    private additionalEncryption(data: any): string {
        // Use Web Crypto API for an additional encryption layer
        const encoder = new TextEncoder();
        const dataBuffer = encoder.encode(JSON.stringify(data));

        // Example of additional encryption (this is a simplified version)
        return window.btoa(
            String.fromCharCode.apply(null, 
                Array.from(new Uint8Array(dataBuffer)).map(b => b ^ 0x55)
            )
        );
    }

    // Decrypt stored seed with additional security
    private decryptStoredSeed(encryptedSeed: string): any {

        console.log("encryptedSeed", encryptedSeed);
        const enc = JSON.stringify(encryptedSeed)
        try {
            // Reverse the additional encryption
            const decoded = window.atob(enc);
            const dataBuffer = new Uint8Array(
                decoded.split('').map(char => char.charCodeAt(0) ^ 0x55)
            );
            
            const decoder = new TextDecoder();
            return JSON.parse(decoder.decode(dataBuffer));
        } catch (error) {
            console.error('Decryption failed', error);
            throw new Error('Failed to decrypt stored seed');
        }
    }

    // Store encrypted seed in IndexedDB
    async storeSeed(encryptedSeed: EncryptedSeed): Promise<void> {
        const db = await this.openIndexedDB();

        return new Promise((resolve, reject) => {
            const transaction = db.transaction(['seeds'], 'readwrite');
            const store = transaction.objectStore('seeds');

            // Additional encryption layer
            // const doubleEncryptedSeed = this.additionalEncryption(encryptedSeed);

            const request = store.put({
                id: 'primary_seed',
                seed: encryptedSeed,
                timestamp: Date.now()
            });

            request.onsuccess = () => resolve();
            request.onerror = () => reject(new Error('Failed to store seed'));
        });
    }

    // Retrieve encrypted seed from IndexedDB
    async retrieveSeed(): Promise<string> {
        const db = await this.openIndexedDB();

        return new Promise((resolve, reject) => {
            const transaction = db.transaction(['seeds'], 'readonly');
            const store = transaction.objectStore('seeds');
            const request = store.get('primary_seed');

            request.onsuccess = () => {
                if (request.result) {
                    try {
                        // const decryptedSeed = this.decryptStoredSeed(request.result.seed);
                        resolve(request.result.seed.encrypted);
                    } catch (error) {
                        reject(new Error('Failed to decrypt stored seed'));
                    }
                } else {
                    reject(new Error('No seed found'));
                }
            };

            request.onerror = () => reject(new Error('Failed to retrieve seed'));
        });
    }

    // Optional: Clear stored seed
    async clearSeed(): Promise<void> {
        const db = await this.openIndexedDB();

        return new Promise((resolve, reject) => {
            const transaction = db.transaction(['seeds'], 'readwrite');
            const store = transaction.objectStore('seeds');
            const request = store.delete('primary_seed');

            request.onsuccess = () => resolve();
            request.onerror = () => reject(new Error('Failed to clear seed'));
        });
    }
}

export const secureIndexedDBStorage =  new SecureIndexedDBStorage()
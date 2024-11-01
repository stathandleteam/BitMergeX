// encryption.ts - Browser-compatible encryption helpers
export const encryptSeed = async (seed: string, password: string): Promise<string> => {
    try {
      // Use window.crypto for browser environments
      const cryptoObj = window.crypto;
      
      // Convert password to key material
      const encoder = new TextEncoder();
      const passwordData = encoder.encode(password);
      const salt = cryptoObj.getRandomValues(new Uint8Array(16));
  
      // Derive key using PBKDF2
      const keyMaterial = await cryptoObj.subtle.importKey(
        'raw',
        passwordData,
        { name: 'PBKDF2' },
        false,
        ['deriveBits', 'deriveKey']
      );
  
      const key = await cryptoObj.subtle.deriveKey(
        {
          name: 'PBKDF2',
          salt,
          iterations: 100000,
          hash: 'SHA-256'
        },
        keyMaterial,
        { name: 'AES-GCM', length: 256 },
        false,
        ['encrypt']
      );
  
      // Encrypt
      const iv = cryptoObj.getRandomValues(new Uint8Array(12));
      const seedData = encoder.encode(seed);
      
      const encrypted = await cryptoObj.subtle.encrypt(
        {
          name: 'AES-GCM',
          iv
        },
        key,
        seedData
      );
  
      // Combine salt, iv, and encrypted data
      const encryptedArray = new Uint8Array(encrypted);
      const combined = new Uint8Array(salt.length + iv.length + encryptedArray.length);
      combined.set(salt);
      combined.set(iv, salt.length);
      combined.set(encryptedArray, salt.length + iv.length);
  
      // Convert to base64
      return btoa(String.fromCharCode.apply(null, Array.from(combined)));
    } catch (error) {
      console.error('Encryption error:', error);
      throw new Error('Failed to encrypt seed');
    }
  };
  
  export const decryptSeed = async (encryptedData: string, password: string): Promise<string> => {
    try {
      const cryptoObj = window.crypto;
      
      // Decode base64
      const combined = new Uint8Array(
        atob(encryptedData).split('').map(char => char.charCodeAt(0))
      );
  
      // Extract salt, iv, and encrypted data
      const salt = combined.slice(0, 16);
      const iv = combined.slice(16, 28);
      const encrypted = combined.slice(28);
  
      // Derive key
      const encoder = new TextEncoder();
      const passwordData = encoder.encode(password);
      
      const keyMaterial = await cryptoObj.subtle.importKey(
        'raw',
        passwordData,
        { name: 'PBKDF2' },
        false,
        ['deriveBits', 'deriveKey']
      );
  
      const key = await cryptoObj.subtle.deriveKey(
        {
          name: 'PBKDF2',
          salt,
          iterations: 100000,
          hash: 'SHA-256'
        },
        keyMaterial,
        { name: 'AES-GCM', length: 256 },
        false,
        ['decrypt']
      );
  
      // Decrypt
      const decrypted = await cryptoObj.subtle.decrypt(
        {
          name: 'AES-GCM',
          iv
        },
        key,
        encrypted
      );
  
      return new TextDecoder().decode(decrypted);
    } catch (error) {
      console.error('Decryption error:', error);
      throw new Error('Failed to decrypt seed');
    }
  };
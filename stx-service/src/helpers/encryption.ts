import crypto, { createCipheriv, randomFill, scrypt } from 'crypto';



export const encryptSeed = async (seed: string, password: string): Promise<string> => {
  // // Defining algorithm
  const algorithm = 'aes-192-cbc';
  
    // First, we'll generate the key. The key length is dependent on the algorithm.
    // In this case for aes192, it is 24 bytes (192 bits).
    return new Promise<string>((resolve, reject) => {
      scrypt(password, 'salt', 24, (err: any, key: Buffer) => {
        if (err) {
          reject(err);
          return;
        }
  
        // Then, we'll generate a random initialization vector (IV)
        randomFill(new Uint8Array(16), (err, iv) => {
          if (err) {
            reject(err);
            return;
          }
  
          const cipher = createCipheriv(algorithm, key, iv);
          let encrypted = cipher.update(seed, 'utf8', 'hex');
          encrypted += cipher.final('hex');
  
          console.log(encrypted);
          resolve(encrypted);  // Explicitly resolving a string (encrypted data)
        });
      });
    });
  };

export const decryptSeed = async (encryptedSeed: string, password: string) => {
    const algorithm = 'aes-192-cbc';
    // First, we'll generate the key. The key length is dependent on the algorithm.
    // In this case for aes192, it is 24 bytes (192 bits).
    return new Promise<string>((resolve, reject) => {
        scrypt(password, 'salt', 24, (err: any, key: any) => {
            if (err) {
                reject(err); 
                return;
            };
            // Then, we'll generate a random initialization vector
            randomFill(new Uint8Array(16), (err, iv) => {
                if (err) {
                    reject(err); 
                    return;
                };
        
                // Create a Decipher object using the AES-256-CBC algorithm
                    const decipher = crypto.createDecipheriv(algorithm, key, iv);

                    // Decrypt the data
                    let decrypted = decipher.update(encryptedSeed, 'base64', 'utf8');
                    decrypted += decipher.final('utf8');

                    // console.log(decrypted); // Output: "decryptedData"

                    resolve(decrypted);
            });
        });
            
})

};

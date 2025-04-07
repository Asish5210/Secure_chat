import CryptoJS from 'crypto-js';

// Error class for cryptographic operations
class CryptoError extends Error {
  constructor(message, originalError) {
    super(message);
    this.name = 'CryptoError';
    this.originalError = originalError;
  }
}

// Validate crypto.subtle is available
const validateWebCrypto = () => {
  if (!window.crypto || !window.crypto.subtle) {
    throw new CryptoError('Web Crypto API is not available in this environment');
  }
};

// RSA Key Generation
export const generateRSAKeys = async () => {
  try {
    validateWebCrypto();
    
    const keyPair = await window.crypto.subtle.generateKey(
      {
        name: "RSA-OAEP",
        modulusLength: 4096, // Increased from 2048 for better security
        publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
        hash: { name: "SHA-512" }, // Stronger hash
      },
      true,
      ["encrypt", "decrypt"]
    );

    const [publicKey, privateKey] = await Promise.all([
      window.crypto.subtle.exportKey("jwk", keyPair.publicKey),
      window.crypto.subtle.exportKey("jwk", keyPair.privateKey)
    ]);

    return {
      publicKey: JSON.stringify(publicKey),
      privateKey: JSON.stringify(privateKey),
      keyId: CryptoJS.SHA256(JSON.stringify(publicKey)).toString() // Add key fingerprint
    };
  } catch (error) {
    throw new CryptoError('Failed to generate RSA keys', error);
  }
};

// AES Encryption (with IV and salt)
export const encryptWithAES = (plaintext, key) => {
  try {
    if (!plaintext || !key) {
      throw new Error('Missing required parameters');
    }

    const salt = CryptoJS.lib.WordArray.random(128/8);
    const iv = CryptoJS.lib.WordArray.random(128/8);
    
    const keyObj = CryptoJS.PBKDF2(key, salt, {
      keySize: 256/32,
      iterations: 10000
    });

    const encrypted = CryptoJS.AES.encrypt(plaintext, keyObj, { 
      iv: iv,
      padding: CryptoJS.pad.Pkcs7,
      mode: CryptoJS.mode.CBC
    });

    return {
      ciphertext: encrypted.toString(),
      iv: iv.toString(CryptoJS.enc.Hex),
      salt: salt.toString(CryptoJS.enc.Hex)
    };
  } catch (error) {
    throw new CryptoError('AES encryption failed', error);
  }
};

// AES Decryption
export const decryptWithAES = (encryptedData, key) => {
  try {
    if (!encryptedData?.ciphertext || !key) {
      throw new Error('Invalid encrypted data or key');
    }

    const salt = CryptoJS.enc.Hex.parse(encryptedData.salt);
    const iv = CryptoJS.enc.Hex.parse(encryptedData.iv);

    const keyObj = CryptoJS.PBKDF2(key, salt, {
      keySize: 256/32,
      iterations: 10000
    });

    const decrypted = CryptoJS.AES.decrypt(
      encryptedData.ciphertext, 
      keyObj, 
      { 
        iv: iv,
        padding: CryptoJS.pad.Pkcs7,
        mode: CryptoJS.mode.CBC
      }
    );

    const result = decrypted.toString(CryptoJS.enc.Utf8);
    if (!result) {
      throw new Error('Decryption failed - possibly wrong key');
    }

    return result;
  } catch (error) {
    throw new CryptoError('AES decryption failed', error);
  }
};

// RSA Encryption
export const encryptWithRSA = async (plaintext, publicKey) => {
  try {
    validateWebCrypto();
    
    if (!plaintext || !publicKey) {
      throw new Error('Missing required parameters');
    }

    const key = await window.crypto.subtle.importKey(
      "jwk",
      JSON.parse(publicKey),
      {
        name: "RSA-OAEP",
        hash: { name: "SHA-512" },
      },
      false, // Not extractable
      ["encrypt"]
    );

    // Chunk data for large payloads (RSA has size limits)
    const chunkSize = 190; // Bytes for 2048-bit key
    const encoder = new TextEncoder();
    const data = encoder.encode(plaintext);
    
    let encryptedChunks = [];
    for (let i = 0; i < data.length; i += chunkSize) {
      const chunk = data.slice(i, i + chunkSize);
      const encrypted = await window.crypto.subtle.encrypt(
        { name: "RSA-OAEP" },
        key,
        chunk
      );
      encryptedChunks.push(arrayBufferToBase64(encrypted));
    }

    return encryptedChunks;
  } catch (error) {
    throw new CryptoError('RSA encryption failed', error);
  }
};

// RSA Decryption
export const decryptWithRSA = async (encryptedChunks, privateKey) => {
  try {
    validateWebCrypto();
    
    if (!encryptedChunks?.length || !privateKey) {
      throw new Error('Invalid encrypted data or key');
    }

    const key = await window.crypto.subtle.importKey(
      "jwk",
      JSON.parse(privateKey),
      {
        name: "RSA-OAEP",
        hash: { name: "SHA-512" },
      },
      false, // Not extractable
      ["decrypt"]
    );

    let decryptedChunks = [];
    for (const chunk of encryptedChunks) {
      const decrypted = await window.crypto.subtle.decrypt(
        { name: "RSA-OAEP" },
        key,
        base64ToArrayBuffer(chunk)
      );
      decryptedChunks.push(new TextDecoder().decode(decrypted));
    }

    return decryptedChunks.join('');
  } catch (error) {
    throw new CryptoError('RSA decryption failed', error);
  }
};

// AES Key Generation (with configurable strength)
export const generateAESKey = (size = 256) => {
  try {
    const validSizes = [128, 192, 256];
    if (!validSizes.includes(size)) {
      throw new Error(`Invalid key size. Must be one of: ${validSizes.join(', ')}`);
    }
    
    return {
      key: CryptoJS.lib.WordArray.random(size/8).toString(CryptoJS.enc.Hex),
      keySize: size
    };
  } catch (error) {
    throw new CryptoError('AES key generation failed', error);
  }
};

// Helper functions with validation
const arrayBufferToBase64 = (buffer) => {
  try {
    if (!buffer || !(buffer instanceof ArrayBuffer)) {
      throw new Error('Invalid ArrayBuffer');
    }
    
    let binary = '';
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  } catch (error) {
    throw new CryptoError('ArrayBuffer to Base64 conversion failed', error);
  }
};

const base64ToArrayBuffer = (base64) => {
  try {
    if (!base64 || typeof base64 !== 'string') {
      throw new Error('Invalid Base64 string');
    }
    
    const binaryString = window.atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  } catch (error) {
    throw new CryptoError('Base64 to ArrayBuffer conversion failed', error);
  }
};

// Export all functions
export default {
  generateRSAKeys,
  encryptWithAES,
  decryptWithAES,
  encryptWithRSA,
  decryptWithRSA,
  generateAESKey,
  CryptoError // Export error class for handling
};
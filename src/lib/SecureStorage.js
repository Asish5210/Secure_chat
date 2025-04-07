import { encryptWithAES, decryptWithAES } from './crypto';

const SESSION_KEYS = {
  USER: 'secure_user_session',
  USER_IV: 'secure_user_iv',
  OTP: 'secure_otp_storage',
  CREDENTIAL: 'secure_biometric_credential',
  CREDENTIAL_IV: 'secure_biometric_iv'
};

// Use consistent key from env (should be 32-byte base64 or hex)
const STORAGE_KEY = process.env.REACT_APP_STORAGE_KEY || 'default_storage_key_32bytes_long_123456'; // Fallback for development
const OTP_SECRET = process.env.REACT_APP_OTP_SECRET || 'default_otp_secret_32bytes_long_abcdef'; // Fallback for development

export const secureStorage = {
  // ---------- User Session ----------
  setUser: async (data) => {
    try {
      const encrypted = await encryptWithAES(
        JSON.stringify(data),
        STORAGE_KEY
      );
      sessionStorage.setItem(SESSION_KEYS.USER, encrypted.ciphertext);
      sessionStorage.setItem(SESSION_KEYS.USER_IV, encrypted.iv);
      return true;
    } catch (error) {
      console.error('Failed to set user:', error);
      return false;
    }
  },

  getUser: async () => {
    try {
      const ciphertext = sessionStorage.getItem(SESSION_KEYS.USER);
      const iv = sessionStorage.getItem(SESSION_KEYS.USER_IV);
      if (!ciphertext || !iv) return null;

      const decrypted = await decryptWithAES({ ciphertext, iv }, STORAGE_KEY);
      return JSON.parse(decrypted);
    } catch (error) {
      console.error('Failed to get user:', error);
      secureStorage.clearUser();
      return null;
    }
  },

  clearUser: () => {
    sessionStorage.removeItem(SESSION_KEYS.USER);
    sessionStorage.removeItem(SESSION_KEYS.USER_IV);
  },

  // ---------- OTP Storage ----------
  setOTP: async (data) => {
    try {
      const encrypted = await encryptWithAES(
        JSON.stringify(data),
        OTP_SECRET
      );
      sessionStorage.setItem(SESSION_KEYS.OTP, encrypted.ciphertext);
      sessionStorage.setItem(SESSION_KEYS.USER_IV, encrypted.iv); // Using USER_IV for OTP as well
      return true;
    } catch (error) {
      console.error('Failed to set OTP:', error);
      return false;
    }
  },

  getOTP: async () => {
    try {
      const ciphertext = sessionStorage.getItem(SESSION_KEYS.OTP);
      const iv = sessionStorage.getItem(SESSION_KEYS.USER_IV); // Matching the IV used in setOTP
      if (!ciphertext || !iv) return null;

      const decrypted = await decryptWithAES({ ciphertext, iv }, OTP_SECRET);
      return JSON.parse(decrypted);
    } catch (error) {
      console.error('Failed to get OTP:', error);
      return null;
    }
  },

  // ---------- Biometric Credential Storage ----------
  storeCredential: async (credential) => {
    try {
      const encrypted = await encryptWithAES(
        JSON.stringify(credential),
        STORAGE_KEY
      );
      sessionStorage.setItem(SESSION_KEYS.CREDENTIAL, encrypted.ciphertext);
      sessionStorage.setItem(SESSION_KEYS.CREDENTIAL_IV, encrypted.iv);
      return true;
    } catch (error) {
      console.error('Failed to store credential:', error);
      return false;
    }
  },

  getCredential: async () => {
    try {
      const ciphertext = sessionStorage.getItem(SESSION_KEYS.CREDENTIAL);
      const iv = sessionStorage.getItem(SESSION_KEYS.CREDENTIAL_IV);
      if (!ciphertext || !iv) return null;

      const decrypted = await decryptWithAES({ ciphertext, iv }, STORAGE_KEY);
      return JSON.parse(decrypted);
    } catch (error) {
      console.error('Failed to get credential:', error);
      secureStorage.clearCredential();
      return null;
    }
  },

  clearCredential: () => {
    sessionStorage.removeItem(SESSION_KEYS.CREDENTIAL);
    sessionStorage.removeItem(SESSION_KEYS.CREDENTIAL_IV);
  },

  // ---------- Clear All Storage ----------
  clearAll: () => {
    Object.values(SESSION_KEYS).forEach(key => {
      sessionStorage.removeItem(key);
    });
  }
};
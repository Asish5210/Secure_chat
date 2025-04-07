import { encryptWithRSA } from '../lib/crypto';
import secureStorage from '../lib/SecureStorage';

const API_BASE = process.env.REACT_APP_API_URL;

export const api = {
  // Authentication
  login: async (email, password) => {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return handleResponse(response);
  },

  // DID Verification
  verifyDID: async (did, signature) => {
    const response = await fetch(`${API_BASE}/auth/verify-did`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ did, signature })
    });
    return handleResponse(response);
  },

  // Message Encryption
  getRecipientPublicKey: async (userId) => {
    const response = await fetch(`${API_BASE}/users/${userId}/public-key`);
    const data = await handleResponse(response);
    return data.publicKey;
  },

  // Helper Function
  handleResponse: async (response) => {
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'API request failed');
    }
    return response.json();
  }
};

// Encrypt all outgoing data automatically
const originalFetch = window.fetch;
window.fetch = async (url, options = {}) => {
  if (options.body && shouldEncrypt(url)) {
    const publicKey = await secureStorage.getUserPublicKey();
    options.body = await encryptWithRSA(options.body, publicKey);
  }
  return originalFetch(url, options);
};

function shouldEncrypt(url) {
  return !url.includes('/public-key') && !url.includes('/auth');
}
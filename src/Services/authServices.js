import { 
  generateRSAKeys, 
  encryptWithAES,
  decryptWithAES 
} from '../lib/crypto';
import { generateDID } from '../lib/did';
import secureStorage from '../lib/SecureStorage';

// Mock user database (replace with real API calls in production)
const mockUsers = [];

export const authService = {
  // 1. DID Registration
  registerWithDID: async () => {
    const did = await generateDID();
    const { publicKey, privateKey } = generateRSAKeys();
    
    const user = {
      did,
      publicKey,
      privateKey: (await encryptWithAES(privateKey, did)).ciphertext,
      createdAt: new Date().toISOString()
    };

    mockUsers.push(user);
    return user;
  },

  // 2. Password Login (Mock)
  loginWithPassword: async (email, password) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }

    const existingUser = mockUsers.find(u => u.email === email);
    if (existingUser) return existingUser;

    const newUser = {
      email,
      name: email.split('@')[0],
      authType: 'password',
      createdAt: new Date().toISOString()
    };

    mockUsers.push(newUser);
    return newUser;
  },

  // 3. Biometric Login
  loginWithBiometric: async () => {
    const did = await generateDID();
    return authService.registerWithDID(did);
  },

  // 4. Session Management
  loadSession: async () => {
    return secureStorage.getUser();
  },

  saveSession: async (userData) => {
    await secureStorage.setUser(userData);
  },

  clearSession: () => {
    secureStorage.clearUser();
  },

  // 5. Key Exchange (For Chat)
  getPublicKey: async (did) => {
    const user = mockUsers.find(u => u.did === did);
    return user?.publicKey || null;
  }
};

// Helper for DID verification (mock)
export const verifyDID = async (did, signature) => {
  return new Promise(resolve => 
    setTimeout(() => resolve({ valid: true }), 300)
  );
};
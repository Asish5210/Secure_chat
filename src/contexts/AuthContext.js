import { createContext, useState, useEffect, useCallback, useContext } from 'react';
import { 
  generateRSAKeys, 
  encryptWithAES, 
  decryptWithAES 
} from '../lib/crypto';
import { generateDID } from '../lib/did';
import { authenticateBiometric, isBiometricSupported } from '../lib/Biometric';
import { secureStorage } from '../lib/SecureStorage';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authMode, setAuthMode] = useState('password');
  const [error, setError] = useState(null);
  const [biometricAvailable, setBiometricAvailable] = useState(false);

  // Check biometric support on mount
  useEffect(() => {
    setBiometricAvailable(isBiometricSupported());
  }, []);

  const initializeSession = useCallback(async () => {
    try {
      const session = await secureStorage.getItem('user');
      if (session) {
        const parsedSession = JSON.parse(session);
        setUser(parsedSession);
        
        // Set auth mode based on last used method
        if (parsedSession.authType) {
          setAuthMode(parsedSession.authType === 'did' ? 'did' : 'password');
        }
      }
    } catch (error) {
      console.error('Session initialization failed:', error);
      setError('Failed to initialize session');
    } finally {
      setLoading(false);
    }
  }, []);

  const didLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const { did, key } = await generateDID();
      const { publicKey, privateKey } = await generateRSAKeys();
      
      const encryptedPrivateKey = await encryptWithAES(
        JSON.stringify(privateKey), 
        key
      );
      
      const userData = {
        did,
        didKey: key,
        publicKey,
        privateKey: encryptedPrivateKey.ciphertext,
        iv: encryptedPrivateKey.iv,
        salt: encryptedPrivateKey.salt,
        authType: 'did',
        loggedInAt: new Date().toISOString()
      };

      await secureStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      return userData;
    } catch (error) {
      console.error('DID login failed:', error);
      setError(error.message || 'DID authentication failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const passwordLogin = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      // Replace with actual API call in production
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Invalid credentials');
      }

      const userData = await response.json();
      const completeUserData = {
        ...userData,
        authType: 'password',
        loggedInAt: new Date().toISOString()
      };

      await secureStorage.setItem('user', JSON.stringify(completeUserData));
      setUser(completeUserData);
      return completeUserData;
    } catch (error) {
      console.error('Password login failed:', error);
      setError(error.message || 'Login failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email, password, name) => {
    setLoading(true);
    setError(null);
    try {
      // Replace with actual API call in production
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, name }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Signup failed');
      }

      const userData = await response.json();
      const completeUserData = {
        ...userData,
        authType: 'password',
        loggedInAt: new Date().toISOString()
      };

      await secureStorage.setItem('user', JSON.stringify(completeUserData));
      setUser(completeUserData);
      return completeUserData;
    } catch (error) {
      console.error('Signup failed:', error);
      setError(error.message || 'Signup failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const biometricLogin = async () => {
    if (!biometricAvailable) {
      throw new Error('Biometrics not available on this device');
    }

    setLoading(true);
    setError(null);
    try {
      const credential = await authenticateBiometric();
      if (!credential) {
        throw new Error('Biometric authentication failed');
      }

      // Use credential ID in DID generation
      const { did, key } = await generateDID(credential.id);
      const userData = await didLogin();
      
      // Add biometric-specific data
      const updatedUserData = {
        ...userData,
        authType: 'biometric',
        biometricId: credential.id
      };

      await secureStorage.setItem('user', JSON.stringify(updatedUserData));
      setUser(updatedUserData);
      return updatedUserData;
    } catch (error) {
      console.error('Biometric login failed:', error);
      setError(error.message || 'Biometric authentication failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await secureStorage.removeItem('user');
      setUser(null);
      setError(null);
    } catch (error) {
      console.error('Logout failed:', error);
      setError('Failed to logout');
      throw error;
    }
  };

  const getPrivateKey = async () => {
    if (!user?.didKey || !user?.privateKey) return null;
    
    try {
      const decrypted = await decryptWithAES(
        {
          ciphertext: user.privateKey,
          iv: user.iv,
          salt: user.salt
        },
        user.didKey
      );
      return JSON.parse(decrypted);
    } catch (error) {
      console.error('Failed to decrypt private key:', error);
      throw new Error('Failed to decrypt private key');
    }
  };

  useEffect(() => {
    initializeSession();
  }, [initializeSession]);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        authMode,
        setAuthMode,
        didLogin,
        passwordLogin,
        signup,
        biometricLogin,
        biometricAvailable,
        logout,
        getPrivateKey
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const useAuthMode = () => {
  const { authMode, setAuthMode, biometricAvailable } = useAuth();
  return {
    authMode,
    setAuthMode,
    isDIDMode: authMode === 'did',
    isPasswordMode: authMode === 'password',
    isBiometricMode: authMode === 'biometric',
    biometricAvailable
  };
};
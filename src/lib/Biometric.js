import { generateDID } from './did';
import { secureStorage } from './SecureStorage'; // Changed from storeCredential to match your error

export const isBiometricSupported = () => {
  // More comprehensive feature detection
  return !!window.PublicKeyCredential && 
         !!window.crypto && 
         !!window.crypto.subtle &&
         typeof TextEncoder !== 'undefined';
};

export const registerBiometric = async (userHandle) => {
  try {
    if (!isBiometricSupported()) {
      throw new Error('WebAuthn/biometrics not supported in this browser');
    }

    if (!userHandle || typeof userHandle !== 'string') {
      throw new Error('Invalid user handle provided');
    }

    // Generate a DID first to use as a stable user identifier
    const did = await generateDID();
    
    const publicKeyOptions = {
      challenge: crypto.getRandomValues(new Uint8Array(32)),
      rp: { 
        name: "SecureChat",
        id: window.location.hostname // Using domain as RP ID
      },
      user: {
        id: new TextEncoder().encode(did.did), // Using DID as stable user ID
        name: userHandle,
        displayName: userHandle
      },
      pubKeyCredParams: [
        { type: "public-key", alg: -7 },  // ES256
        { type: "public-key", alg: -257 } // RS256
      ],
      authenticatorSelection: {
        userVerification: "preferred",
        requireResidentKey: true,
        authenticatorAttachment: "platform" // Prefer device biometrics
      },
      timeout: 60000, // 1 minute timeout
      attestation: "none" // Don't need attestation for most cases
    };

    const credential = await navigator.credentials.create({
      publicKey: publicKeyOptions
    });

    if (!credential) {
      throw new Error('Credential creation failed');
    }

    // Store the credential using your secure storage
    await secureStorage.setItem('webauthn_credential', JSON.stringify({
      id: credential.id,
      rawId: Array.from(new Uint8Array(credential.rawId)),
      type: credential.type,
      response: {
        clientDataJSON: Array.from(new Uint8Array(credential.response.clientDataJSON)),
        attestationObject: Array.from(new Uint8Array(credential.response.attestationObject))
      }
    }));

    return {
      credential,
      did: did.did // Return the DID for reference
    };
  } catch (error) {
    console.error('Biometric registration failed:', error);
    throw new Error(`Registration failed: ${error.message}`);
  }
};

export const authenticateBiometric = async () => {
  try {
    if (!isBiometricSupported()) {
      throw new Error('WebAuthn/biometrics not supported in this browser');
    }

    // Retrieve stored credential
    const storedCredential = await secureStorage.getItem('webauthn_credential');
    if (!storedCredential) {
      throw new Error('No registered credential found');
    }

    const publicKeyOptions = {
      challenge: crypto.getRandomValues(new Uint8Array(32)),
      allowCredentials: [{
        id: Uint8Array.from(JSON.parse(storedCredential).rawId),
        type: 'public-key',
        transports: ['internal'] // Prefer local authenticators
      }],
      userVerification: "required",
      timeout: 60000 // 1 minute timeout
    };

    const assertion = await navigator.credentials.get({
      publicKey: publicKeyOptions
    });

    if (!assertion) {
      throw new Error('Authentication failed');
    }

    // Here you would typically verify the assertion with your backend
    return {
      success: true,
      credentialId: assertion.id,
      authenticatorData: new Uint8Array(assertion.response.authenticatorData),
      clientDataJSON: new Uint8Array(assertion.response.clientDataJSON),
      signature: new Uint8Array(assertion.response.signature)
    };
  } catch (error) {
    console.error('Biometric authentication failed:', error);
    throw new Error(`Authentication failed: ${error.message}`);
  }
};

// Utility function to convert between array formats
function bufferToBase64(buffer) {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)));
}

function base64ToBuffer(base64) {
  return Uint8Array.from(atob(base64), c => c.charCodeAt(0));
}
import { encryptWithAES, decryptWithAES } from './crypto';

// Key Management
export const generateEphemeralKeys = async () => {
  const aesKey = generateAESKey();
  const { publicKey, privateKey } = generateRSAKeys();
  return {
    aesKey,
    publicKey,
    encryptedPrivateKey: await encryptWithAES(privateKey, aesKey)
  };
};

// Message Packaging
export const packageSecureMessage = async (content, recipientPublicKey) => {
  const ephemeral = await generateEphemeralKeys();
  const encryptedContent = await encryptWithAES(content, ephemeral.aesKey);
  const encryptedKey = await encryptWithRSA(ephemeral.aesKey, recipientPublicKey);

  return {
    version: '1.0',
    algorithm: 'RSA-AES-GCM',
    content: encryptedContent.ciphertext,
    iv: encryptedContent.iv,
    key: encryptedKey,
    timestamp: Date.now(),
    isEphemeral: true
  };
};

// Signature Verification
export const verifyMessageSignature = (message, publicKey) => {
  const verifier = new JSEncrypt();
  verifier.setPublicKey(publicKey);
  return verifier.verify(
    JSON.stringify(message.content),
    message.signature,
    CryptoJS.SHA256
  );
};
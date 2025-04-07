// did.js (TEMPORARY MOCK VERSION for prototype demo)

const mockDID = "did:example:123456789abcdefghi";
const mockKey = "mock-key";
const mockVerificationMethod = "did:example:123456789abcdefghi#key-1";

export const generateDID = async () => {
  return {
    did: mockDID,
    key: mockKey,
    verificationMethod: mockVerificationMethod
  };
};

export const createVerifiableCredential = async (
  issuerKey,
  credentialData,
  additionalContexts = []
) => {
  return {
    "@context": [
      "https://www.w3.org/2018/credentials/v1",
      ...additionalContexts
    ],
    type: ["VerifiableCredential"],
    issuer: mockDID,
    issuanceDate: new Date().toISOString(),
    credentialSubject: {
      id: credentialData.id || mockDID,
      ...credentialData
    },
    proof: {
      type: "Ed25519Signature2020",
      created: new Date().toISOString(),
      proofPurpose: "assertionMethod",
      verificationMethod: mockVerificationMethod,
      signature: "mock-signature"
    }
  };
};

export const verifyCredential = async (credential) => {
  return {
    isValid: true,
    details: "Mock verification passed"
  };
};

export const createDIDAuthToken = async (
  did,
  key,
  audience,
  expiresIn = 3600
) => {
  return "mock-jwt-token";
};

export default {
  generateDID,
  createVerifiableCredential,
  verifyCredential,
  createDIDAuthToken
};

  
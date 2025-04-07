import { encryptWithAES } from '../lib/crypto';

const OTP_EXPIRY_MINUTES = 5;
const OTP_STORAGE_KEY = 'secure_otp';

export const generateOTP = async (userId) => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = Date.now() + OTP_EXPIRY_MINUTES * 60000;

  const encrypted = await encryptWithAES(
    JSON.stringify({ otp, expiresAt }),
    process.env.REACT_APP_OTP_SECRET
  );

  // In production, send to user's verified email/phone
  console.log(`OTP for ${userId}: ${otp}`); 

  sessionStorage.setItem(OTP_STORAGE_KEY, encrypted.ciphertext);
  return { otp, expiresAt };
};

export const verifyOTP = async (inputOtp) => {
  const ciphertext = sessionStorage.getItem(OTP_STORAGE_KEY);
  if (!ciphertext) throw new Error('No OTP found');

  const decrypted = JSON.parse(
    await decryptWithAES(ciphertext, process.env.REACT_APP_OTP_SECRET)
  );

  if (Date.now() > decrypted.expiresAt) {
    sessionStorage.removeItem(OTP_STORAGE_KEY);
    throw new Error('OTP expired');
  }

  if (inputOtp !== decrypted.otp) {
    throw new Error('Invalid OTP');
  }

  sessionStorage.removeItem(OTP_STORAGE_KEY);
  return true;
};
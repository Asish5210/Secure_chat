import { encryptWithRSA } from '../lib/crypto';
import api from './api';

export const notifyHighSecurityEnabled = async (recipientId) => {
  const publicKey = await api.getRecipientPublicKey(recipientId);
  const message = {
    type: 'security-notification',
    content: 'High security mode activated',
    timestamp: Date.now()
  };

  const encrypted = await encryptWithRSA(
    JSON.stringify(message),
    publicKey
  );

  await api.sendNotification(recipientId, {
    type: 'encrypted',
    payload: encrypted
  });
};

export const sendEphemeralAlert = async (recipientId, message) => {
  const notification = await packageSecureMessage(
    message,
    await api.getRecipientPublicKey(recipientId)
  );
  return api.sendNotification(recipientId, notification);
};
import { FaFingerprint } from 'react-icons/fa';
import { motion } from 'framer-motion';

const BiometricButton = ({ onSuccess, onError }) => {
  const handleBiometricAuth = async () => {
    try {
      const credential = await navigator.credentials.get({
        publicKey: {
          challenge: new Uint8Array(32),
          rpId: window.location.hostname,
          userVerification: 'required'
        }
      });
      onSuccess(credential);
    } catch (error) {
      onError(error);
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleBiometricAuth}
      className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg"
    >
      <FaFingerprint />
      <span>Use Biometrics</span>
    </motion.button>
  );
};

export default BiometricButton;
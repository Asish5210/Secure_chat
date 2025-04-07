import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaLock, FaLockOpen, FaShieldAlt } from 'react-icons/fa';
import OTPInput from '../Auth/OTPInput';
import BiometricButton from '../Auth/BiometricButton';

const HighSecurityToggle = ({ isActive, onToggle }) => {
  const [showAuth, setShowAuth] = useState(false);
  const [otp, setOtp] = useState('');

  const handleOTPComplete = (code) => {
    setOtp(code);
  };

  const handleBiometricSuccess = () => {
    onToggle(true);
    setShowAuth(false);
  };

  return (
    <div className="mb-4">
      {!showAuth ? (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowAuth(true)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg ${isActive
            ? 'bg-blue-600 text-white'
            : 'bg-gray-200 text-gray-800'
            }`}
        >
          {isActive ? (
            <>
              <FaShieldAlt />
              <span>High Security Active</span>
            </>
          ) : (
            <>
              <FaLockOpen />
              <span>Enable High Security</span>
            </>
          )}
        </motion.button>
      ) : (
        <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium flex items-center gap-2">
            <FaShieldAlt className="text-blue-500" />
            Verify Your Identity
          </h4>

          <OTPInput length={6} onComplete={handleOTPComplete} />

          <div className="text-center text-sm text-gray-500">OR</div>

          <BiometricButton
            onSuccess={handleBiometricSuccess}
            onError={() => alert('Biometric verification failed')}
          />
        </div>
      )}
    </div>
  );
};

export default HighSecurityToggle;
import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const OTPForm = ({ email, onSuccess }) => {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { loginWithOTP } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      await loginWithOTP(email, otp);
      onSuccess?.();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="otp-form">
      <div className="input-group">
        <label>Enter 6-digit OTP sent to {email}</label>
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]{6}"
          maxLength={6}
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
          className="otp-input"
          autoFocus
        />
      </div>

      {error && <div className="error-message">{error}</div>}

      <button
        type="submit"
        disabled={isSubmitting || otp.length !== 6}
        className="submit-button"
      >
        {isSubmitting ? 'Verifying...' : 'Verify OTP'}
      </button>
    </form>
  );
};

export default OTPForm;
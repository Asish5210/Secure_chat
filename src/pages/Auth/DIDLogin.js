import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaEthereum, 
  FaFingerprint, 
  FaSpinner,
  FaShieldAlt 
} from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import PropTypes from 'prop-types';

/**
 * DIDLogin component for decentralized identity authentication
 * @param {Object} props - Component props
 * @param {Function} [props.onSuccess] - Callback after successful login
 * @param {Function} [props.onError] - Callback when login fails
 * @param {string} [props.redirectPath] - Path to redirect after login (default: '/')
 * @param {string} [props.buttonText] - Custom button text
 */
const DIDLogin = ({ 
  onSuccess, 
  onError, 
  redirectPath = '/', 
  buttonText = 'Login with DID' 
}) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState('');
  const { didLogin } = useAuth();
  const navigate = useNavigate();

  // Clear errors when component mounts
  useEffect(() => {
    setError('');
  }, []);

  const handleConnect = async () => {
    setIsConnecting(true);
    setError('');
    
    try {
      await didLogin();
      onSuccess?.();
      navigate(redirectPath);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 
                         err.message || 
                         'Failed to authenticate with DID';
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4"
      data-testid="did-login-page"
    >
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
        {/* Header with accessibility improvements */}
        <header className="bg-blue-600 p-6 text-white">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <FaEthereum aria-hidden="true" />
            <span>Decentralized Identity Login</span>
          </h1>
          <p className="mt-2 text-blue-100">
            <FaShieldAlt aria-hidden="true" /> Secure authentication
          </p>
        </header>

        <div className="p-6">
          {error && (
            <div 
              className="mb-4 p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-100 rounded-lg"
              role="alert"
              data-testid="error-message"
            >
              {error}
            </div>
          )}

          <button
            onClick={handleConnect}
            disabled={isConnecting}
            className={`w-full py-3 px-4 rounded-lg transition flex items-center justify-center gap-2
              ${isConnecting 
                ? 'bg-blue-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700'}
              text-white`}
            aria-busy={isConnecting}
            data-testid="did-login-button"
          >
            {isConnecting ? (
              <>
                <FaSpinner className="animate-spin" aria-hidden="true" />
                <span>Authenticating...</span>
              </>
            ) : (
              <>
                <FaFingerprint aria-hidden="true" />
                <span>{buttonText}</span>
              </>
            )}
          </button>

          <div className="mt-4 text-sm text-gray-600 dark:text-gray-300">
            <p>This will create a new decentralized identity or use your existing one.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

DIDLogin.propTypes = {
  onSuccess: PropTypes.func,
  onError: PropTypes.func,
  redirectPath: PropTypes.string,
  buttonText: PropTypes.string,
};

export default DIDLogin;
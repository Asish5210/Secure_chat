import PropTypes from 'prop-types';
import { FaKey, FaFingerprint } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';

const AuthModeToggle = ({ 
  passwordLabel = 'Password', 
  didLabel = 'DID Login'
}) => {
  const { authMode, setAuthMode } = useAuth();

  return (
    <div className="flex justify-center mb-6" data-testid="auth-mode-toggle">
      <div className="inline-flex rounded-md shadow-sm">
        <button
          type="button"
          onClick={() => setAuthMode('password')}
          className={`px-4 py-2 text-sm font-medium rounded-l-lg flex items-center gap-2 transition-colors
            ${authMode === 'password' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600'}`}
          aria-label="Email password login"
          data-testid="password-toggle"
        >
          <FaKey className="text-sm" />
          <span>{passwordLabel}</span>
        </button>
        <button
          type="button"
          onClick={() => setAuthMode('did')}
          className={`px-4 py-2 text-sm font-medium rounded-r-lg flex items-center gap-2 transition-colors
            ${authMode === 'did' 
              ? 'bg-purple-600 text-white' 
              : 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600'}`}
          aria-label="DID login"
          data-testid="did-toggle"
        >
          <FaFingerprint className="text-sm" />
          <span>{didLabel}</span>
        </button>
      </div>
    </div>
  );
};

AuthModeToggle.propTypes = {
  passwordLabel: PropTypes.string,
  didLabel: PropTypes.string,
};

export default AuthModeToggle;
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth, useAuthMode } from '../../contexts/AuthContext';
import AuthModeToggle from '../../components/Auth/AuthModeToggle';
import DIDAuthButton from '../../components/Auth/DIDAuthButton';
import { FaSpinner, FaSignInAlt, FaArrowRight } from 'react-icons/fa';
import PropTypes from 'prop-types';

const Login = ({ 
  onSuccess, 
  onError, 
  redirectPath = '/',
  showSignupLink = true
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { 
    login, 
    didLogin, 
    biometricLogin,
    biometricAvailable 
  } = useAuth();
  const { 
    isDIDMode, 
    isBiometricMode,
    setAuthMode
  } = useAuthMode();
  const navigate = useNavigate();

  // Clear errors when auth mode changes
  useEffect(() => {
    setError('');
  }, [isDIDMode]);

  // Auto-switch to password auth if biometric not available
  useEffect(() => {
    if (isBiometricMode && !biometricAvailable) {
      setAuthMode('password');
    }
  }, [isBiometricMode, biometricAvailable, setAuthMode]);

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setError('');
    setLoading(true);
    
    try {
      await login({ email, password });
      onSuccess?.();
      navigate(redirectPath);
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Login failed';
      setError(errorMsg);
      onError?.(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleDIDLogin = async () => {
    setLoading(true);
    setError('');
    try {
      if (isBiometricMode) {
        await biometricLogin();
      } else {
        await didLogin();
      }
      onSuccess?.();
      navigate(redirectPath);
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 
                      (isBiometricMode ? 'Biometric authentication failed' : 'DID login failed');
      setError(errorMsg);
      onError?.(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700 p-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Welcome Back</h2>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            {isDIDMode ? 'Access your decentralized identity' : 'Sign in to your account'}
          </p>
        </div>

        <AuthModeToggle />

        {error && (
          <div 
            className="mb-4 p-3 bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-100 rounded-lg"
            data-testid="error-message"
          >
            {error}
          </div>
        )}

        {isDIDMode ? (
          <div className="space-y-4">
            <DIDAuthButton 
              onClick={handleDIDLogin}
              disabled={loading}
              text={isBiometricMode ? 'Use Biometric Login' : 'Login with DID'}
              isBiometric={isBiometricMode}
            />
            
            {!isBiometricMode && (
              <button
                type="button"
                onClick={() => setAuthMode('password')}
                className="w-full flex items-center justify-center gap-2 text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                <span>Use email instead</span>
                <FaArrowRight className="text-xs" />
              </button>
            )}
          </div>
        ) : (
          <form onSubmit={handleEmailLogin} className="space-y-4" data-testid="login-form">
            <div className="space-y-1">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                data-testid="email-input"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                data-testid="password-input"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 dark:border-gray-600"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">
                  Forgot password?
                </a>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="auth-button btn-primary w-full"
              data-testid="login-button"
              aria-busy={loading}
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin mr-2" />
                  Signing in...
                </>
              ) : (
                <>
                  <FaSignInAlt className="mr-2" />
                  Sign in
                </>
              )}
            </button>
          </form>
        )}

        {showSignupLink && (
          <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
            Don't have an account?{' '}
            <Link 
              to="/signup" 
              className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
            >
              Sign up
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

Login.propTypes = {
  onSuccess: PropTypes.func,
  onError: PropTypes.func,
  redirectPath: PropTypes.string,
  showSignupLink: PropTypes.bool,
};

Login.defaultProps = {
  onSuccess: () => {},
  onError: () => {},
  redirectPath: '/',
  showSignupLink: true
};

export default Login;
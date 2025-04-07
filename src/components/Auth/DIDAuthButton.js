import PropTypes from 'prop-types';
import { FaEthereum, FaFingerprint } from 'react-icons/fa';

const DIDAuthButton = ({ 
  onClick, 
  disabled = false, 
  className = '', 
  text = null,
  icon = null,
  isBiometric = false
}) => {
  const IconComponent = icon || (isBiometric ? FaFingerprint : FaEthereum);
  const buttonText = text || (isBiometric ? 'Use Biometrics' : 'Login with DID');
  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full py-3 px-4 rounded-lg flex items-center justify-center gap-2 font-medium transition-colors
        ${disabled 
          ? 'bg-gray-400 cursor-not-allowed' 
          : 'bg-purple-600 hover:bg-purple-700 text-white'}
        ${className}`}
      aria-label={buttonText}
      aria-disabled={disabled}
      data-testid="did-auth-button"
    >
      <IconComponent className="text-lg" aria-hidden="true" />
      <span>{buttonText}</span>
    </button>
  );
};

DIDAuthButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  text: PropTypes.string,
  icon: PropTypes.elementType,
  isBiometric: PropTypes.bool,
};

export default DIDAuthButton;
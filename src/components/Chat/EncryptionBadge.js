import { FaLock, FaShieldAlt, FaKey } from 'react-icons/fa';

const EncryptionBadge = ({ level = 'standard' }) => {
  const levels = {
    standard: {
      icon: <FaLock className="text-green-500" />,
      text: 'Standard Encryption',
      color: 'bg-green-100 text-green-800'
    },
    high: {
      icon: <FaShieldAlt className="text-blue-500" />,
      text: 'High Security Mode',
      color: 'bg-blue-100 text-blue-800'
    },
    e2ee: {
      icon: <FaKey className="text-purple-500" />,
      text: 'End-to-End Encrypted',
      color: 'bg-purple-100 text-purple-800'
    }
  };

  const { icon, text, color } = levels[level] || levels.standard;

  return (
    <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${color}`}>
      {icon}
      <span className="ml-1.5">{text}</span>
    </div>
  );
};

export default EncryptionBadge;
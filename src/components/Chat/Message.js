import { motion } from 'framer-motion';
import { FaCheckDouble, FaLock } from 'react-icons/fa';

const Message = ({ text, isUser, timestamp, status }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
    >
      <div
        className={`max-w-xs md:max-w-md rounded-lg p-3 ${isUser
          ? 'bg-indigo-600 text-white rounded-br-none'
          : 'bg-gray-100 text-gray-800 rounded-bl-none'
          }`}
      >
        <div className="flex items-end gap-1">
          <p className="flex-1">{text}</p>
          <div className="flex items-center gap-1">
            <span className="text-xs opacity-70">
              {new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
            {isUser && (
              <span className="text-xs">
                {status === 'read' ? (
                  <FaCheckDouble className="text-blue-300" />
                ) : (
                  <FaCheckDouble className="text-gray-400" />
                )}
              </span>
            )}
          </div>
        </div>
        {status === 'encrypted' && (
          <div className="flex items-center mt-1 text-xs">
            <FaLock className="mr-1" />
            <span>End-to-end encrypted</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Message;
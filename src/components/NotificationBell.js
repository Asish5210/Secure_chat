import { FaBell, FaBellSlash } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useContext } from 'react';
import { NotificationContext } from '../contexts/NotificationContext';

const NotificationBell = () => {
  const { notifications } = useContext(NotificationContext);
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="relative">
      <motion.div
        animate={{
          rotate: unreadCount > 0 ? [0, 15, -15, 0] : 0,
          scale: unreadCount > 0 ? [1, 1.1, 1] : 1
        }}
        transition={{ duration: 0.5 }}
      >
        {unreadCount > 0 ? (
          <FaBell className="text-xl text-gray-700" />
        ) : (
          <FaBellSlash className="text-xl text-gray-400" />
        )}
      </motion.div>

      {unreadCount > 0 && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
        >
          {unreadCount}
        </motion.div>
      )}
    </div>
  );
};

export default NotificationBell;
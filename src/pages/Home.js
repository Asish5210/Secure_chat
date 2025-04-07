import React from 'react';
import { useAuth, useAuthMode } from '../contexts/AuthContext';
import { useNotifications } from '../contexts/NotificationContext';
import { useNavigate } from 'react-router-dom';
import { FaComment, FaShieldAlt, FaUser, FaKey, FaBell } from 'react-icons/fa';
import { motion } from 'framer-motion';
import NotificationBell from '../components/NotificationBell';
import EncryptionBadge from '../components/Chat/EncryptionBadge';
import PropTypes from 'prop-types';

const featureCards = [
  {
    icon: <FaComment className="text-blue-500" />,
    title: "Secure Chat",
    description: "End-to-end encrypted messaging",
    path: "/chat"
  },
  {
    icon: <FaShieldAlt className="text-green-500" />,
    title: "High Security Mode",
    description: "Biometric-protected chats",
    path: "/chat?mode=high"
  },
  {
    icon: <FaUser className="text-purple-500" />,
    title: "Profile",
    description: "Manage your account",
    path: "/profile"
  },
  {
    icon: <FaKey className="text-orange-500" />,
    title: "Security Settings",
    description: "Encryption controls",
    path: "/settings/security"
  }
];

const Home = () => {
  const { user } = useAuth();
  const { isDIDMode } = useAuthMode();
  const { notifications } = useNotifications();
  const navigate = useNavigate();
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white"
          >
            Welcome back, <span className="text-indigo-600 dark:text-indigo-400">
              {user?.name || (isDIDMode ? 'DID User' : 'Guest')}
            </span>
          </motion.h1>

          <div className="flex items-center gap-4">
            <NotificationBell count={unreadCount} />
            <button
              onClick={() => navigate('/settings')}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
              aria-label="Settings"
            >
              <FaBell className="text-gray-600 dark:text-gray-300" />
            </button>
          </div>
        </div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {featureCards.map((feature, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -5 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => navigate(feature.path)}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer border border-gray-100 dark:border-gray-700"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-50 dark:bg-gray-700 rounded-lg text-xl">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-gray-800 dark:text-white">
                    {feature.title}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    {feature.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Security Status Card */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700"
        >
          <h2 className="font-semibold text-lg mb-4 flex items-center gap-2 text-gray-800 dark:text-white">
            <FaShieldAlt className="text-green-500" />
            Security Status
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-300">Authentication</span>
              <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-sm rounded-full">
                {isDIDMode ? 'DID' : 'Password'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-300">Encryption</span>
              <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm rounded-full">
                AES-256 + RSA-2048
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-300">Last Active</span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {new Date().toLocaleString()}
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// 🔐 PropTypes
Home.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string,
    did: PropTypes.string
  })
};

export default Home;

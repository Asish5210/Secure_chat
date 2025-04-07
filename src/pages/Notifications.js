import { useContext } from 'react';
import { NotificationContext } from '../contexts/NotificationContext';
import { FaBell, FaShieldAlt, FaKey, FaInfoCircle, FaCheck } from 'react-icons/fa';

const Notifications = () => {
  const { notifications, markAsRead } = useContext(NotificationContext);

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'security':
        return <FaShieldAlt className="text-blue-500" />;
      case 'key':
        return <FaKey className="text-green-500" />;
      default:
        return <FaInfoCircle className="text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <FaBell className="text-2xl text-indigo-600" />
          <h1 className="text-2xl font-bold">Notifications</h1>
        </div>

        {notifications.length === 0 ? (
          <div className="bg-white p-8 rounded-xl shadow-sm text-center">
            <FaBell className="mx-auto text-3xl text-gray-400 mb-3" />
            <h3 className="text-lg font-medium text-gray-500">No notifications yet</h3>
            <p className="text-gray-400">We'll notify you when something arrives</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                onClick={() => markAsRead(notification.id)}
                className={`p-4 rounded-xl shadow-sm cursor-pointer transition ${notification.read ? 'bg-white' : 'bg-blue-50 border border-blue-200'}`}
              >
                <div className="flex gap-3">
                  <div className="text-2xl mt-0.5">
                    {getNotificationIcon(notification.icon)}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium">{notification.title}</h3>
                      {notification.read && (
                        <FaCheck className="text-green-500 text-sm mt-1" />
                      )}
                    </div>
                    <p className="text-gray-600 text-sm mt-0.5">
                      {notification.message}
                    </p>
                    <p className="text-gray-400 text-xs mt-2">
                      {new Date(notification.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
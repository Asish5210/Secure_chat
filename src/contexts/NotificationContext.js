import { createContext, useState, useEffect, useContext, useCallback } from 'react';

// Create the context once at the top level
const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('notifications');
    if (saved) {
      try {
        setNotifications(JSON.parse(saved));
      } catch (error) {
        console.error('Failed to parse notifications', error);
        localStorage.removeItem('notifications');
      }
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(notifications));
  }, [notifications]);

  const addNotification = useCallback((notification) => {
    setNotifications(prev => [
      {
        ...notification,
        id: Date.now(),
        timestamp: new Date().toISOString(),
        read: false
      },
      ...prev.slice(0, 49) // Keep max 50 notifications
    ]);
  }, []);

  const markAsRead = useCallback((id) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  }, []);

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, markAsRead }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
};

// Export the already created context (no need to recreate it)
export { NotificationContext };
import { createContext, useState, useContext } from 'react';
import { notifyHighSecurityEnabled } from '../Services/notificationService';

const SecurityContext = createContext();

export const SecurityProvider = ({ children }) => {
  const [securityMode, setSecurityMode] = useState('standard');
  const [ephemeralSettings, setEphemeralSettings] = useState({
    autoLock: true,
    duration: 24 // hours
  });

  const enableHighSecurity = async (recipientId) => {
    setSecurityMode('high');
    await notifyHighSecurityEnabled(recipientId);
  };

  return (
    <SecurityContext.Provider value={{
      securityMode,
      ephemeralSettings,
      enableHighSecurity,
      disableHighSecurity: () => setSecurityMode('standard')
    }}>
      {children}
    </SecurityContext.Provider>
  );
};

export const useSecurity = () => useContext(SecurityContext);
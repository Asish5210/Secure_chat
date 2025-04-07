import { AuthProvider } from './AuthContext';
import { NotificationProvider } from './NotificationContext';
import { ThemeProvider } from './ThemeContext';
import { SecurityProvider } from './SecurityContext';

const CombinedProviders = ({ children }) => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NotificationProvider>
          <SecurityProvider>
            {children}
          </SecurityProvider>
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default CombinedProviders;
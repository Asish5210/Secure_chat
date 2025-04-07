import { useState, useContext } from 'react';
import { 
  FaMoon, 
  FaSun, 
  FaBell, 
  FaShieldAlt, 
  FaKey, 
  FaFingerprint,
  FaDesktop,
  FaSignOutAlt
} from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import PasswordChangeForm from '../components/Settings/PasswordChangeForm';
import SessionManager from '../components/Settings/SessionManager';

const Settings = () => {
  const { user, logout } = useAuth();
  const [darkMode, setDarkMode] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [securityLevel, setSecurityLevel] = useState('standard');
  const [activeTab, setActiveTab] = useState('general');

  // Enhanced security options
  const securityOptions = [
    { 
      id: 'standard', 
      label: 'Standard Encryption', 
      description: 'AES-256 + RSA-2048' 
    },
    { 
      id: 'high', 
      label: 'High Security', 
      description: 'AES-256 + RSA-4096 with OTP' 
    }
  ];

  return (
    <div className={`settings-page ${darkMode ? 'dark' : ''}`}>
      <div className="settings-container">
        
        {/* Sidebar Navigation */}
        <div className="settings-sidebar">
          <div 
            className={`sidebar-item ${activeTab === 'general' ? 'active' : ''}`}
            onClick={() => setActiveTab('general')}
          >
            <FaSun className="icon" />
            <span>General</span>
          </div>
          <div 
            className={`sidebar-item ${activeTab === 'security' ? 'active' : ''}`}
            onClick={() => setActiveTab('security')}
          >
            <FaShieldAlt className="icon" />
            <span>Security</span>
          </div>
          <div 
            className={`sidebar-item ${activeTab === 'sessions' ? 'active' : ''}`}
            onClick={() => setActiveTab('sessions')}
          >
            <FaDesktop className="icon" />
            <span>Active Sessions</span>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="settings-content">
          
          {activeTab === 'general' && (
            <>
              <h2 className="section-title">
                <FaSun className="icon" />
                Appearance
              </h2>
              <div className="setting-item">
                <div className="setting-label">
                  <span>Dark Mode</span>
                  <p>Switch between light and dark themes</p>
                </div>
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className={`toggle-switch ${darkMode ? 'active' : ''}`}
                  aria-label="Toggle dark mode"
                >
                  <div className="toggle-knob" />
                </button>
              </div>

              <div className="setting-item">
                <div className="setting-label">
                  <FaBell className="icon" />
                  <span>Notifications</span>
                  <p>Enable or disable system notifications</p>
                </div>
                <button
                  onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                  className={`toggle-switch ${notificationsEnabled ? 'active' : ''}`}
                  aria-label="Toggle notifications"
                >
                  <div className="toggle-knob" />
                </button>
              </div>
            </>
          )}

          {activeTab === 'security' && (
            <>
              <h2 className="section-title">
                <FaShieldAlt className="icon" />
                Security Settings
              </h2>

              <div className="setting-item">
                <div className="setting-label">
                  <span>Default Encryption Level</span>
                  <p>Choose your preferred security level</p>
                </div>
                <div className="security-options">
                  {securityOptions.map((option) => (
                    <div 
                      key={option.id}
                      className={`security-option ${securityLevel === option.id ? 'selected' : ''}`}
                      onClick={() => setSecurityLevel(option.id)}
                    >
                      <FaShieldAlt className="option-icon" />
                      <div>
                        <h4>{option.label}</h4>
                        <p>{option.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="setting-item">
                <div className="setting-label">
                  <FaFingerprint className="icon" />
                  <span>Biometric Authentication</span>
                  <p>Enable Face ID/Touch ID login</p>
                </div>
                <button
                  onClick={() => {}}
                  className={`toggle-switch ${user?.biometricEnabled ? 'active' : ''}`}
                  aria-label="Toggle biometric auth"
                >
                  <div className="toggle-knob" />
                </button>
              </div>

              <PasswordChangeForm />
            </>
          )}

          {activeTab === 'sessions' && (
            <SessionManager />
          )}

          <div className="logout-section">
            <button 
              onClick={logout}
              className="logout-button"
            >
              <FaSignOutAlt />
              <span>Logout All Sessions</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
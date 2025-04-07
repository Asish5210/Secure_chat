import { FaDesktop, FaSignOutAlt } from 'react-icons/fa';

const SessionManager = () => {
  // Mock data - replace with real session data
  const sessions = [
    { id: 1, device: 'iPhone 13', location: 'New York', lastActive: '2 hours ago' },
    { id: 2, device: 'MacBook Pro', location: 'San Francisco', lastActive: '5 minutes ago' }
  ];

  return (
    <div className="session-manager">
      <h2 className="section-title">
        <FaDesktop className="icon" />
        Active Sessions
      </h2>

      <div className="sessions-list">
        {sessions.map((session) => (
          <div key={session.id} className="session-item">
            <div className="session-info">
              <h4>{session.device}</h4>
              <p>{session.location} • {session.lastActive}</p>
            </div>
            <button className="logout-session-button">
              <FaSignOutAlt />
              <span>Logout</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SessionManager;
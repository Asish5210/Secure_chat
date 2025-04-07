import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow-sm py-4 px-6 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold text-indigo-600">SecureChat</Link>
      <nav className="flex items-center gap-4">
        {user ? (
          <>
            <Link to="/profile" className="hover:text-indigo-600">Profile</Link>
            <button 
              onClick={logout}
              className="bg-red-100 text-red-600 px-3 py-1 rounded-lg hover:bg-red-200"
            >
              Logout
            </button>
          </>
        ) : (
          <Link to="/login" className="bg-indigo-600 text-white px-3 py-1 rounded-lg hover:bg-indigo-700">
            Login
          </Link>
        )}
      </nav>
    </header>
  );
};

export default Header;
import { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { FaUser, FaEnvelope, FaKey, FaEdit, FaSave } from 'react-icons/fa';

const Profile = () => {
  const { user, logout } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    // In a real app, save to backend
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="bg-indigo-600 p-6 text-white">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <FaUser />
            <span>Your Profile</span>
          </h1>
        </div>

        <div className="p-6 space-y-6">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <FaUser className="text-gray-500" />
              <span>Full Name</span>
            </label>
            {isEditing ? (
              <input
                type="text"
                name="name"
                value={profileData.name}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg mt-1"
              />
            ) : (
              <p className="p-2 bg-gray-50 rounded-lg">{profileData.name}</p>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <FaEnvelope className="text-gray-500" />
              <span>Email</span>
            </label>
            {isEditing ? (
              <input
                type="email"
                name="email"
                value={profileData.email}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg mt-1"
              />
            ) : (
              <p className="p-2 bg-gray-50 rounded-lg">{profileData.email}</p>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <FaKey className="text-gray-500" />
              <span>Security</span>
            </label>
            <div className="p-3 bg-gray-50 rounded-lg space-y-2">
              <p className="text-sm">Last login: {new Date().toLocaleString()}</p>
              <p className="text-sm">Encryption: AES-256 + RSA</p>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
              className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition flex items-center justify-center gap-2"
            >
              {isEditing ? <FaSave /> : <FaEdit />}
              <span>{isEditing ? 'Save Changes' : 'Edit Profile'}</span>
            </button>
            <button
              onClick={logout}
              className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
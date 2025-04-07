import React from 'react';
import PropTypes from 'prop-types';
import { useAuth } from '../../contexts/AuthContext'; 
import Header from './Header';
import Footer from './Footer';
import LoadingOverlay from './LoadingOverlay';

const Layout = ({ children }) => {
  const { loading } = useAuth();

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Loading overlay (shows during authentication checks) */}
      {loading && <LoadingOverlay />}
      
      {/* Header (visible on all pages) */}
      <Header />
      
      {/* Main content area */}
      <main className="flex-grow container mx-auto px-4 py-6">
        {children}
      </main>
      
      {/* Footer (visible on all pages) */}
      <Footer />
    </div>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired
};

export default Layout;
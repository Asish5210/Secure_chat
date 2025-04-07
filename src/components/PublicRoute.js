import PropTypes from 'prop-types';
import { useAuth } from '../contexts/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';
import LoadingOverlay from './layout/LoadingOverlay';

/**
 * PublicRoute component that redirects authenticated users away from public pages
 * @param {object} props - Component props
 * @param {ReactNode} props.children - Child components to render if not authenticated
 * @param {string} [props.redirectPath] - Custom redirect path for authenticated users
 * @param {boolean} [props.restricted] - If true, prevents access even when unauthenticated
 * @returns {ReactNode} Either the children, loading overlay, or redirect
 */
const PublicRoute = ({ 
  children, 
  redirectPath = '/', 
  restricted = false 
}) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingOverlay fullScreen />;
  }

  // Redirect authenticated users or if route is restricted
  if (user || restricted) {
    return (
      <Navigate
        to={redirectPath}
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  return children;
};

PublicRoute.propTypes = {
  children: PropTypes.node.isRequired,
  redirectPath: PropTypes.string,
  restricted: PropTypes.bool,
};

export default PublicRoute;
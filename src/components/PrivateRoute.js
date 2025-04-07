import PropTypes from 'prop-types';
import { useAuth } from '../contexts/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';
import LoadingOverlay from './layout/LoadingOverlay';

/**
 * PrivateRoute component that protects routes from unauthorized access
 * @param {object} props - Component props
 * @param {ReactNode} props.children - Child components to render if authenticated
 * @param {string} [props.requiredRole] - Optional required role for access
 * @param {string} [props.redirectPath] - Custom redirect path when unauthorized
 * @returns {ReactNode} Either the children, loading overlay, or redirect
 */
const PrivateRoute = ({ children, requiredRole, redirectPath = '/login' }) => {
  const { user, loading, roles } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingOverlay fullScreen />;
  }

  // Check if user exists and has required role (if specified)
  const isAuthorized = user && (!requiredRole || roles?.includes(requiredRole));

  if (!isAuthorized) {
    // Redirect to login with return location for post-login redirect
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

PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
  requiredRole: PropTypes.string,
  redirectPath: PropTypes.string,
};

export default PrivateRoute;
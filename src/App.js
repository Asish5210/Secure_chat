import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense, useState } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Layout from './components/layout/Layout';
import PrivateRoute from './components/PrivateRoute';
import PublicRoute from './components/PublicRoute';

// Lazy-loaded pages
const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Auth/Login'));
const Signup = lazy(() => import('./pages/Auth/Signup'));
const Chat = lazy(() => import('./pages/Chat'));
const Profile = lazy(() => import('./pages/Profile'));
const Settings = lazy(() => import('./pages/Settings'));
const Notifications = lazy(() => import('./pages/Notifications'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Fallback components
const LoadingScreen = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="text-xl font-medium">Loading...</div>
  </div>
);

const ErrorFallback = ({ error, resetErrorBoundary }) => (
  <div className="p-4 text-red-600">
    <h2>Something went wrong</h2>
    <pre>{error.message}</pre>
    <button 
      onClick={resetErrorBoundary}
      className="px-4 py-2 mt-4 text-white bg-blue-600 rounded hover:bg-blue-700"
    >
      Try Again
    </button>
  </div>
);

const ErrorBoundary = ({ children }) => {
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState(null);

  return hasError ? (
    <ErrorFallback error={error} resetErrorBoundary={() => setHasError(false)} />
  ) : (
    children
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NotificationProvider>
          <BrowserRouter>
            <Layout>
              <ErrorBoundary>
                <Suspense fallback={<LoadingScreen />}>
                  <Routes>
                    {/* Public Routes */}
                    <Route path="/login" element={
                      <PublicRoute redirectTo="/">
                        <Login />
                      </PublicRoute>
                    } />
                    <Route path="/signup" element={
                      <PublicRoute redirectTo="/">
                        <Signup />
                      </PublicRoute>
                    } />

                    {/* Private Routes */}
                    <Route path="/" element={
                      <PrivateRoute>
                        <Home />
                      </PrivateRoute>
                    } />
                    <Route path="/chat" element={
                      <PrivateRoute>
                        <Chat />
                      </PrivateRoute>
                    } />
                    <Route path="/profile" element={
                      <PrivateRoute>
                        <Profile />
                      </PrivateRoute>
                    } />
                    <Route path="/settings" element={
                      <PrivateRoute>
                        <Settings />
                      </PrivateRoute>
                    } />
                    <Route path="/notifications" element={
                      <PrivateRoute>
                        <Notifications />
                      </PrivateRoute>
                    } />

                    {/* Fallback Routes */}
                    <Route path="/404" element={<NotFound />} />
                    <Route path="*" element={<Navigate to="/404" replace />} />
                  </Routes>
                </Suspense>
              </ErrorBoundary>
            </Layout>
          </BrowserRouter>
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
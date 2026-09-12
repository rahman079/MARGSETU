import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'sonner';
import { RoadProvider } from './context/RoadContext';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import Header from './components/Header';
import LandingPage from './pages/LandingPage';
import CitizenPortal from './pages/CitizenPortal';
import GovtPortal from './pages/GovtPortal';
import AuthPage from './pages/AuthPage';

/**
 * ProtectedRoute Component:
 * If the user is not authenticated for the specific role (and has not opted for guest exploration),
 * directs them to the respective Sign In / Sign Up page with a return redirect.
 */
function ProtectedRoute({ children, requiredRole }) {
  const { user, isAuthenticated, guestAccess } = useAuth();
  const location = useLocation();

  const isRoleAuthenticated = isAuthenticated && user?.role === requiredRole;
  const isGuestAllowed = guestAccess?.[requiredRole];

  if (!isRoleAuthenticated && !isGuestAllowed) {
    return <Navigate to={`/login?role=${requiredRole}&redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  return children;
}

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <RoadProvider>
          <div className="min-h-screen bg-slate-50 flex flex-col font-sans relative">
            <Toaster 
              position="top-right" 
              richColors 
              closeButton 
              toastOptions={{
                style: {
                  borderRadius: '16px',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '13px',
                  boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.15)',
                  border: '1px solid rgba(226, 232, 240, 0.8)'
                }
              }}
            />
            <Header />
            <main className="flex-1 relative">
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route 
                  path="/citizen" 
                  element={
                    <ProtectedRoute requiredRole="citizen">
                      <CitizenPortal />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/govt" 
                  element={
                    <ProtectedRoute requiredRole="govt">
                      <GovtPortal />
                    </ProtectedRoute>
                  } 
                />
                <Route path="/login" element={<AuthPage />} />
                <Route path="/signup" element={<AuthPage />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/citizen/auth" element={<AuthPage />} />
                <Route path="/govt/auth" element={<AuthPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
          </div>
        </RoadProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}

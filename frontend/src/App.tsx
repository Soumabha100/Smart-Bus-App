import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import {
  OnboardingPage,
  LoginPage,
  RegisterPage,
  HomePage,
  ResultsPage,
  NotFoundPage,
  SystemStatusPage,
} from './pages';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { tokenStorage } from './utils/tokenStorage';

export function App() {
  const isAuth = tokenStorage.isAuthenticated();

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={isAuth ? <Navigate to="/home" replace /> : <OnboardingPage />}
        />
        <Route
          path="/login"
          element={isAuth ? <Navigate to="/home" replace /> : <LoginPage />}
        />
        <Route
          path="/register"
          element={isAuth ? <Navigate to="/home" replace /> : <RegisterPage />}
        />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/results"
          element={
            <ProtectedRoute>
              <ResultsPage />
            </ProtectedRoute>
          }
        />
        {/* Preserved Sprint 0 System Status Route */}
        <Route path="/system-status" element={<SystemStatusPage />} />
        {/* 404 Route */}
        <Route path="/404" element={<NotFoundPage />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

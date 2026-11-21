import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { AppLayout } from './components/layout/AppLayout';

// Lazy-loaded routes for code-splitting and sub-300ms initial bundle
const HomePage = lazy(() => import('./pages/HomePage'));
const FeaturesPage = lazy(() => import('./pages/FeaturesPage'));
const HowItWorksPage = lazy(() => import('./pages/HowItWorksPage'));
const RoutesPage = lazy(() => import('./pages/RoutesPage'));
const AskAiPage = lazy(() => import('./pages/AskAiPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const PrivacyPage = lazy(() => import('./pages/PrivacyPage'));
const TermsPage = lazy(() => import('./pages/TermsPage'));
const FaqPage = lazy(() => import('./pages/FaqPage'));
const ResultsPage = lazy(() => import('./pages/ResultsPage'));
const SystemStatusPage = lazy(() => import('./pages/SystemStatusPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

// Lightweight accessible loading fallback with zero cumulative layout shift
const PageLoader = () => (
  <div className="w-full min-h-[50vh] flex items-center justify-center" aria-label="Loading page content">
    <div className="w-8 h-8 rounded-full border-2 border-primary border-t-accent animate-spin" />
  </div>
);

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Universal Glassmorphic Layout wrapping all pages */}
            <Route element={<AppLayout />}>
              {/* Primary Entry Point: OneGoBus Home */}
              <Route path="/" element={<HomePage />} />
              <Route path="/home" element={<Navigate to="/" replace />} />

              {/* Public Discovery Routes */}
              <Route path="/features" element={<FeaturesPage />} />
              <Route path="/how-it-works" element={<HowItWorksPage />} />
              <Route path="/routes" element={<RoutesPage />} />
              <Route path="/ask-ai" element={<AskAiPage />} />
              <Route path="/about" element={<AboutPage />} />

              {/* Auth Routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* Authenticated Traveler Profile Route */}
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />

              {/* Support & Legal Routes */}
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/faq" element={<FaqPage />} />

              {/* Bus Search Results */}
              <Route path="/results" element={<ResultsPage />} />

              {/* Sprint 0 System Health */}
              <Route path="/system-status" element={<SystemStatusPage />} />

              {/* 404 Fallback */}
              <Route path="/404" element={<NotFoundPage />} />
              <Route path="*" element={<Navigate to="/404" replace />} />
            </Route>
          </Routes>
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
